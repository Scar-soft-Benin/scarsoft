<?php
// app/Models/PasswordResetToken.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class PasswordResetToken extends Model
{
    use HasUuids;

    protected $fillable = [
        'email',
        'token',
        'expires_at',
        'is_used',
        'used_at',
        'ip_address',
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
        return !$this->is_used && !$this->isExpired();
    }

    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => Carbon::now(),
        ]);
    }

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                    ->where('expires_at', '>', Carbon::now());
    }

    public function scopeForEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    public static function createForEmail(string $email): self
    {
        // Révoquer tous les tokens existants pour cet email
        static::forEmail($email)->update(['is_used' => true]);

        return static::create([
            'email' => $email,
            'token' => static::generateToken(),
            'expires_at' => Carbon::now()->addHour(),
            'ip_address' => request()->ip(),
        ]);
    }

    private static function generateToken(): string
    {
        return Str::random(64);
    }
}