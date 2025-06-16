<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmailVerificationController;
use App\Http\Controllers\API\PasswordResetController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
    // Routes publiques d'authentification
    Route::post('register', [AuthController::class, 'register'])
        ->name('auth.register');
    
    Route::post('login', [AuthController::class, 'login'])
        ->name('auth.login');
    
    Route::post('refresh', [AuthController::class, 'refresh'])
        ->name('auth.refresh');

    // Routes de vérification d'email
    Route::prefix('email')->group(function () {
        Route::post('verify', [EmailVerificationController::class, 'verify'])
            ->name('auth.email.verify');
        
        Route::post('resend', [EmailVerificationController::class, 'resend'])
            ->name('auth.email.resend');
        
        Route::get('status', [EmailVerificationController::class, 'status'])
            ->name('auth.email.status');
    });

    // Routes de réinitialisation de mot de passe
    Route::prefix('password')->group(function () {
        Route::post('forgot', [PasswordResetController::class, 'forgotPassword'])
            ->name('auth.password.forgot');
        
        Route::post('verify-code', [PasswordResetController::class, 'verifyResetCode'])
            ->name('auth.password.verify-code');
        
        Route::post('reset', [PasswordResetController::class, 'resetPassword'])
            ->name('auth.password.reset');
        
        Route::post('resend-code', [PasswordResetController::class, 'resendResetCode'])
            ->name('auth.password.resend-code');
    });

    // Routes protégées nécessitant une authentification
    Route::middleware('jwt.auth')->group(function () {
        Route::get('me', [AuthController::class, 'me'])
            ->name('auth.me');
        
        Route::post('logout', [AuthController::class, 'logout'])
            ->name('auth.logout');
    });
});

// Routes protégées pour l'application
Route::middleware('jwt.auth')->group(function () {
    // Exemple de route protégée
    Route::get('user/profile', function () {
        return response()->json([
            'success' => true,
            'user' => auth()->user(),
        ]);
    })->name('user.profile');
    
    // Exemple de route nécessitant une vérification email
    Route::get('user/settings', function () {
        return response()->json([
            'success' => true,
            'message' => 'Accès aux paramètres utilisateur',
            'user' => auth()->user(),
        ]);
    })->name('user.settings');
});

// Route de test simple
Route::get('test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API fonctionne correctement',
        'timestamp' => now(),
    ]);
});