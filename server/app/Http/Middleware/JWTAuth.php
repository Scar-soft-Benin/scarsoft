<?php
// app/Http/Middleware/JWTAuth.php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JWTService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class JWTAuth
{
    private JWTService $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return $this->unauthorizedResponse('Token d\'authentification manquant');
        }

        $validation = $this->jwtService->validateAccessToken($token);

        if (!$validation['valid']) {
            if ($validation['expired']) {
                return $this->unauthorizedResponse(
                    'Token d\'authentification expiré',
                    'TOKEN_EXPIRED'
                );
            }

            return $this->unauthorizedResponse(
                'Token d\'authentification invalide',
                'INVALID_TOKEN'
            );
        }

        $user = User::find($validation['user_id']);

        if (!$user) {
            return $this->unauthorizedResponse(
                'Utilisateur non trouvé',
                'USER_NOT_FOUND'
            );
        }

        if (!$user->is_active) {
            return $this->unauthorizedResponse(
                'Compte utilisateur désactivé',
                'ACCOUNT_DISABLED'
            );
        }

        if ($user->isLocked()) {
            return $this->unauthorizedResponse(
                'Compte temporairement verrouillé',
                'ACCOUNT_LOCKED'
            );
        }

        // Vérifier si l'email est vérifié pour certaines routes
        if ($this->requiresEmailVerification($request) && !$user->hasVerifiedEmail()) {
            return $this->forbiddenResponse(
                'Email non vérifié',
                'EMAIL_NOT_VERIFIED'
            );
        }

        // Attacher l'utilisateur et les informations du token à la requête
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $request->attributes->set('jwt_payload', $validation['payload']);
        $request->attributes->set('jwt_token', $token);

        return $next($request);
    }

    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader) {
            return null;
        }

        if (!str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        return substr($authHeader, 7);
    }

    private function requiresEmailVerification(Request $request): bool
    {
        // Définir les routes qui nécessitent une vérification email
        $protectedRoutes = [
            'api/auth/me',
            'api/auth/logout',
            // Ajouter d'autres routes qui nécessitent une vérification email
        ];

        $currentRoute = $request->path();

        foreach ($protectedRoutes as $route) {
            if (str_starts_with($currentRoute, $route)) {
                return true;
            }
        }

        return false;
    }

    private function unauthorizedResponse(string $message, string $errorCode = 'UNAUTHORIZED'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => $errorCode,
        ], 401);
    }

    private function forbiddenResponse(string $message, string $errorCode = 'FORBIDDEN'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => $errorCode,
        ], 403);
    }
}