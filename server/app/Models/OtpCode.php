<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Carbon;

class OtpCode extends Model
{
    use HasUuids;

    protected $fillable = [
        'identifier',
        'code',
        'type',
        'delivery_method',
        'expires_at',
        'is_used',
        'used_at',
        'ip_address',
        'attempts',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
            'is_used' => 'boolean',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->is_used && !$this->isExpired() && $this->attempts < 3;
    }

    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => Carbon::now(),
        ]);
    }

    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                    ->where('expires_at', '>', Carbon::now())
                    ->where('attempts', '<', 3);
    }

    public function scopeForIdentifier($query, string $identifier)
    {
        return $query->where('identifier', $identifier);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public static function createForEmailVerification(string $email): self
    {
        return static::create([
            'identifier' => $email,
            'code' => static::generateCode(),
            'type' => 'email_verification',
            'delivery_method' => 'email',
            'expires_at' => Carbon::now()->addMinutes((int) config('auth.otp_expiration', 10)),
            'ip_address' => request()->ip(),
        ]);
    }

    public static function createForPasswordReset(string $email): self
    {
        return static::create([
            'identifier' => $email,
            'code' => static::generateCode(),
            'type' => 'password_reset',
            'delivery_method' => 'email',
            'expires_at' => Carbon::now()->addMinutes((int) config('auth.otp_expiration', 10)),
            'ip_address' => request()->ip(),
        ]);
    }

    public static function createForLoginVerification(string $email): self
    {
        return static::create([
            'identifier' => $email,
            'code' => static::generateCode(),
            'type' => 'login_verification',
            'delivery_method' => 'email',
            'expires_at' => Carbon::now()->addMinutes((int) config('auth.otp_expiration', 10)),
            'ip_address' => request()->ip(),
        ]);
    }

    private static function generateCode(): string
    {
        $length = (int) config('auth.otp_length', 6);
        return str_pad((string) random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    }
}