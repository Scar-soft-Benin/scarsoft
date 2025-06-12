<?php
// app/Http/Controllers/Controller.php - Mise à jour avec les annotations Swagger

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="API d'Authentification JWT",
 *     version="1.0.0",
 *     description="Documentation complète de l'API d'authentification JWT avec gestion OTP, vérification email et réinitialisation de mot de passe.",
 *     termsOfService="http://swagger.io/terms/",
 *     @OA\Contact(
 *         email="support@example.com",
 *         name="Support API"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Serveur de développement"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Entrez le token JWT avec le préfixe Bearer: Bearer {votre_token}"
 * )
 * 
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     required={"id", "name", "email", "created_at", "updated_at"},
 *     @OA\Property(property="id", type="integer", format="int64", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="last_login_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="last_login_ip", type="string", nullable=true, example="192.168.1.1"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="AuthResponse",
 *     type="object",
 *     required={"success", "access_token", "refresh_token", "token_type", "expires_in", "user"},
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Login successful"),
 *     @OA\Property(property="access_token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."),
 *     @OA\Property(property="refresh_token", type="string", example="def50200c5c4f2d3d6e8f9..."),
 *     @OA\Property(property="token_type", type="string", example="Bearer"),
 *     @OA\Property(property="expires_in", type="integer", example=900),
 *     @OA\Property(property="user", ref="#/components/schemas/User")
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     required={"success", "message"},
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error message"),
 *     @OA\Property(property="error_code", type="string", example="ERROR_CODE"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 * )
 * 
 * @OA\Schema(
 *     schema="SuccessResponse",
 *     type="object",
 *     required={"success", "message"},
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Operation successful")
 * )
 * 
 * @OA\Schema(
 *     schema="ValidationErrorResponse",
 *     type="object",
 *     required={"success", "message", "errors"},
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Validation failed"),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         @OA\Property(
 *             property="email",
 *             type="array",
 *             @OA\Items(type="string", example="The email field is required.")
 *         ),
 *         @OA\Property(
 *             property="password",
 *             type="array",
 *             @OA\Items(type="string", example="The password field is required.")
 *         )
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="RateLimitResponse",
 *     type="object",
 *     required={"success", "message", "error_code"},
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Too many attempts. Please try again in 60 seconds."),
 *     @OA\Property(property="error_code", type="string", example="RATE_LIMIT_EXCEEDED"),
 *     @OA\Property(property="retry_after", type="integer", example=60)
 * )
 * 
 * @OA\Schema(
 *     schema="OTPVerificationResponse",
 *     type="object",
 *     required={"success"},
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Code verified successfully"),
 *     @OA\Property(property="expires_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="attempts_left", type="integer", nullable=true, example=2)
 * )
 * 
 * @OA\Schema(
 *     schema="EmailStatusResponse",
 *     type="object",
 *     required={"success", "email_verified"},
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="email_verified", type="boolean", example=false),
 *     @OA\Property(property="verified_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="has_active_code", type="boolean", example=true),
 *     @OA\Property(property="attempts_remaining", type="integer", nullable=true, example=2),
 *     @OA\Property(property="code_expires_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="time_remaining_seconds", type="integer", nullable=true, example=300)
 * )
 * 
 * @OA\Schema(
 *     schema="PasswordResetTokenResponse",
 *     type="object",
 *     required={"success", "message", "reset_token"},
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="message", type="string", example="Code verified successfully"),
 *     @OA\Property(property="reset_token", type="string", example="abc123def456ghi789..."),
 *     @OA\Property(property="expires_at", type="string", format="date-time")
 * )
 */
abstract class Controller
{
    
}