<?php
// app/Models/JobApplication.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class JobApplication extends Model
{
    protected $fillable = [
        'job_offer_id',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'cv_path',
        'cover_letter_type',
        'cover_letter_content',
        'cover_letter_path',
        'status',
        'notes',
        'reviewed_by',
        'reviewed_at',
        'user_id',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'status' => 'string',
            'cover_letter_type' => 'string',
        ];
    }

    // Relations
    public function jobOffer(): BelongsTo
    {
        return $this->belongsTo(JobOffer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnderReview(Builder $query): Builder
    {
        return $query->where('status', 'under_review');
    }

    public function scopeShortlisted(Builder $query): Builder
    {
        return $query->where('status', 'shortlisted');
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    public function scopeAccepted(Builder $query): Builder
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays(30));
    }

    public function scopeByJobOffer(Builder $query, int $jobOfferId): Builder
    {
        return $query->where('job_offer_id', $jobOfferId);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('applicant_name', 'like', "%{$search}%")
              ->orWhere('applicant_email', 'like', "%{$search}%")
              ->orWhereHas('jobOffer', function ($jobQuery) use ($search) {
                  $jobQuery->where('title', 'like', "%{$search}%");
              });
        });
    }

    // Accessors
    public function getFormattedPhoneAttribute(): ?string
    {
        return $this->applicant_phone ? preg_replace('/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/', '$1 $2 $3 $4 $5', $this->applicant_phone) : null;
    }

    public function getCvUrlAttribute(): ?string
    {
        return $this->cv_path ? Storage::url($this->cv_path) : null;
    }

    public function getCoverLetterUrlAttribute(): ?string
    {
        return $this->cover_letter_path ? Storage::url($this->cover_letter_path) : null;
    }

    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'under_review' => 'En cours d\'examen',
            'shortlisted' => 'Présélectionné',
            'rejected' => 'Rejeté',
            'accepted' => 'Accepté',
            default => $this->status,
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'under_review' => 'info',
            'shortlisted' => 'primary',
            'rejected' => 'danger',
            'accepted' => 'success',
            default => 'secondary',
        };
    }

    // Status Methods
    public function markAsUnderReview(User $reviewer): bool
    {
        return $this->update([
            'status' => 'under_review',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => Carbon::now(),
        ]);
    }

    public function shortlist(User $reviewer, string $notes = null): bool
    {
        return $this->update([
            'status' => 'shortlisted',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => Carbon::now(),
            'notes' => $notes ?: $this->notes,
        ]);
    }

    public function reject(User $reviewer, string $notes = null): bool
    {
        return $this->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => Carbon::now(),
            'notes' => $notes ?: $this->notes,
        ]);
    }

    public function accept(User $reviewer, string $notes = null): bool
    {
        return $this->update([
            'status' => 'accepted',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => Carbon::now(),
            'notes' => $notes ?: $this->notes,
        ]);
    }

    // Helper Methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isUnderReview(): bool
    {
        return $this->status === 'under_review';
    }

    public function isShortlisted(): bool
    {
        return $this->status === 'shortlisted';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function hasTextCoverLetter(): bool
    {
        return $this->cover_letter_type === 'text' && !empty($this->cover_letter_content);
    }

    public function hasFileCoverLetter(): bool
    {
        return $this->cover_letter_type === 'file' && !empty($this->cover_letter_path);
    }

    public function getDisplayCoverLetter(): string
    {
        if ($this->hasTextCoverLetter()) {
            return strlen($this->cover_letter_content) > 200 
                ? substr($this->cover_letter_content, 0, 200) . '...' 
                : $this->cover_letter_content;
        }
        
        if ($this->hasFileCoverLetter()) {
            return 'Lettre de motivation en fichier joint';
        }
        
        return 'Aucune lettre de motivation';
    }
}