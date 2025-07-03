<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['Recrutement', 'Stage', 'Freelance']);
            $table->string('contract')->nullable();
            $table->string('location');
            $table->string('salary')->nullable();
            $table->text('mission');
            $table->json('skills');
            $table->json('requirements');
            $table->enum('status', ['active', 'archived', 'draft'])->default('active');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('company_contact_email')->nullable();
            $table->boolean('is_internal')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['company_id', 'status']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};