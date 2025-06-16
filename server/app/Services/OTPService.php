<?php
namespace App\Services;


use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class OTPService
{
    private int $maxAttempts;
    private int $expirationMinutes;
    private int $codeLength;

    public function __construct()
    {
        $this->maxAttempts = (int) config('auth.otp_max_attempts', 3);
        $this->expirationMinutes = (int) config('auth.otp_expiration', 10);
        $this->codeLength = (int) config('auth.otp_length', 6);
    }

    public function generateEmailVerificationCode(string $email): array
    {
        // Invalider tous les codes précédents pour cet email et ce type
        $this->invalidatePreviousCodes($email, 'email_verification');

        $OtpCode = OtpCode::createForEmailVerification($email);

        $sent = $this->sendEmailVerificationCode($email, $OtpCode->code);

        return [
            'success' => $sent,
            'code_id' => $OtpCode->id,
            'expires_at' => $OtpCode->expires_at,
            'message' => $sent 
                ? 'Code de vérification envoyé à votre adresse email'
                : 'Erreur lors de l\'envoi du code de vérification',
        ];
    }

    public function generatePasswordResetCode(string $email): array
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            // Pour des raisons de sécurité, nous retournons un succès même si l'email n'existe pas
            return [
                'success' => true,
                'message' => 'Si cette adresse email existe, vous recevrez un code de réinitialisation',
            ];
        }

        // Invalider tous les codes précédents pour cet email et ce type
        $this->invalidatePreviousCodes($email, 'password_reset');

        $OtpCode = OtpCode::createForPasswordReset($email);

        $sent = $this->sendPasswordResetCode($email, $OtpCode->code, $user->name);

        return [
            'success' => $sent,
            'code_id' => $OtpCode->id,
            'expires_at' => $OtpCode->expires_at,
            'message' => $sent 
                ? 'Code de réinitialisation envoyé à votre adresse email'
                : 'Erreur lors de l\'envoi du code de réinitialisation',
        ];
    }

    public function verifyCode(string $identifier, string $code, string $type): array
    {
        $OtpCode = OtpCode::forIdentifier($identifier)
            ->ofType($type)
            ->valid()
            ->latest()
            ->first();

        if (!$OtpCode) {
            return [
                'valid' => false,
                'error' => 'Code de vérification invalide ou expiré',
                'error_code' => 'INVALID_CODE',
            ];
        }

        // Incrémenter le nombre de tentatives
        $OtpCode->incrementAttempts();

        if ($OtpCode->code !== $code) {
            $attemptsLeft = $this->maxAttempts - $OtpCode->attempts;
            
            return [
                'valid' => false,
                'error' => 'Code de vérification incorrect',
                'error_code' => 'WRONG_CODE',
                'attempts_left' => max(0, $attemptsLeft),
            ];
        }

        // Marquer le code comme utilisé
        $OtpCode->markAsUsed();

        return [
            'valid' => true,
            'message' => 'Code de vérification validé avec succès',
            'code_id' => $OtpCode->id,
        ];
    }

    public function resendCode(string $identifier, string $type): array
    {
        // Vérifier s'il y a un code récent (moins de 1 minute)
        $recentCode = OtpCode::forIdentifier($identifier)
            ->ofType($type)
            ->where('created_at', '>', Carbon::now()->subMinute())
            ->first();

        if ($recentCode) {
            return [
                'success' => false,
                'error' => 'Veuillez attendre avant de demander un nouveau code',
                'error_code' => 'TOO_FREQUENT',
                'retry_after' => 60 - Carbon::now()->diffInSeconds($recentCode->created_at),
            ];
        }

        // Générer un nouveau code selon le type
        switch ($type) {
            case 'email_verification':
                return $this->generateEmailVerificationCode($identifier);
            case 'password_reset':
                return $this->generatePasswordResetCode($identifier);
            default:
                return [
                    'success' => false,
                    'error' => 'Type de code non supporté',
                    'error_code' => 'UNSUPPORTED_TYPE',
                ];
        }
    }

    private function invalidatePreviousCodes(string $identifier, string $type): void
    {
        OtpCode::forIdentifier($identifier)
            ->ofType($type)
            ->valid()
            ->update(['is_used' => true]);
    }

    private function sendEmailVerificationCode(string $email, string $code): bool
    {
        try {
            Mail::send('emails.email-verification', [
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes($this->expirationMinutes),
            ], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Code de vérification de votre compte');
            });

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur envoi email de vérification: ' . $e->getMessage(), [
                'email' => $email,
                'code' => $code,
            ]);
            return false;
        }
    }

    private function sendPasswordResetCode(string $email, string $code, string $userName): bool
    {
        try {
            Mail::send('emails.password-reset', [
                'code' => $code,
                'user_name' => $userName,
                'expires_at' => Carbon::now()->addMinutes($this->expirationMinutes),
            ], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Code de réinitialisation de mot de passe');
            });

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur envoi email de réinitialisation: ' . $e->getMessage(), [
                'email' => $email,
                'code' => $code,
            ]);
            return false;
        }
    }

    public function cleanupExpiredCodes(): int
    {
        return OtpCode::where('expires_at', '<', Carbon::now())->delete();
    }

    public function getCodeStats(string $identifier, string $type): array
    {
        $activeCode = OtpCode::forIdentifier($identifier)
            ->ofType($type)
            ->valid()
            ->latest()
            ->first();

        if (!$activeCode) {
            return [
                'has_active_code' => false,
            ];
        }

        return [
            'has_active_code' => true,
            'attempts_used' => $activeCode->attempts,
            'attempts_remaining' => max(0, $this->maxAttempts - $activeCode->attempts),
            'expires_at' => $activeCode->expires_at,
            'time_remaining' => $activeCode->expires_at->diffInSeconds(Carbon::now()),
        ];
    }
}