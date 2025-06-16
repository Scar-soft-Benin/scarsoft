<?php

return [
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'api'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\User::class),
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

    // Configuration JWT personnalisée - Cast en entiers
    'jwt_secret' => env('JWT_SECRET'),
    'jwt_algorithm' => env('JWT_ALGORITHM', 'HS256'),
    'jwt_access_token_expiration' => (int) env('JWT_ACCESS_TOKEN_EXPIRATION', 15),
    'jwt_refresh_token_expiration' => (int) env('JWT_REFRESH_TOKEN_EXPIRATION', 10080),
    'jwt_refresh_token_rotation' => (bool) env('JWT_REFRESH_TOKEN_ROTATION', true),

    // Configuration OTP - Cast en entiers
    'otp_expiration' => (int) env('OTP_EXPIRATION', 10),
    'otp_length' => (int) env('OTP_LENGTH', 6),
    'otp_max_attempts' => (int) env('OTP_MAX_ATTEMPTS', 3),
];