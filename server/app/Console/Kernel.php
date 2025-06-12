<?php
// app/Console/Kernel.php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\CleanupExpiredTokens::class,
        Commands\GenerateJWTSecret::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Nettoyage quotidien des tokens expirés à 2h du matin
        $schedule->command('auth:cleanup-tokens')
            ->dailyAt('02:00')
            ->withoutOverlapping()
            ->runInBackground()
            ->onSuccess(function () {
                Log::info('Nettoyage des tokens expirés terminé avec succès');
            })
            ->onFailure(function () {
                Log::error('Échec du nettoyage des tokens expirés');
            });

        // Nettoyage hebdomadaire plus approfondi le dimanche à 3h du matin
        $schedule->command('auth:cleanup-tokens')
            ->weeklyOn(0, '03:00')
            ->withoutOverlapping()
            ->runInBackground()
            ->description('Nettoyage hebdomadaire approfondi des tokens');

        // Génération des logs de santé du système d'authentification
        $schedule->call(function () {
            $activeTokens = \App\Models\RefreshToken::valid()->count();
            $totalUsers = \App\Models\User::where('is_active', true)->count();
            $verifiedUsers = \App\Models\User::whereNotNull('email_verified_at')->count();
            
            Log::info('Rapport de santé du système d\'authentification', [
                'active_refresh_tokens' => $activeTokens,
                'total_active_users' => $totalUsers,
                'verified_users' => $verifiedUsers,
                'verification_rate' => $totalUsers > 0 ? round(($verifiedUsers / $totalUsers) * 100, 2) . '%' : '0%',
            ]);
        })->dailyAt('01:00')->name('auth-health-report');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}