<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'ip_address',
        'user_id',
        'replied_at',
        'replied_by',
        'reply_message',
    ];

    protected function casts(): array
    {
        return [
            'replied_at' => 'datetime',
            'status' => 'string',
        ];
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function repliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    // Scopes
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('status', 'unread');
    }

    public function scopeRead(Builder $query): Builder
    {
        return $query->where('status', 'read');
    }

    public function scopeReplied(Builder $query): Builder
    {
        return $query->where('status', 'replied');
    }

    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('status', 'archived');
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays(30));
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('subject', 'like', "%{$search}%")
              ->orWhere('message', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getFormattedPhoneAttribute(): ?string
    {
        return $this->phone ? preg_replace('/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/', '$1 $2 $3 $4 $5', $this->phone) : null;
    }

    public function getShortMessageAttribute(): string
    {
        return strlen($this->message) > 100 ? substr($this->message, 0, 100) . '...' : $this->message;
    }

    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    // Status Methods
    public function markAsRead(): bool
    {
        return $this->update(['status' => 'read']);
    }

    public function markAsReplied(User $admin, string $replyMessage = null): bool
    {
        return $this->update([
            'status' => 'replied',
            'replied_by' => $admin->id,
            'replied_at' => Carbon::now(),
            'reply_message' => $replyMessage,
        ]);
    }

    public function archive(): bool
    {
        return $this->update(['status' => 'archived']);
    }

    public function unarchive(): bool
    {
        return $this->update(['status' => 'read']);
    }

    // Helper Methods
    public function isUnread(): bool
    {
        return $this->status === 'unread';
    }

    public function isReplied(): bool
    {
        return $this->status === 'replied';
    }

    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }

    public function hasReply(): bool
    {
        return !empty($this->reply_message);
    }
}