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

    public function handle(Request $request, Closure $next): Response
    {
        $token = $this->extractToken($request);

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token d\'authentification manquant',
                'error_code' => 'MISSING_TOKEN',
            ], 401);
        }

        $validation = $this->jwtService->validateAccessToken($token);

        if (!$validation['valid']) {
            $message = $validation['expired'] 
                ? 'Token expiré' 
                : 'Token invalide';
            
            $errorCode = $validation['expired'] 
                ? 'TOKEN_EXPIRED' 
                : 'INVALID_TOKEN';

            return response()->json([
                'success' => false,
                'message' => $message,
                'error_code' => $errorCode,
            ], 401);
        }

        $user = User::find($validation['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error_code' => 'USER_NOT_FOUND',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
                'error_code' => 'ACCOUNT_DISABLED',
            ], 403);
        }

        if ($user->isLocked()) {
            return response()->json([
                'success' => false,
                'message' => 'Compte temporairement verrouillé',
                'error_code' => 'ACCOUNT_LOCKED',
                'locked_until' => $user->locked_until->toISOString(),
            ], 423);
        }

        // Attacher l'utilisateur à la requête
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
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