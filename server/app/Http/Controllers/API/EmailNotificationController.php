<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Email Notifications",
 *     description="API endpoints for sending manual email notifications"
 * )
 */
class EmailNotificationController extends Controller
{
    private EmailNotificationService $emailService;

    public function __construct(EmailNotificationService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * @OA\Post(
     *     path="/api/admin/notifications/send-to-candidate",
     *     summary="Send email to candidate (Admin only)",
     *     tags={"Email Notifications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"candidate_email","message","job_offer_id"},
     *             @OA\Property(property="candidate_email", type="string", format="email", example="candidate@example.com"),
     *             @OA\Property(property="message", type="string", example="Nous avons le plaisir de vous informer que votre candidature a été retenue..."),
     *             @OA\Property(property="job_offer_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Email envoyé au candidat avec succès")
     *         )
     *     )
     * )
     */
    public function sendToCandidate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'candidate_email' => 'required|email',
            'message' => 'required|string|max:5000',
            'job_offer_id' => 'required|exists:job_offers,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $jobOffer = JobOffer::with('company')->find($request->job_offer_id);
            
            $result = $this->emailService->sendToCandidateManual(
                $request->candidate_email,
                $request->message,
                $jobOffer,
                $request->user()
            );

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Email envoyé au candidat avec succès',
                    'sent_at' => now(),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'error_code' => 'EMAIL_SEND_FAILED',
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de l\'email',
                'error_code' => 'EMAIL_SEND_ERROR',
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/admin/notifications/send-to-company",
     *     summary="Send candidate information to company (Admin only)",
     *     tags={"Email Notifications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"company_email","message","candidate_id","job_offer_id"},
     *             @OA\Property(property="company_email", type="string", format="email", example="rh@company.com"),
     *             @OA\Property(property="message", type="string", example="Nous vous présentons la candidature de M. Jean Dupont pour le poste..."),
     *             @OA\Property(property="candidate_id", type="integer", example=1),
     *             @OA\Property(property="job_offer_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Candidature transférée à l'entreprise avec succès")
     *         )
     *     )
     * )
     */
    public function sendToCompany(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'company_email' => 'required|email',
            'message' => 'required|string|max:5000',
            'candidate_id' => 'required|exists:job_applications,id',
            'job_offer_id' => 'required|exists:job_offers,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $jobApplication = JobApplication::with('jobOffer.company')->find($request->candidate_id);
            $jobOffer = JobOffer::with('company')->find($request->job_offer_id);

            // Vérifier que la candidature correspond à l'offre
            if ($jobApplication->job_offer_id != $request->job_offer_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'La candidature ne correspond pas à l\'offre d\'emploi',
                    'error_code' => 'MISMATCH_APPLICATION_OFFER',
                ], 400);
            }

            $result = $this->emailService->sendToCompanyManual(
                $request->company_email,
                $request->message,
                $jobApplication,
                $jobOffer,
                $request->user()
            );

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Candidature transférée à l\'entreprise avec succès',
                    'sent_at' => now(),
                    'candidate_name' => $jobApplication->applicant_name,
                    'company_name' => $jobOffer->company->name,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['error'],
                    'error_code' => 'EMAIL_SEND_FAILED',
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de l\'email',
                'error_code' => 'EMAIL_SEND_ERROR',
            ], 500);
        }
    }
}