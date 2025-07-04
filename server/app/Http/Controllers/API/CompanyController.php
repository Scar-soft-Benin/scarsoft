<?php
// app/Http/Controllers/API/CompanyController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

/**
 * @OA\Tag(
 *     name="Company Management",
 *     description="API endpoints for managing companies"
 * )
 */
class CompanyController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/companies",
     *     summary="Get all companies",
     *     tags={"Company Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search companies by name, email or contact person",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         @OA\Schema(type="string", enum={"active", "inactive"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Companies retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="TechCorp Solutions"),
     *                 @OA\Property(property="email", type="string", example="contact@techcorp.com"),
     *                 @OA\Property(property="status", type="string", example="active"),
     *                 @OA\Property(property="job_offers_count", type="integer", example=5)
     *             )),
     *             @OA\Property(property="meta", type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="total", type="integer", example=50),
     *                 @OA\Property(property="per_page", type="integer", example=15),
     *                 @OA\Property(property="last_page", type="integer", example=4)
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Company::with(['creator', 'jobOffers'])
            ->withCount(['jobOffers', 'activeJobOffers']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $companies = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $companies->items(),
            'meta' => [
                'current_page' => $companies->currentPage(),
                'total' => $companies->total(),
                'per_page' => $companies->perPage(),
                'last_page' => $companies->lastPage(),
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/companies",
     *     summary="Create a new company",
     *     tags={"Company Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email"},
     *             @OA\Property(property="name", type="string", example="TechCorp Solutions"),
     *             @OA\Property(property="email", type="string", format="email", example="contact@techcorp.com"),
     *             @OA\Property(property="phone", type="string", example="0123456789"),
     *             @OA\Property(property="address", type="string", example="123 Business Street, City"),
     *             @OA\Property(property="website", type="string", example="https://techcorp.com"),
     *             @OA\Property(property="contact_person", type="string", example="John Manager"),
     *             @OA\Property(property="notes", type="string", example="Important client notes")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Company created successfully"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $key = 'company_create:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 10)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de tentatives de création. Veuillez réessayer dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:companies,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'contact_person' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
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
            $company = Company::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'website' => $request->website,
                'contact_person' => $request->contact_person,
                'notes' => $request->notes,
                'created_by' => $request->user()->id,
            ]);

            RateLimiter::clear($key);

            return response()->json([
                'success' => true,
                'message' => 'Entreprise créée avec succès',
                'data' => $company->load('creator'),
            ], 201);

        } catch (\Exception $e) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'entreprise',
                'error_code' => 'CREATION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/companies/{id}",
     *     summary="Get company details",
     *     tags={"Company Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Company details retrieved successfully"
     *     )
     * )
     */
    public function show(Company $company): JsonResponse
    {
        $company->load(['creator', 'jobOffers' => function ($query) {
            $query->with('applications')->withCount('applications');
        }]);

        return response()->json([
            'success' => true,
            'data' => $company,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/companies/{id}",
     *     summary="Update company",
     *     tags={"Company Management"},
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
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="address", type="string"),
     *             @OA\Property(property="website", type="string"),
     *             @OA\Property(property="contact_person", type="string"),
     *             @OA\Property(property="status", type="string", enum={"active", "inactive"}),
     *             @OA\Property(property="notes", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Company updated successfully"
     *     )
     * )
     */
    public function update(Request $request, Company $company): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:companies,email,' . $company->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'contact_person' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:active,inactive',
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
            $company->update($request->only([
                'name', 'email', 'phone', 'address', 'website', 
                'contact_person', 'status', 'notes'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Entreprise mise à jour avec succès',
                'data' => $company->fresh()->load('creator'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'entreprise',
                'error_code' => 'UPDATE_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/companies/{id}",
     *     summary="Delete company",
     *     tags={"Company Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Company deleted successfully"
     *     )
     * )
     */
    public function destroy(Company $company): JsonResponse
    {
        if ($company->jobOffers()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une entreprise qui a des offres d\'emploi',
                'error_code' => 'HAS_JOB_OFFERS',
            ], 400);
        }

        try {
            $company->delete();

            return response()->json([
                'success' => true,
                'message' => 'Entreprise supprimée avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'entreprise',
                'error_code' => 'DELETION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/companies/{id}/statistics",
     *     summary="Get company statistics",
     *     tags={"Company Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Company statistics retrieved successfully"
     *     )
     * )
     */
    public function statistics(Company $company): JsonResponse
    {
        $stats = [
            'total_job_offers' => $company->jobOffers()->count(),
            'active_job_offers' => $company->activeJobOffers()->count(),
            'archived_job_offers' => $company->jobOffers()->archived()->count(),
            'total_applications' => $company->jobOffers()->withCount('applications')->get()->sum('applications_count'),
            'pending_applications' => $company->jobOffers()->with(['applications' => function($q) {
                $q->where('status', 'pending');
            }])->get()->sum(function($offer) {
                return $offer->applications->count();
            }),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}