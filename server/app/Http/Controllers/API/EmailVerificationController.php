<?php
// app/Http/Controllers/API/EmailVerificationController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Carbon;

/**
 * @OA\Tag(
 *     name="Email Verification",
 *     description="API endpoints for email verification"
 * )
 */
class EmailVerificationController extends Controller
{
    private OTPService $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * @OA\Post(
     *     path="/api/auth/email/verify",
     *     summary="Verify email with OTP code",
     *     tags={"Email Verification"},
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
     *         description="Email verified successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Email verified successfully")
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
    public function verify(Request $request): JsonResponse
    {
        $key = 'email_verify:' . $request->ip();
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

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email déjà vérifié',
                'already_verified' => true,
            ]);
        }

        $verification = $this->otpService->verifyCode(
            $request->email,
            $request->code,
            'email_verification'
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

        // Marquer l'email comme vérifié
        $user->markEmailAsVerified();

        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
            'message' => 'Email vérifié avec succès',
            'verified_at' => $user->fresh()->email_verified_at,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/email/resend",
     *     summary="Resend email verification code",
     *     tags={"Email Verification"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Verification code sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Verification code sent"),
     *             @OA\Property(property="expires_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=429,
     *         description="Too many requests",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Please wait before requesting another code"),
     *             @OA\Property(property="error_code", type="string", example="TOO_FREQUENT")
     *         )
     *     )
     * )
     */
    public function resend(Request $request): JsonResponse
    {
        $key = 'email_resend:' . $request->ip();
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

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error_code' => 'USER_NOT_FOUND',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email déjà vérifié',
                'error_code' => 'ALREADY_VERIFIED',
            ], 400);
        }

        $result = $this->otpService->resendCode($request->email, 'email_verification');

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
     * @OA\Get(
     *     path="/api/auth/email/status",
     *     summary="Get email verification status",
     *     tags={"Email Verification"},
     *     @OA\Parameter(
     *         name="email",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string", format="email")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Verification status retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="email_verified", type="boolean", example=false),
     *             @OA\Property(property="has_active_code", type="boolean", example=true),
     *             @OA\Property(property="attempts_remaining", type="integer", example=2),
     *             @OA\Property(property="code_expires_at", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function status(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error_code' => 'USER_NOT_FOUND',
            ], 404);
        }

        $codeStats = $this->otpService->getCodeStats($request->email, 'email_verification');

        return response()->json([
            'success' => true,
            'email_verified' => $user->hasVerifiedEmail(),
            'verified_at' => $user->email_verified_at,
            'has_active_code' => $codeStats['has_active_code'],
            'attempts_remaining' => $codeStats['attempts_remaining'] ?? null,
            'code_expires_at' => $codeStats['expires_at'] ?? null,
            'time_remaining_seconds' => $codeStats['time_remaining'] ?? null,
        ]);
    }
}