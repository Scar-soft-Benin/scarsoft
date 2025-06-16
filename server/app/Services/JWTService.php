<?php
namespace App\Services;

use App\Models\User;
use App\Models\RefreshToken;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class JWTService
{
    private string $secret;
    private string $algorithm;
    private int $accessTokenExpiration;
    private int $refreshTokenExpiration;

    public function __construct()
    {
        $this->secret = config('app.jwt_secret') ?? env('JWT_SECRET');
        $this->algorithm = config('app.jwt_algorithm', 'HS256');
        $this->accessTokenExpiration = (int) config('app.jwt_access_token_expiration', 15);
        $this->refreshTokenExpiration = (int) config('app.jwt_refresh_token_expiration', 10080);

        if (empty($this->secret)) {
            throw new \InvalidArgumentException('JWT secret key is not configured');
        }
    }

    public function generateAccessToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->getJWTIdentifier(),
            'iat' => Carbon::now()->timestamp,
            'exp' => Carbon::now()->addMinutes($this->accessTokenExpiration)->timestamp,
            'jti' => Str::uuid()->toString(),
            'type' => 'access',
            'user' => $user->getJWTCustomClaims(),
        ];

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    public function generateRefreshToken(User $user, array $deviceInfo = []): RefreshToken
    {
        $token = Str::random(128);
        
        return RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'device_name' => $deviceInfo['device_name'] ?? null,
            'device_type' => $deviceInfo['device_type'] ?? null,
            'ip_address' => $deviceInfo['ip_address'] ?? request()->ip(),
            'user_agent' => $deviceInfo['user_agent'] ?? request()->userAgent(),
            'expires_at' => Carbon::now()->addMinutes($this->refreshTokenExpiration),
        ]);
    }

    public function validateAccessToken(string $token): array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            
            if ($decoded->type !== 'access') {
                throw new \InvalidArgumentException('Invalid token type');
            }

            return [
                'valid' => true,
                'payload' => (array) $decoded,
                'user_id' => $decoded->sub,
            ];
        } catch (ExpiredException $e) {
            return [
                'valid' => false,
                'error' => 'Token expired',
                'expired' => true,
            ];
        } catch (SignatureInvalidException $e) {
            return [
                'valid' => false,
                'error' => 'Invalid token signature',
                'expired' => false,
            ];
        } catch (\Exception $e) {
            return [
                'valid' => false,
                'error' => 'Invalid token: ' . $e->getMessage(),
                'expired' => false,
            ];
        }
    }

    public function refreshAccessToken(string $refreshToken): array
    {
        $hashedToken = hash('sha256', $refreshToken);
        
        $tokenModel = RefreshToken::valid()
            ->where('token', $hashedToken)
            ->with('user')
            ->first();

        if (!$tokenModel || !$tokenModel->user) {
            return [
                'success' => false,
                'error' => 'Invalid refresh token',
            ];
        }

        // Mettre à jour la dernière utilisation
        $tokenModel->updateLastUsed();

        // Générer un nouveau token d'accès
        $accessToken = $this->generateAccessToken($tokenModel->user);

        // Optionnel: rotation du refresh token pour plus de sécurité
        $newRefreshToken = null;
        if (config('app.jwt_refresh_token_rotation', true)) {
            $newRefreshToken = $this->generateRefreshToken(
                $tokenModel->user,
                [
                    'device_name' => $tokenModel->device_name,
                    'device_type' => $tokenModel->device_type,
                    'ip_address' => $tokenModel->ip_address,
                    'user_agent' => $tokenModel->user_agent,
                ]
            );
            
            // Révoquer l'ancien refresh token
            $tokenModel->revoke();
        }

        return [
            'success' => true,
            'access_token' => $accessToken,
            'refresh_token' => $newRefreshToken?->token ?? null,
            'expires_in' => $this->accessTokenExpiration * 60,
            'user' => $tokenModel->user,
        ];
    }

    public function revokeRefreshToken(string $refreshToken): bool
    {
        $hashedToken = hash('sha256', $refreshToken);
        
        $tokenModel = RefreshToken::valid()
            ->where('token', $hashedToken)
            ->first();

        if ($tokenModel) {
            $tokenModel->revoke();
            return true;
        }

        return false;
    }

    public function revokeAllUserTokens(int $userId): int
    {
        return RefreshToken::forUser($userId)
            ->valid()
            ->update([
                'is_revoked' => true,
                'revoked_at' => Carbon::now(),
            ]);
    }

    public function cleanupExpiredTokens(): int
    {
        return RefreshToken::expired()->delete();
    }

    public function getTokenInfo(string $token): ?array
    {
        $validation = $this->validateAccessToken($token);
        
        if (!$validation['valid']) {
            return null;
        }

        $payload = $validation['payload'];
        
        return [
            'user_id' => $payload['sub'],
            'issued_at' => Carbon::createFromTimestamp($payload['iat']),
            'expires_at' => Carbon::createFromTimestamp($payload['exp']),
            'token_id' => $payload['jti'],
            'user_data' => $payload['user'] ?? [],
        ];
    }
}