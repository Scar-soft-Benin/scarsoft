<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class JobOffer extends Model
{
    protected $fillable = [
        'title',
        'type',
        'contract',
        'location',
        'salary',
        'mission',
        'skills',
        'requirements',
        'status',
        'company_id',
        'company_contact_email',
        'is_internal',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'requirements' => 'array',
            'is_internal' => 'boolean',
            'status' => 'string',
            'type' => 'string',
        ];
    }

    // Relations
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function pendingApplications(): HasMany
    {
        return $this->applications()->where('status', 'pending');
    }

    public function acceptedApplications(): HasMany
    {
        return $this->applications()->where('status', 'accepted');
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('status', 'archived');
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    public function scopeInternal(Builder $query): Builder
    {
        return $query->where('is_internal', true);
    }

    public function scopeExternal(Builder $query): Builder
    {
        return $query->where('is_internal', false);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeByLocation(Builder $query, string $location): Builder
    {
        return $query->where('location', 'like', "%{$location}%");
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('mission', 'like', "%{$search}%");
        });
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getFormattedSalaryAttribute(): ?string
    {
        return $this->salary ?: 'Salaire à négocier';
    }

    public function getShortMissionAttribute(): string
    {
        return strlen($this->mission) > 150 ? substr($this->mission, 0, 150) . '...' : $this->mission;
    }

    public function getApplicationsCountAttribute(): int
    {
        return $this->applications()->count();
    }

    public function getPendingApplicationsCountAttribute(): int
    {
        return $this->pendingApplications()->count();
    }

    public function getCompanyDisplayNameAttribute(): string
    {
        return $this->is_internal ? 'ScarSoft' : $this->company->name;
    }

    public function getContactEmailAttribute(): string
    {
        return $this->company_contact_email ?: $this->company->email;
    }

    // Status Methods
    public function activate(): bool
    {
        return $this->update(['status' => 'active']);
    }

    public function archive(): bool
    {
        return $this->update(['status' => 'archived']);
    }

    public function makeDraft(): bool
    {
        return $this->update(['status' => 'draft']);
    }

    // Helper Methods
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isInternal(): bool
    {
        return $this->is_internal;
    }

    public function hasApplications(): bool
    {
        return $this->applications()->exists();
    }

    public function canBeDeleted(): bool
    {
        return !$this->hasApplications();
    }
}