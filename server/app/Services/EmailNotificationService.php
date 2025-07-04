<?php
namespace App\Services;

use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class EmailNotificationService
{
    /**
     * Envoyer un email manuel au candidat
     */
    public function sendToCandidateManual(string $candidateEmail, string $message, JobOffer $jobOffer, User $admin): array
    {
        try {
            $emailData = [
                'candidate_email' => $candidateEmail,
                'message' => $message,
                'job_title' => $jobOffer->title,
                'company_name' => $jobOffer->company->name,
                'admin_name' => $admin->name,
                'sent_at' => now(),
            ];

            Mail::send('emails.candidate-notification', $emailData, function ($mail) use ($candidateEmail, $jobOffer) {
                $mail->to($candidateEmail)
                    ->subject("Mise à jour de votre candidature - {$jobOffer->title}");
            });

            Log::info("Email envoyé au candidat", [
                'candidate_email' => $candidateEmail,
                'job_offer_id' => $jobOffer->id,
                'admin_id' => $admin->id,
            ]);

            return [
                'success' => true,
                'message' => 'Email envoyé avec succès au candidat',
            ];

        } catch (\Exception $e) {
            Log::error("Erreur envoi email candidat", [
                'error' => $e->getMessage(),
                'candidate_email' => $candidateEmail,
                'job_offer_id' => $jobOffer->id,
            ]);

            return [
                'success' => false,
                'error' => 'Erreur lors de l\'envoi de l\'email au candidat',
            ];
        }
    }

    /**
     * Envoyer la candidature à l'entreprise avec documents
     */
    public function sendToCompanyManual(string $companyEmail, string $message, JobApplication $jobApplication, JobOffer $jobOffer, User $admin): array
    {
        try {
            $emailData = [
                'company_email' => $companyEmail,
                'message' => $message,
                'candidate' => [
                    'name' => $jobApplication->applicant_name,
                    'email' => $jobApplication->applicant_email,
                    'phone' => $jobApplication->applicant_phone,
                    'cover_letter_content' => $jobApplication->cover_letter_content,
                    'cover_letter_display' => $jobApplication->getDisplayCoverLetter(),
                ],
                'job_title' => $jobOffer->title,
                'company_name' => $jobOffer->company->name,
                'admin_name' => $admin->name,
                'sent_at' => now(),
            ];

            // Préparer les pièces jointes
            $attachments = [];
            
            // CV
            if ($jobApplication->cv_path && Storage::disk('public')->exists($jobApplication->cv_path)) {
                $attachments['cv'] = [
                    'path' => Storage::disk('public')->path($jobApplication->cv_path),
                    'name' => "CV_{$jobApplication->applicant_name}.pdf",
                ];
            }

            // Lettre de motivation (fichier)
            if ($jobApplication->cover_letter_path && Storage::disk('public')->exists($jobApplication->cover_letter_path)) {
                $attachments['cover_letter'] = [
                    'path' => Storage::disk('public')->path($jobApplication->cover_letter_path),
                    'name' => "Lettre_motivation_{$jobApplication->applicant_name}.pdf",
                ];
            }

            Mail::send('emails.company-notification', $emailData, function ($mail) use ($companyEmail, $jobOffer, $attachments) {
                $mail->to($companyEmail)
                    ->subject("Nouvelle candidature - {$jobOffer->title}");

                // Attacher les fichiers
                foreach ($attachments as $attachment) {
                    if (file_exists($attachment['path'])) {
                        $mail->attach($attachment['path'], [
                            'as' => $attachment['name'],
                        ]);
                    }
                }
            });

            Log::info("Candidature transférée à l'entreprise", [
                'company_email' => $companyEmail,
                'candidate_id' => $jobApplication->id,
                'job_offer_id' => $jobOffer->id,
                'admin_id' => $admin->id,
                'attachments' => array_keys($attachments),
            ]);

            return [
                'success' => true,
                'message' => 'Candidature transférée avec succès à l\'entreprise',
                'attachments_sent' => count($attachments),
            ];

        } catch (\Exception $e) {
            Log::error("Erreur transfert candidature", [
                'error' => $e->getMessage(),
                'company_email' => $companyEmail,
                'candidate_id' => $jobApplication->id,
                'job_offer_id' => $jobOffer->id,
            ]);

            return [
                'success' => false,
                'error' => 'Erreur lors du transfert de la candidature',
            ];
        }
    }

    /**
     * Vérifier si un email est valide
     */
    public function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Obtenir les statistiques d'envoi d'emails
     */
    public function getEmailStats(): array
    {
        // Cette méthode peut être étendue pour tracker les envois
        // Pour l'instant, retourne des statistiques basiques
        return [
            'total_sent_today' => 0, // À implémenter si besoin de tracking
            'success_rate' => 100,
            'last_sent' => now(),
        ];
    }
}