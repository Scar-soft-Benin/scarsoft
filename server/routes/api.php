<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmailVerificationController;
use App\Http\Controllers\API\PasswordResetController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\CompanyController;
use App\Http\Controllers\API\JobOfferController;
use App\Http\Controllers\API\JobApplicationController;
use App\Http\Controllers\API\EmailNotificationController;

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

// Routes d'authentification
Route::prefix('auth')->group(function () {
    // Routes publiques d'authentification
    Route::post('register', [AuthController::class, 'register'])
        ->name('auth.register');
    
    Route::post('login', [AuthController::class, 'login'])
        ->name('auth.login');
    
    // Routes pour la connexion avec OTP
    Route::post('verify-login-otp', [AuthController::class, 'verifyLoginOtp'])
        ->name('auth.verify-login-otp');
    
    Route::post('resend-login-otp', [AuthController::class, 'resendLoginOtp'])
        ->name('auth.resend-login-otp');
    
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

// Routes publiques de contact
Route::post('contacts', [ContactController::class, 'store'])
    ->name('contacts.store');

// Routes publiques des offres d'emploi
Route::prefix('job-offers')->group(function () {
    Route::get('/', [JobOfferController::class, 'index'])
        ->name('job-offers.index');
    
    Route::get('{jobOffer}', [JobOfferController::class, 'show'])
        ->name('job-offers.show');
    
    // Candidature à une offre d'emploi
    Route::post('{jobOffer}/apply', [JobApplicationController::class, 'store'])
        ->name('job-offers.apply');
});

// Routes d'administration protégées
Route::prefix('admin')->middleware('jwt.auth')->group(function () {
    
    // Gestion des entreprises
    Route::apiResource('companies', CompanyController::class);
    Route::get('companies/{company}/statistics', [CompanyController::class, 'statistics'])
        ->name('companies.statistics');
    
    // Gestion des contacts
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index'])
            ->name('admin.contacts.index');
        
        Route::get('statistics', [ContactController::class, 'statistics'])
            ->name('admin.contacts.statistics');
        
        Route::get('{contact}', [ContactController::class, 'show'])
            ->name('admin.contacts.show');
        
        Route::put('{contact}/reply', [ContactController::class, 'reply'])
            ->name('admin.contacts.reply');
        
        Route::put('{contact}/status', [ContactController::class, 'updateStatus'])
            ->name('admin.contacts.status');
        
        Route::delete('{contact}', [ContactController::class, 'destroy'])
            ->name('admin.contacts.destroy');
    });
    
    // Gestion des offres d'emploi (Administration)
    Route::prefix('job-offers')->group(function () {
        Route::get('/', [JobOfferController::class, 'adminIndex'])
            ->name('admin.job-offers.index');
        
        Route::post('/', [JobOfferController::class, 'store'])
            ->name('admin.job-offers.store');
        
        Route::get('statistics', [JobOfferController::class, 'statistics'])
            ->name('admin.job-offers.statistics');
        
        Route::get('{jobOffer}', [JobOfferController::class, 'show'])
            ->name('admin.job-offers.show');
        
        Route::put('{jobOffer}', [JobOfferController::class, 'update'])
            ->name('admin.job-offers.update');
        
        Route::delete('{jobOffer}', [JobOfferController::class, 'destroy'])
            ->name('admin.job-offers.destroy');
    });
    
    // Gestion des candidatures
    Route::prefix('job-applications')->group(function () {
        Route::get('/', [JobApplicationController::class, 'index'])
            ->name('admin.job-applications.index');
        
        Route::get('statistics', [JobApplicationController::class, 'statistics'])
            ->name('admin.job-applications.statistics');
        
        Route::get('{jobApplication}', [JobApplicationController::class, 'show'])
            ->name('admin.job-applications.show');
        
        Route::put('{jobApplication}/status', [JobApplicationController::class, 'updateStatus'])
            ->name('admin.job-applications.status');
        
        Route::delete('{jobApplication}', [JobApplicationController::class, 'destroy'])
            ->name('admin.job-applications.destroy');
        
        Route::get('{jobApplication}/download/{type}', [JobApplicationController::class, 'downloadFile'])
            ->name('admin.job-applications.download')
            ->where('type', 'cv|cover-letter');
    });
    
    // Envoi d'emails manuels
    Route::prefix('notifications')->group(function () {
        Route::post('send-to-candidate', [EmailNotificationController::class, 'sendToCandidate'])
            ->name('admin.notifications.send-candidate');
        
        Route::post('send-to-company', [EmailNotificationController::class, 'sendToCompany'])
            ->name('admin.notifications.send-company');
    });
});

// Routes protégées pour l'application (utilisateurs connectés)
Route::middleware('jwt.auth')->group(function () {
    // Profil utilisateur
    Route::get('user/profile', function () {
        return response()->json([
            'success' => true,
            'user' => auth()->user(),
        ]);
    })->name('user.profile');
    
    // Paramètres utilisateur
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
        'version' => '1.0.0',
    ]);
})->name('api.test');