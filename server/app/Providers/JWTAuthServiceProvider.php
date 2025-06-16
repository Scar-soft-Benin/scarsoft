<?php
namespace App\Providers;

use App\Auth\JWTGuard;
use App\Services\JWTService;
use App\Services\OTPService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;

class JWTAuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(JWTService::class, function ($app) {
            return new JWTService();
        });

        $this->app->singleton(OTPService::class, function ($app) {
            return new OTPService();
        });
    }

    public function boot(): void
    {
        Auth::extend('jwt', function ($app, $name, array $config) {
            return new JWTGuard(
                Auth::createUserProvider($config['provider']),
                $app->make(JWTService::class),
                $app['request']
            );
        });
    }
}