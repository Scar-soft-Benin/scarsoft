<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

/**
 * @OA\Tag(
 *     name="Contact Management",
 *     description="API endpoints for contact form and management"
 * )
 */
class ContactController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/contacts",
     *     summary="Submit contact form",
     *     tags={"Contact Management"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","subject","message"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="phone", type="string", example="0123456789"),
     *             @OA\Property(property="subject", type="string", example="Service inquiry"),
     *             @OA\Property(property="message", type="string", example="I would like to know more about your services.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Contact message sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Message sent successfully")
     *         )
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $key = 'contact_form:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Trop de messages envoyés. Veuillez réessayer dans ' . $seconds . ' secondes.',
                'error_code' => 'RATE_LIMIT_EXCEEDED',
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:500',
            'message' => 'required|string|max:5000',
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
            $contact = Contact::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'subject' => $request->subject,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_id' => $request->user()?->id,
            ]);

            RateLimiter::hit($key); // Compter comme une tentative même en cas de succès

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                'data' => [
                    'id' => $contact->id,
                    'submitted_at' => $contact->created_at,
                ],
            ], 201);

        } catch (\Exception $e) {
            RateLimiter::hit($key);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
                'error_code' => 'SUBMISSION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/contacts",
     *     summary="Get all contact messages (Admin only)",
     *     tags={"Contact Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         @OA\Schema(type="string", enum={"unread", "read", "replied", "archived"})
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search in name, email, subject or message",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contact messages retrieved successfully"
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::with(['user', 'repliedBy'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $contacts = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $contacts->items(),
            'meta' => [
                'current_page' => $contacts->currentPage(),
                'total' => $contacts->total(),
                'per_page' => $contacts->perPage(),
                'last_page' => $contacts->lastPage(),
                'unread_count' => Contact::unread()->count(),
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/contacts/{id}",
     *     summary="Get contact message details (Admin only)",
     *     tags={"Contact Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contact message retrieved successfully"
     *     )
     * )
     */
    public function show(Contact $contact): JsonResponse
    {
        // Marquer comme lu si non lu
        if ($contact->isUnread()) {
            $contact->markAsRead();
        }

        $contact->load(['user', 'repliedBy']);

        return response()->json([
            'success' => true,
            'data' => $contact,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/contacts/{id}/reply",
     *     summary="Reply to contact message (Admin only)",
     *     tags={"Contact Management"},
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
     *             required={"reply_message"},
     *             @OA\Property(property="reply_message", type="string", example="Thank you for your message. We will get back to you soon.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reply sent successfully"
     *     )
     * )
     */
    public function reply(Request $request, Contact $contact): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reply_message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $contact->markAsReplied($request->user(), $request->reply_message);

            // Ici, vous pourriez ajouter l'envoi d'un email de réponse
            // à l'utilisateur si nécessaire

            return response()->json([
                'success' => true,
                'message' => 'Réponse envoyée avec succès',
                'data' => $contact->fresh()->load(['user', 'repliedBy']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la réponse',
                'error_code' => 'REPLY_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/admin/contacts/{id}/status",
     *     summary="Update contact message status (Admin only)",
     *     tags={"Contact Management"},
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
     *             @OA\Property(property="status", type="string", enum={"unread", "read", "replied", "archived"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Status updated successfully"
     *     )
     * )
     */
    public function updateStatus(Request $request, Contact $contact): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:unread,read,replied,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Statut invalide',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            if ($request->status === 'archived') {
                $contact->archive();
            } else {
                $contact->update(['status' => $request->status]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => $contact->fresh(),
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
     *     path="/api/admin/contacts/{id}",
     *     summary="Delete contact message (Admin only)",
     *     tags={"Contact Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contact message deleted successfully"
     *     )
     * )
     */
    public function destroy(Contact $contact): JsonResponse
    {
        try {
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message supprimé avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du message',
                'error_code' => 'DELETION_FAILED',
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/admin/contacts/statistics",
     *     summary="Get contact statistics (Admin only)",
     *     tags={"Contact Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Contact statistics retrieved successfully"
     *     )
     * )
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Contact::count(),
            'unread' => Contact::unread()->count(),
            'read' => Contact::read()->count(),
            'replied' => Contact::replied()->count(),
            'archived' => Contact::archived()->count(),
            'recent' => Contact::recent()->count(),
            'today' => Contact::whereDate('created_at', today())->count(),
            'this_week' => Contact::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => Contact::whereMonth('created_at', now()->month)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}