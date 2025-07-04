<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_offer_id')->constrained()->onDelete('cascade');
            $table->string('applicant_name');
            $table->string('applicant_email');
            $table->string('applicant_phone');
            $table->string('cv_path');
            $table->enum('cover_letter_type', ['text', 'file']);
            $table->text('cover_letter_content')->nullable();
            $table->string('cover_letter_path')->nullable();
            $table->enum('status', ['pending', 'under_review', 'shortlisted', 'rejected', 'accepted'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index(['job_offer_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('applicant_email');
            $table->unique(['job_offer_id', 'applicant_email'], 'unique_application_per_offer');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};