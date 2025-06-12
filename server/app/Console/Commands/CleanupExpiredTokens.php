<?php

namespace App\Console\Commands;

use App\Models\RefreshToken;
use App\Models\OtpCode;
use App\Models\PasswordResetToken;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CleanupExpiredTokens extends Command
{
    protected $signature = 'auth:cleanup-tokens {--dry-run : Afficher ce qui serait supprimé sans effectuer la suppression}';
    
    protected $description = 'Nettoie les tokens expirés et les codes OTP de la base de données';

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        
        $this->info('Début du nettoyage des tokens expirés...');
        $this->newLine();

        // Nettoyage des refresh tokens expirés
        $expiredRefreshTokens = RefreshToken::expired()->count();
        if ($expiredRefreshTokens > 0) {
            $this->info("Refresh tokens expirés trouvés: {$expiredRefreshTokens}");
            
            if (!$isDryRun) {
                $deletedRefreshTokens = RefreshToken::expired()->delete();
                $this->info("✓ {$deletedRefreshTokens} refresh tokens supprimés");
            } else {
                $this->warn("Mode dry-run: {$expiredRefreshTokens} refresh tokens seraient supprimés");
            }
        } else {
            $this->info("✓ Aucun refresh token expiré trouvé");
        }

        // Nettoyage des codes OTP expirés
        $expiredOtpCodes = OtpCode::where('expires_at', '<', Carbon::now())->count();
        if ($expiredOtpCodes > 0) {
            $this->info("Codes OTP expirés trouvés: {$expiredOtpCodes}");
            
            if (!$isDryRun) {
                $deletedOtpCodes = OtpCode::where('expires_at', '<', Carbon::now())->delete();
                $this->info("✓ {$deletedOtpCodes} codes OTP supprimés");
            } else {
                $this->warn("Mode dry-run: {$expiredOtpCodes} codes OTP seraient supprimés");
            }
        } else {
            $this->info("✓ Aucun code OTP expiré trouvé");
        }

        // Nettoyage des tokens de réinitialisation expirés
        $expiredPasswordTokens = PasswordResetToken::where('expires_at', '<', Carbon::now())->count();
        if ($expiredPasswordTokens > 0) {
            $this->info("Tokens de réinitialisation expirés trouvés: {$expiredPasswordTokens}");
            
            if (!$isDryRun) {
                $deletedPasswordTokens = PasswordResetToken::where('expires_at', '<', Carbon::now())->delete();
                $this->info("✓ {$deletedPasswordTokens} tokens de réinitialisation supprimés");
            } else {
                $this->warn("Mode dry-run: {$expiredPasswordTokens} tokens de réinitialisation seraient supprimés");
            }
        } else {
            $this->info("✓ Aucun token de réinitialisation expiré trouvé");
        }

        // Nettoyage des refresh tokens révoqués depuis plus de 30 jours
        $oldRevokedTokens = RefreshToken::where('is_revoked', true)
            ->where('revoked_at', '<', Carbon::now()->subDays(30))
            ->count();
            
        if ($oldRevokedTokens > 0) {
            $this->info("Anciens tokens révoqués trouvés: {$oldRevokedTokens}");
            
            if (!$isDryRun) {
                $deletedOldTokens = RefreshToken::where('is_revoked', true)
                    ->where('revoked_at', '<', Carbon::now()->subDays(30))
                    ->delete();
                $this->info("✓ {$deletedOldTokens} anciens tokens révoqués supprimés");
            } else {
                $this->warn("Mode dry-run: {$oldRevokedTokens} anciens tokens révoqués seraient supprimés");
            }
        } else {
            $this->info("✓ Aucun ancien token révoqué trouvé");
        }

        // Nettoyage des codes OTP utilisés depuis plus de 7 jours
        $oldUsedOtpCodes = OtpCode::where('is_used', true)
            ->where('used_at', '<', Carbon::now()->subDays(7))
            ->count();
            
        if ($oldUsedOtpCodes > 0) {
            $this->info("Anciens codes OTP utilisés trouvés: {$oldUsedOtpCodes}");
            
            if (!$isDryRun) {
                $deletedOldOtpCodes = OtpCode::where('is_used', true)
                    ->where('used_at', '<', Carbon::now()->subDays(7))
                    ->delete();
                $this->info("✓ {$deletedOldOtpCodes} anciens codes OTP utilisés supprimés");
            } else {
                $this->warn("Mode dry-run: {$oldUsedOtpCodes} anciens codes OTP utilisés seraient supprimés");
            }
        } else {
            $this->info("✓ Aucun ancien code OTP utilisé trouvé");
        }

        $this->newLine();
        
        if ($isDryRun) {
            $this->warn('Mode dry-run activé - Aucune suppression effectuée');
            $this->info('Exécutez la commande sans --dry-run pour effectuer le nettoyage');
        } else {
            $this->info('Nettoyage terminé avec succès!');
        }

        return Command::SUCCESS;
    }
}