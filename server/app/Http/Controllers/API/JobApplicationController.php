<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobOffer;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Job Applications",
 *     description="API endpoints for job application management"
 * )
 */
class JobApplicationController extends Controller
{
    private FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * @OA\Post(
     *     path="/api/job-offers/{jobOfferId}/apply",
     *     summary="Apply for a job offer",
     *     tags={"Job Applications"},
     *     @OA\Parameter(
     *         name="jobOfferId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"applicant_name","applicant_email","applicant_phone","cv","cover_letter_type"},
     *                 @OA\Property(property="applicant_name", type="string", example="John Doe"),
     *                 @OA\Property(property="applicant_email", type="string", format="email", example="john@example.com"),
     *                 @OA\Property(property="applicant_phone", type="string", example="0123456789"),
     *                 @OA\Property(property="cv", type="string", format="binary", description="CV file (PDF, DOC, DOCX)"),
     *                 @OA\Property(property="cover_letter_type", type="string", enum={"text", "file"}),
     *                 @OA\Property(property="cover_letter_content", type="string", description="Text cover letter (if type=text)"),
     *                 @OA\Property(property="cover_letter_file", type="string", format="binary", description="Cover letter file (if type=file)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Application submitted successfully"
     *     )
     * )
     */
    public function store(Request $request, int $jobOfferId): JsonResponse
    {
        $key = 'job_application:' . $request->ip() . ':' . $jobOfferId;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de candidature. Veuillez réessayer dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $jobOffer = JobOffer::active()->find($jobOfferId);
        if (!$jobOffer) {
            return response()->json([
                'success' => false,
                'message' => 'Offre d\'emploi non trouvée ou non disponible',
                'error_code' => 'JOB_OFFER_NOT_FOUND',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'required|email|max:255',
            'applicant_phone' => 'required|string|max:20',
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter_type' => 'required|in:text,file',
            'cover_letter_content' => 'required_if:cover_letter_type,text|nullable|string|max:5000',
            'cover_letter_file' => 'required_if:cover_letter_type,file|nullable|file|mimes:pdf,doc,docx,txt|max:5120',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Vérifier si l'utilisateur a déjà postulé pour cette offre
        $existingApplication = JobApplication::where('job_offer_id', $jobOfferId)
            ->where('applicant_email', $request->applicant_email)
            ->first();

        if ($existingApplication) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà postulé pour cette offre d\'emploi',
                'error_code' => 'ALREADY_APPLIED',
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Upload du CV
            $cvUpload = $this->fileUploadService->uploadCV($request->file('cv'), $jobOfferId);
            if (!$cvUpload['success']) {
                RateLimiter::hit($key);
                return response()->json([
                    'success' => false,
                    'message' => $cvUpload['error'],
                    'error_code' => $cvUpload['error_code'],
                ], 400);
            }

            $applicationData = [
                'job_offer_id' => $jobOfferId,
                'applicant_name' => $request->applicant_name,
                'applicant_email' => $request->applicant_email,
                'applicant_phone' => $request->applicant_phone,
                'cv_path' => $cvUpload['path'],
                'cover_letter_type' => $request->cover_letter_type,
                'ip_address' => $request->ip(),
                'user_id' => $request->user()?->id,
            ];

            // Traitement de la lettre de motivation
            if ($request->cover_letter_type === 'text') {
                $applicationData['cover_letter_content'] = $request->cover_letter_content;
            } else {
                $coverLetterUpload = $this->fileUploadService->uploadCoverLetter(
                    $request->file('cover_letter_file'),
                    $jobOfferId
                );
                
                if (!$coverLetterUpload['success']) {
                    // Nettoyer le CV uploadé en cas d'échec
                    $this->fileUploadService->deleteFile($cvUpload['path']);
                    RateLimiter::hit($key);
                    return response()->json([
                        'success' => false,
                        'message' => $coverLetterUpload['error'],
                        'error_code' => $coverLetterUpload['error_code'],
                    ], 400);
                }
                
                $applicationData['cover_letter_path'] = $coverLetterUpload['path'];
            }

            $application = JobApplication::create($applicationData);

            DB::commit();
            RateLimiter::hit($key); // Compter comme une tentative même en cas de succès

            return response()->json([
                'success' => true,
                'message' => 'Votre candidature a été soumise avec succès. Nous vous contacterons bientôt.',
                'data' => [
                    'application_id' => $application->id,
                    'job_offer_title' => $jobOffer->title,
                    'company_name' => $jobOffer->company_display_name,
                    'submitted_at' => $application->created_at,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Nettoyer les fichiers en cas d'erreur
            if (isset($cvUpload['path'])) {
                $this->fileUploadService->deleteFile($cvUpload['path']);
            }
            if (isset($coverLetterUpload['path'])) {
                $this->fileUploadService->deleteFile($coverLetterUpload['path']);
            }

            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la soumission de votre candidature. Veuillez réessayer.',
                'error_code' => 'SUBMISSION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-applications",
     *     summary="Get all job applications (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="job_offer_id",
     *         in="query",
     *         description="Filter by job offer",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         @OA\Schema(type="string", enum={"pending", "under_review", "shortlisted", "rejected", "accepted"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job applications retrieved successfully"
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::with(['jobOffer.company', 'user', 'reviewer'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('job_offer_id')) {
            $query->byJobOffer($request->job_offer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $applications = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'total' => $applications->total(),
                'per_page' => $applications->perPage(),
                'last_page' => $applications->lastPage(),
                'pending_count' => JobApplication::pending()->count(),
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-applications/{id}",
     *     summary="Get job application details (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job application details retrieved successfully"
     *     )
     * )
     */
    public function show(JobApplication $jobApplication): JsonResponse
    {
        $jobApplication->load(['jobOffer.company', 'user', 'reviewer']);

        return response()->json([
            'success' => true,
            'data' => $jobApplication,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/job-applications/{id}/status",
     *     summary="Update job application status (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending", "under_review", "shortlisted", "rejected", "accepted"}),
     *             @OA\Property(property="notes", type="string", example="Excellent profile, proceed to interview")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Application status updated successfully"
     *     )
     * )
     */
    public function updateStatus(Request $request, JobApplication $jobApplication): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,under_review,shortlisted,rejected,accepted',
            'notes' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $reviewer = $request->user();
            $status = $request->status;
            $notes = $request->notes;

            switch ($status) {
                case 'under_review':
                    $jobApplication->markAsUnderReview($reviewer);
                    break;
                case 'shortlisted':
                    $jobApplication->shortlist($reviewer, $notes);
                    break;
                case 'rejected':
                    $jobApplication->reject($reviewer, $notes);
                    break;
                case 'accepted':
                    $jobApplication->accept($reviewer, $notes);
                    break;
                default:
                    $jobApplication->update([
                        'status' => $status,
                        'notes' => $notes ?: $jobApplication->notes,
                    ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Statut de la candidature mis à jour avec succès',
                'data' => $jobApplication->fresh()->load(['jobOffer.company', 'user', 'reviewer']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error_code' => 'STATUS_UPDATE_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/job-applications/{id}",
     *     summary="Delete job application (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job application deleted successfully"
     *     )
     * )
     */
    public function destroy(JobApplication $jobApplication): JsonResponse
    {
        try {
            // Supprimer les fichiers associés
            if ($jobApplication->cv_path) {
                $this->fileUploadService->deleteFile($jobApplication->cv_path);
            }
            
            if ($jobApplication->cover_letter_path) {
                $this->fileUploadService->deleteFile($jobApplication->cover_letter_path);
            }

            $jobApplication->delete();

            return response()->json([
                'success' => true,
                'message' => 'Candidature supprimée avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la candidature',
                'error_code' => 'DELETION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-applications/statistics",
     *     summary="Get job applications statistics (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Job applications statistics retrieved successfully"
     *     )
     * )
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => JobApplication::count(),
            'pending' => JobApplication::pending()->count(),
            'under_review' => JobApplication::underReview()->count(),
            'shortlisted' => JobApplication::shortlisted()->count(),
            'rejected' => JobApplication::rejected()->count(),
            'accepted' => JobApplication::accepted()->count(),
            'recent' => JobApplication::recent()->count(),
            'today' => JobApplication::whereDate('created_at', today())->count(),
            'this_week' => JobApplication::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => JobApplication::whereMonth('created_at', now()->month)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-applications/{id}/download/{type}",
     *     summary="Download application file (Admin only)",
     *     tags={"Job Applications"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="type",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string", enum={"cv", "cover-letter"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="File download initiated"
     *     )
     * )
     */
    public function downloadFile(JobApplication $jobApplication, string $type): JsonResponse
    {
        $filePath = null;
        $fileName = null;

        switch ($type) {
            case 'cv':
                $filePath = $jobApplication->cv_path;
                $fileName = 'CV_' . str_replace(' ', '_', $jobApplication->applicant_name);
                break;
            case 'cover-letter':
                if ($jobApplication->cover_letter_type === 'file') {
                    $filePath = $jobApplication->cover_letter_path;
                    $fileName = 'Lettre_motivation_' . str_replace(' ', '_', $jobApplication->applicant_name);
                }
                break;
        }

        if (!$filePath || !$this->fileUploadService->fileExists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'Fichier non trouvé',
                'error_code' => 'FILE_NOT_FOUND',
            ], 404);
        }

        $fileUrl = $this->fileUploadService->getFileUrl($filePath);

        return response()->json([
            'success' => true,
            'download_url' => $fileUrl,
            'file_name' => $fileName,
        ]);
    }
}