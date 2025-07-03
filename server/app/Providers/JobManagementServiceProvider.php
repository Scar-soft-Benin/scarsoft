<?php
namespace App\Providers;

use App\Services\FileUploadService;
use Illuminate\Support\ServiceProvider;
use App\Services\EmailNotificationService;

class JobManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Enregistrer le service de gestion des fichiers comme singleton
        $this->app->singleton(FileUploadService::class, function ($app) {
            return new FileUploadService();
        });

        // Enregistrer le service de notifications email comme singleton
        $this->app->singleton(EmailNotificationService::class, function ($app) {
            return new EmailNotificationService();
        });
    }

    public function boot(): void
    {
        // Enregistrer les commandes Artisan
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Console\Commands\CleanupFilesCommand::class,
                \App\Console\Commands\StatsCommand::class,
            ]);
        }

        // Publier les assets si nécessaire
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../../config/jobmanagement.php' => config_path('jobmanagement.php'),
            ], 'job-management-config');
        }
    }
}