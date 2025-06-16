<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PasswordResetToken;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules\Password;

/**
 * @OA\Tag(
 *     name="Password Reset",
 *     description="API endpoints for password reset functionality"
 * )
 */
class PasswordResetController extends Controller
{
    private OTPService $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * @OA\Post(
     *     path="/api/auth/password/forgot",
     *     summary="Request password reset",
     *     tags={"Password Reset"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset code sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Password reset code sent to your email")
     *         )
     *     ),
     *     @OA\Response(
     *         response=429,
     *         description="Too many requests",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Too many reset attempts"),
     *             @OA\Property(property="error_code", type="string", example="RATE_LIMIT_EXCEEDED")
     *         )
     *     )
     * )
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $key = 'password_reset:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de demandes de réinitialisation. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->otpService->generatePasswordResetCode($request->email);

        // Ajouter une limitation même en cas de succès pour éviter les abus
        RateLimiter::hit($key);

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'expires_at' => $result['expires_at'] ?? null,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/password/verify-code",
     *     summary="Verify password reset code",
     *     tags={"Password Reset"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","code"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="code", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Code verified successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Code verified successfully"),
     *             @OA\Property(property="reset_token", type="string", example="abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid or expired code",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid verification code"),
     *             @OA\Property(property="error_code", type="string", example="INVALID_CODE")
     *         )
     *     )
     * )
     */
    public function verifyResetCode(Request $request): JsonResponse
    {
        $key = 'password_verify:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
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

        $verification = $this->otpService->verifyCode(
            $request->email,
            $request->code,
            'password_reset'
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

        // Créer un token de réinitialisation
        $resetToken = PasswordResetToken::createForEmail($request->email);

        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
            'message' => 'Code vérifié avec succès',
            'reset_token' => $resetToken->token,
            'expires_at' => $resetToken->expires_at,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/password/reset",
     *     summary="Reset password with token",
     *     tags={"Password Reset"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","token","password","password_confirmation"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="token", type="string", example="abc123..."),
     *             @OA\Property(property="password", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="newpassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Password reset successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid or expired token",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid or expired reset token"),
     *             @OA\Property(property="error_code", type="string", example="INVALID_TOKEN")
     *         )
     *     )
     * )
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $key = 'password_change:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de changement. Réessayez dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
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

        $resetToken = PasswordResetToken::forEmail($request->email)
            ->where('token', $request->token)
            ->valid()
            ->first();

        if (!$resetToken) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Token de réinitialisation invalide ou expiré',
                'error_code' => 'INVALID_TOKEN',
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Marquer le token comme utilisé
        $resetToken->markAsUsed();

        // Révoquer tous les refresh tokens de l'utilisateur pour des raisons de sécurité
        $user->refreshTokens()->update([
            'is_revoked' => true,
            'revoked_at' => now(),
        ]);

        // Réinitialiser les tentatives de connexion échouées
        $user->resetFailedAttempts();

        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès',
            'password_changed_at' => now(),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/password/resend-code",
     *     summary="Resend password reset code",
     *     tags={"Password Reset"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reset code sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Reset code sent"),
     *             @OA\Property(property="expires_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function resendResetCode(Request $request): JsonResponse
    {
        $key = 'password_resend:' . $request->ip();
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
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->otpService->resendCode($request->email, 'password_reset');

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
}