<?php
// app/Http/Controllers/API/AuthController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\RefreshToken;
use App\Services\JWTService;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Carbon;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="API endpoints for user authentication"
 * )
 */
class AuthController extends Controller
{
    private JWTService $jwtService;
    private OTPService $otpService;

    public function __construct(JWTService $jwtService, OTPService $otpService)
    {
        $this->jwtService = $jwtService;
        $this->otpService = $otpService;
    }

    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     summary="Register a new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="User registered successfully"),
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="verification_required", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function register(Request $request): JsonResponse
    {
        // Limitation du taux pour prévenir les abus
        $key = 'register:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives d\'inscription. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'is_active' => true,
            ]);

            // Générer le code de vérification email
            $otpResult = $this->otpService->generateEmailVerificationCode($user->email);

            RateLimiter::clear($key);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'is_active' => $user->is_active,
                ],
                'verification_required' => true,
                'verification_sent' => $otpResult['success'],
            ], 201);

        } catch (\Exception $e) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du compte',
                'error_code' => 'REGISTRATION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     summary="Login user - Step 1: Verify credentials and send OTP",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123"),
     *             @OA\Property(property="device_name", type="string", example="iPhone 12"),
     *             @OA\Property(property="device_type", type="string", example="mobile")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Credentials verified, OTP sent",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Credentials verified. OTP sent to your email"),
     *             @OA\Property(property="login_session_id", type="string", example="abc123..."),
     *             @OA\Property(property="otp_expires_at", type="string", format="date-time"),
     *             @OA\Property(property="next_step", type="string", example="verify_login_otp")
     *         )
     *     )
     * )
     */
    public function login(Request $request): JsonResponse
    {
        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de connexion. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string|max:255',
            'device_type' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key);
            
            if ($user) {
                $user->incrementFailedAttempts();
            }

            return response()->json([
                'success' => false,
                'message' => 'Identifiants invalides',
                'error_code' => 'INVALID_CREDENTIALS',
            ], 401);
        }

        if (!$user->is_active) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
                'error_code' => 'ACCOUNT_DISABLED',
            ], 403);
        }

        if ($user->isLocked()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Compte temporairement verrouillé en raison de trop nombreuses tentatives',
                'error_code' => 'ACCOUNT_LOCKED',
                'locked_until' => $user->locked_until->toISOString(),
            ], 423);
        }

        // Identifiants valides - Générer OTP de connexion
        $otpResult = $this->otpService->generateLoginVerificationCode($user->email, [
            'device_name' => $request->device_name,
            'device_type' => $request->device_type,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if (!$otpResult['success']) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du code de vérification',
                'error_code' => 'OTP_GENERATION_FAILED',
            ], 500);
        }

        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
            'message' => 'Identifiants vérifiés. Code de vérification envoyé par email.',
            'login_session_id' => $otpResult['login_session_id'],
            'otp_expires_at' => $otpResult['expires_at'],
            'next_step' => 'verify_login_otp',
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/verify-login-otp",
     *     summary="Login user - Step 2: Verify OTP and get tokens",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","code","login_session_id"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="code", type="string", example="123456"),
     *             @OA\Property(property="login_session_id", type="string", example="abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="refresh_token", type="string"),
     *             @OA\Property(property="token_type", type="string", example="Bearer"),
     *             @OA\Property(property="expires_in", type="integer", example=900),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function verifyLoginOtp(Request $request): JsonResponse
    {
        $key = 'login_verify:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de vérification. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'login_session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error_code' => 'USER_NOT_FOUND',
            ], 404);
        }

        // Vérifier l'OTP de connexion
        $verification = $this->otpService->verifyLoginCode(
            $request->email,
            $request->code,
            $request->login_session_id
        );

        if (!$verification['valid']) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => $verification['error'],
                'error_code' => $verification['error_code'],
                'attempts_left' => $verification['attempts_left'] ?? null,
            ], 400);
        }

        // Connexion réussie
        RateLimiter::clear($key);
        $user->resetFailedAttempts();
        $user->updateLastLogin($request->ip());

        // Récupérer les informations de device stockées
        $deviceInfo = $verification['device_info'] ?? [];

        // Générer les tokens
        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshTokenModel = $this->jwtService->generateRefreshToken($user, $deviceInfo);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'access_token' => $accessToken,
            'refresh_token' => $refreshTokenModel->token,
            'token_type' => 'Bearer',
            'expires_in' => config('app.jwt_access_token_expiration', 15) * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/resend-login-otp",
     *     summary="Resend login OTP code",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","login_session_id"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="login_session_id", type="string", example="abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login OTP resent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login OTP resent"),
     *             @OA\Property(property="expires_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function resendLoginOtp(Request $request): JsonResponse
    {
        $key = 'login_resend:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de demandes de renvoi. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'login_session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->otpService->resendLoginCode($request->email, $request->login_session_id);

        if (!$result['success']) {
            if ($result['error_code'] === 'TOO_FREQUENT') {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'error_code' => $result['error_code'],
                    'retry_after' => $result['retry_after'],
                ], 429);
            }

            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => $result['error'],
                'error_code' => $result['error_code'],
            ], 400);
        }

        RateLimiter::hit($key);

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'expires_at' => $result['expires_at'],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/refresh",
     *     summary="Refresh access token",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"refresh_token"},
     *             @OA\Property(property="refresh_token", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Token refreshed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="refresh_token", type="string"),
     *             @OA\Property(property="token_type", type="string", example="Bearer"),
     *             @OA\Property(property="expires_in", type="integer", example=900)
     *         )
     *     )
     * )
     */
    public function refresh(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Token de rafraîchissement requis',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->jwtService->refreshAccessToken($request->refresh_token);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['error'],
                'error_code' => 'INVALID_REFRESH_TOKEN',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token rafraîchi avec succès',
            'access_token' => $result['access_token'],
            'refresh_token' => $result['refresh_token'],
            'token_type' => 'Bearer',
            'expires_in' => $result['expires_in'],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Logout user",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"refresh_token"},
     *             @OA\Property(property="refresh_token", type="string"),
     *             @OA\Property(property="logout_all_devices", type="boolean", example=false)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Logout successful")
     *         )
     *     )
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
            'logout_all_devices' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Token de rafraîchissement requis',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if ($request->logout_all_devices) {
            $this->jwtService->revokeAllUserTokens($user->id);
            $message = 'Déconnexion réussie de tous les appareils';
        } else {
            $this->jwtService->revokeRefreshToken($request->refresh_token);
            $message = 'Déconnexion réussie';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/auth/me",
     *     summary="Get current user information",
     *     tags={"Authentication"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User information retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="user", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at,
                'last_login_ip' => $user->last_login_ip,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }
}