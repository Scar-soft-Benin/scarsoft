<?php
// app/Http/Controllers/API/JobOfferController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

/**
 * @OA\Tag(
 *     name="Job Offers",
 *     description="API endpoints for job offer management"
 * )
 */
class JobOfferController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/job-offers",
     *     summary="Get public job offers",
     *     tags={"Job Offers"},
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Filter by job type",
     *         @OA\Schema(type="string", enum={"Recrutement", "Stage", "Freelance"})
     *     ),
     *     @OA\Parameter(
     *         name="location",
     *         in="query",
     *         description="Filter by location",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search in title, location, mission",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job offers retrieved successfully"
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobOffer::with(['company'])
            ->active()
            ->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        if ($request->filled('location')) {
            $query->byLocation($request->location);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $jobOffers = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $jobOffers->items(),
            'meta' => [
                'current_page' => $jobOffers->currentPage(),
                'total' => $jobOffers->total(),
                'per_page' => $jobOffers->perPage(),
                'last_page' => $jobOffers->lastPage(),
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-offers",
     *     summary="Get all job offers (Admin only)",
     *     tags={"Job Offers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Job offers retrieved successfully"
     *     )
     * )
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = JobOffer::with(['company', 'creator'])
            ->withCount(['applications', 'pendingApplications'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $jobOffers = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $jobOffers->items(),
            'meta' => [
                'current_page' => $jobOffers->currentPage(),
                'total' => $jobOffers->total(),
                'per_page' => $jobOffers->perPage(),
                'last_page' => $jobOffers->lastPage(),
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/job-offers",
     *     summary="Create a new job offer (Admin only)",
     *     tags={"Job Offers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","type","location","mission","skills","requirements","company_id"},
     *             @OA\Property(property="title", type="string", example="Développeur Full Stack"),
     *             @OA\Property(property="type", type="string", enum={"Recrutement", "Stage", "Freelance"}),
     *             @OA\Property(property="contract", type="string", example="CDI"),
     *             @OA\Property(property="location", type="string", example="Cotonou, Bénin"),
     *             @OA\Property(property="salary", type="string", example="800 000 - 1 200 000 FCFA"),
     *             @OA\Property(property="mission", type="string", example="Développer des applications web modernes"),
     *             @OA\Property(property="skills", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="requirements", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="company_id", type="integer", example=1),
     *             @OA\Property(property="company_contact_email", type="string", format="email"),
     *             @OA\Property(property="is_internal", type="boolean", example=false)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Job offer created successfully"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $key = 'job_offer_create:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de création. Veuillez réessayer dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|in:Recrutement,Stage,Freelance',
            'contract' => 'nullable|string|max:100',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'mission' => 'required|string|max:5000',
            'skills' => 'required|array|min:1',
            'skills.*' => 'required|string|max:255',
            'requirements' => 'required|array|min:1',
            'requirements.*' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
            'company_contact_email' => 'nullable|email',
            'is_internal' => 'boolean',
            'status' => 'sometimes|in:active,archived,draft',
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $company = Company::findOrFail($request->company_id);
            
            if (!$company->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de créer une offre pour une entreprise inactive',
                    'error_code' => 'INACTIVE_COMPANY',
                ], 400);
            }

            $jobOffer = JobOffer::create([
                'title' => $request->title,
                'type' => $request->type,
                'contract' => $request->contract,
                'location' => $request->location,
                'salary' => $request->salary,
                'mission' => $request->mission,
                'skills' => $request->skills,
                'requirements' => $request->requirements,
                'company_id' => $request->company_id,
                'company_contact_email' => $request->company_contact_email,
                'is_internal' => $request->boolean('is_internal', false),
                'status' => $request->get('status', 'active'),
                'created_by' => $request->user()->id,
            ]);

            RateLimiter::clear($key);

            return response()->json([
                'success' => true,
                'message' => 'Offre d\'emploi créée avec succès',
                'data' => $jobOffer->load(['company', 'creator']),
            ], 201);

        } catch (\Exception $e) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'offre d\'emploi',
                'error_code' => 'CREATION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/job-offers/{id}",
     *     summary="Get job offer details",
     *     tags={"Job Offers"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job offer details retrieved successfully"
     *     )
     * )
     */
    public function show(JobOffer $jobOffer): JsonResponse
    {
        // Vérifier si l'offre est accessible au public
        if (!$jobOffer->isActive() && !auth('api')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Offre d\'emploi non trouvée',
                'error_code' => 'NOT_FOUND',
            ], 404);
        }

        $jobOffer->load(['company']);

        // Si c'est un admin, charger les candidatures
        if (auth('api')->check()) {
            $jobOffer->loadCount(['applications', 'pendingApplications']);
        }

        return response()->json([
            'success' => true,
            'data' => $jobOffer,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/job-offers/{id}",
     *     summary="Update job offer (Admin only)",
     *     tags={"Job Offers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job offer updated successfully"
     *     )
     * )
     */
    public function update(Request $request, JobOffer $jobOffer): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:Recrutement,Stage,Freelance',
            'contract' => 'nullable|string|max:100',
            'location' => 'sometimes|required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'mission' => 'sometimes|required|string|max:5000',
            'skills' => 'sometimes|required|array|min:1',
            'skills.*' => 'required|string|max:255',
            'requirements' => 'sometimes|required|array|min:1',
            'requirements.*' => 'required|string|max:255',
            'company_id' => 'sometimes|required|exists:companies,id',
            'company_contact_email' => 'nullable|email',
            'is_internal' => 'boolean',
            'status' => 'sometimes|in:active,archived,draft',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $jobOffer->update($request->only([
                'title', 'type', 'contract', 'location', 'salary', 'mission',
                'skills', 'requirements', 'company_id', 'company_contact_email',
                'is_internal', 'status'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Offre d\'emploi mise à jour avec succès',
                'data' => $jobOffer->fresh()->load(['company', 'creator']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'offre d\'emploi',
                'error_code' => 'UPDATE_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/job-offers/{id}",
     *     summary="Delete job offer (Admin only)",
     *     tags={"Job Offers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Job offer deleted successfully"
     *     )
     * )
     */
    public function destroy(JobOffer $jobOffer): JsonResponse
    {
        if (!$jobOffer->canBeDeleted()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une offre qui a reçu des candidatures',
                'error_code' => 'HAS_APPLICATIONS',
            ], 400);
        }

        try {
            $jobOffer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Offre d\'emploi supprimée avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'offre d\'emploi',
                'error_code' => 'DELETION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/job-offers/statistics",
     *     summary="Get job offers statistics (Admin only)",
     *     tags={"Job Offers"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Job offers statistics retrieved successfully"
     *     )
     * )
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => JobOffer::count(),
            'active' => JobOffer::active()->count(),
            'archived' => JobOffer::archived()->count(),
            'draft' => JobOffer::draft()->count(),
            'internal' => JobOffer::internal()->count(),
            'external' => JobOffer::external()->count(),
            'by_type' => [
                'recrutement' => JobOffer::byType('Recrutement')->count(),
                'stage' => JobOffer::byType('Stage')->count(),
                'freelance' => JobOffer::byType('Freelance')->count(),
            ],
            'total_applications' => \App\Models\JobApplication::count(),
            'recent_offers' => JobOffer::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}