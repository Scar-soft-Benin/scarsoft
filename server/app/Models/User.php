<?php
namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'failed_login_attempts',
        'locked_until',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'locked_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function refreshTokens(): HasMany
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function incrementFailedAttempts(): void
    {
        $this->increment('failed_login_attempts');
        
        if ($this->failed_login_attempts >= 5) {
            $this->update(['locked_until' => Carbon::now()->addMinutes(30)]);
        }
    }

    public function resetFailedAttempts(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);
    }

    public function updateLastLogin(string $ipAddress): void
    {
        $this->update([
            'last_login_at' => Carbon::now(),
            'last_login_ip' => $ipAddress,
        ]);
    }

    public function getJWTIdentifier(): string
    {
        return (string) $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
            'email_verified' => !is_null($this->email_verified_at),
        ];
    }

    public function createdCompanies(): HasMany
    {
        return $this->hasMany(Company::class, 'created_by');
    }

    public function createdJobOffers(): HasMany
    {
        return $this->hasMany(JobOffer::class, 'created_by');
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function reviewedApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'reviewed_by');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function repliedContacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'replied_by');
    }
}