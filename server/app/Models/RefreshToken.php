<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Carbon;

class RefreshToken extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'token',
        'device_name',
        'device_type',
        'ip_address',
        'user_agent',
        'expires_at',
        'is_revoked',
        'revoked_at',
        'last_used_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'revoked_at' => 'datetime',
            'last_used_at' => 'datetime',
            'is_revoked' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->is_revoked && !$this->isExpired();
    }

    public function revoke(): void
    {
        $this->update([
            'is_revoked' => true,
            'revoked_at' => Carbon::now(),
        ]);
    }

    public function updateLastUsed(): void
    {
        $this->update(['last_used_at' => Carbon::now()]);
    }

    public function scopeValid($query)
    {
        return $query->where('is_revoked', false)
                    ->where('expires_at', '>', Carbon::now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', Carbon::now());
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}