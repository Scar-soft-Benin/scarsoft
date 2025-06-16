<?php
// app/Auth/JWTGuard.php

namespace App\Auth;

use App\Models\User;
use App\Services\JWTService;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;

class JWTGuard implements Guard
{
    use GuardHelpers;

    private JWTService $jwtService;
    private Request $request;

    public function __construct(UserProvider $provider, JWTService $jwtService, Request $request)
    {
        $this->provider = $provider;
        $this->jwtService = $jwtService;
        $this->request = $request;
    }

    public function user()
    {
        if (!is_null($this->user)) {
            return $this->user;
        }

        $token = $this->extractToken();
        
        if (!$token) {
            return null;
        }

        $validation = $this->jwtService->validateAccessToken($token);
        
        if (!$validation['valid']) {
            return null;
        }

        $this->user = $this->provider->retrieveById($validation['user_id']);
        
        return $this->user;
    }

    public function validate(array $credentials = [])
    {
        if (empty($credentials['email']) || empty($credentials['password'])) {
            return false;
        }

        $user = $this->provider->retrieveByCredentials($credentials);

        return $user && $this->provider->validateCredentials($user, $credentials);
    }

    public function attempt(array $credentials = [], $remember = false)
    {
        $user = $this->provider->retrieveByCredentials($credentials);

        if ($user && $this->provider->validateCredentials($user, $credentials)) {
            $this->setUser($user);
            return true;
        }

        return false;
    }

    // ✅ Méthode manquante requise par tymon/jwt-auth
    public function onceUsingId($id)
    {
        if (!is_null($user = $this->provider->retrieveById($id))) {
            $this->setUser($user);
            return $user;
        }

        return false;
    }

    // ✅ Méthode additionnelle pour compatibilité
    public function once(array $credentials = [])
    {
        if ($user = $this->provider->retrieveByCredentials($credentials)) {
            if ($this->provider->validateCredentials($user, $credentials)) {
                $this->setUser($user);
                return true;
            }
        }

        return false;
    }

    // ✅ Méthode pour login basique
    public function login(Authenticatable $user, $remember = false)
    {
        $this->setUser($user);
    }

    // ✅ Méthode pour login par ID
    public function loginUsingId($id, $remember = false)
    {
        if (!is_null($user = $this->provider->retrieveById($id))) {
            $this->login($user, $remember);
            return $user;
        }

        return false;
    }

    // ✅ Méthode de logout
    public function logout()
    {
        $this->user = null;
    }

    // ✅ Méthode pour vérifier l'authentification
    public function check()
    {
        return !is_null($this->user());
    }

    // ✅ Méthode pour vérifier si non authentifié
    public function guest()
    {
        return !$this->check();
    }

    // ✅ Méthode pour obtenir l'ID utilisateur
    public function id()
    {
        if ($user = $this->user()) {
            return $user->getAuthIdentifier();
        }
    }

    // ✅ Méthode pour set l'utilisateur avec événements
    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
        return $this;
    }

    // ✅ Méthode pour vérification basique
    public function basic($field = 'email', $extraConditions = [])
    {
        return false; // Non supporté pour JWT
    }

    // ✅ Méthode pour vérification basique une fois
    public function onceBasic($field = 'email', $extraConditions = [])
    {
        return false; // Non supporté pour JWT
    }

    // ✅ Méthode pour vérifier le "remember me"
    public function viaRemember()
    {
        return false; // Non supporté pour JWT
    }

    private function extractToken(): ?string
    {
        $authHeader = $this->request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        return substr($authHeader, 7);
    }
}