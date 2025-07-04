<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Company extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'website',
        'contact_person',
        'status',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    // Relations
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function jobOffers(): HasMany
    {
        return $this->hasMany(JobOffer::class);
    }

    public function activeJobOffers(): HasMany
    {
        return $this->jobOffers()->where('status', 'active');
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('contact_person', 'like', "%{$search}%");
        });
    }

    // Accessors & Mutators
    public function getFormattedAddressAttribute(): ?string
    {
        return $this->address ? str_replace("\n", ', ', $this->address) : null;
    }

    public function getJobOffersCountAttribute(): int
    {
        return $this->jobOffers()->count();
    }

    public function getActiveJobOffersCountAttribute(): int
    {
        return $this->activeJobOffers()->count();
    }

    // Helper Methods
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function deactivate(): bool
    {
        return $this->update(['status' => 'inactive']);
    }

    public function activate(): bool
    {
        return $this->update(['status' => 'active']);
    }
}