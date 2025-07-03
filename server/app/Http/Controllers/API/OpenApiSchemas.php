<?php
namespace App\Http\Controllers\API;

/**
 * @OA\Info(
 *     title="ScarSoft API Documentation",
 *     version="1.0.0",
 *     description="API complète pour la gestion des emplois, candidatures et contacts",
 *     @OA\Contact(
 *         email="contact@scar-soft.com",
 *         name="ScarSoft Support"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Serveur de développement"
 * )
 * 
 * @OA\Server(
 *     url="https://api.scar-soft.com",
 *     description="Serveur de production"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Authentification JWT via header Authorization: Bearer {token}"
 * )
 */

/**
 * @OA\Schema(
 *     schema="Company",
 *     type="object",
 *     title="Company",
 *     description="Modèle d'entreprise cliente",
 *     required={"id", "name", "email", "status", "created_at", "updated_at"},
 *     @OA\Property(property="id", type="integer", example=1, description="Identifiant unique"),
 *     @OA\Property(property="name", type="string", example="TechCorp Solutions", description="Nom de l'entreprise"),
 *     @OA\Property(property="email", type="string", format="email", example="contact@techcorp.com", description="Email de contact"),
 *     @OA\Property(property="phone", type="string", example="+229 21 123 456", description="Numéro de téléphone"),
 *     @OA\Property(property="address", type="string", example="Zone Industrielle, Cotonou", description="Adresse complète"),
 *     @OA\Property(property="website", type="string", example="https://techcorp.com", description="Site web"),
 *     @OA\Property(property="contact_person", type="string", example="Jean-Baptiste Kouassi", description="Personne de contact"),
 *     @OA\Property(property="status", type="string", enum={"active", "inactive"}, example="active", description="Statut de l'entreprise"),
 *     @OA\Property(property="notes", type="string", example="Client important", description="Notes internes"),
 *     @OA\Property(property="created_by", type="integer", example=1, description="ID de l'admin créateur"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-15T10:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-01-15T10:00:00Z"),
 *     @OA\Property(property="job_offers_count", type="integer", example=5, description="Nombre d'offres d'emploi"),
 *     @OA\Property(property="active_job_offers_count", type="integer", example=3, description="Nombre d'offres actives")
 * )
 */

/**
 * @OA\Schema(
 *     schema="JobOffer",
 *     type="object",
 *     title="Job Offer",
 *     description="Modèle d'offre d'emploi",
 *     required={"id", "title", "type", "location", "mission", "skills", "requirements", "status"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Développeur Full Stack"),
 *     @OA\Property(property="type", type="string", enum={"Recrutement", "Stage", "Freelance"}, example="Recrutement"),
 *     @OA\Property(property="contract", type="string", example="CDI"),
 *     @OA\Property(property="location", type="string", example="Cotonou, Bénin"),
 *     @OA\Property(property="salary", type="string", example="800 000 - 1 200 000 FCFA"),
 *     @OA\Property(property="mission", type="string", example="Développer des applications web modernes"),
 *     @OA\Property(property="skills", type="array", @OA\Items(type="string"), example={"React.js", "Laravel", "MySQL"}),
 *     @OA\Property(property="requirements", type="array", @OA\Items(type="string"), example={"3+ ans d'expérience", "Autonomie"}),
 *     @OA\Property(property="status", type="string", enum={"active", "archived", "draft"}, example="active"),
 *     @OA\Property(property="company_id", type="integer", example=1),
 *     @OA\Property(property="company_contact_email", type="string", format="email", example="rh@techcorp.com"),
 *     @OA\Property(property="is_internal", type="boolean", example=false),
 *     @OA\Property(property="created_by", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="applications_count", type="integer", example=12),
 *     @OA\Property(property="pending_applications_count", type="integer", example=5)
 * )
 */

/**
 * @OA\Schema(
 *     schema="JobApplication",
 *     type="object",
 *     title="Job Application",
 *     description="Modèle de candidature",
 *     required={"id", "applicant_name", "applicant_email", "applicant_phone", "cv_path", "cover_letter_type", "status"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="job_offer_id", type="integer", example=1),
 *     @OA\Property(property="applicant_name", type="string", example="Jean Dupont"),
 *     @OA\Property(property="applicant_email", type="string", format="email", example="jean@example.com"),
 *     @OA\Property(property="applicant_phone", type="string", example="+229 12 34 56 78"),
 *     @OA\Property(property="cv_path", type="string", example="applications/cvs/cv_1_2025-01-15.pdf"),
 *     @OA\Property(property="cover_letter_type", type="string", enum={"text", "file"}, example="text"),
 *     @OA\Property(property="cover_letter_content", type="string", example="Votre lettre de motivation..."),
 *     @OA\Property(property="cover_letter_path", type="string", example="applications/cover-letters/letter_1_2025-01-15.pdf"),
 *     @OA\Property(property="status", type="string", enum={"pending", "under_review", "shortlisted", "rejected", "accepted"}, example="pending"),
 *     @OA\Property(property="notes", type="string", example="Profil intéressant"),
 *     @OA\Property(property="reviewed_by", type="integer", example=1),
 *     @OA\Property(property="reviewed_at", type="string", format="date-time"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="ip_address", type="string", example="192.168.1.1"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Contact",
 *     type="object",
 *     title="Contact",
 *     description="Modèle de message de contact",
 *     required={"id", "name", "email", "subject", "message", "status"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Marie Martin"),
 *     @OA\Property(property="email", type="string", format="email", example="marie@example.com"),
 *     @OA\Property(property="phone", type="string", example="+229 12 34 56 78"),
 *     @OA\Property(property="subject", type="string", example="Demande d'information"),
 *     @OA\Property(property="message", type="string", example="Bonjour, je souhaiterais en savoir plus..."),
 *     @OA\Property(property="status", type="string", enum={"unread", "read", "replied", "archived"}, example="unread"),
 *     @OA\Property(property="ip_address", type="string", example="192.168.1.1"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="replied_at", type="string", format="date-time"),
 *     @OA\Property(property="replied_by", type="integer", example=1),
 *     @OA\Property(property="reply_message", type="string", example="Merci pour votre message..."),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     description="Modèle d'utilisateur",
 *     required={"id", "name", "email"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Admin ScarSoft"),
 *     @OA\Property(property="email", type="string", format="email", example="admin@scar-soft.com"),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="last_login_at", type="string", format="date-time"),
 *     @OA\Property(property="last_login_ip", type="string", example="192.168.1.1"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="ApiResponse",
 *     type="object",
 *     title="API Response",
 *     description="Format de réponse standard de l'API",
 *     required={"success"},
 *     @OA\Property(property="success", type="boolean", example=true, description="Statut de la requête"),
 *     @OA\Property(property="message", type="string", example="Opération réussie", description="Message de retour"),
 *     @OA\Property(property="data", type="object", description="Données de retour"),
 *     @OA\Property(property="error_code", type="string", example="VALIDATION_FAILED", description="Code d'erreur en cas d'échec"),
 *     @OA\Property(property="errors", type="object", description="Détails des erreurs de validation")
 * )
 */

/**
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     type="object",
 *     title="Pagination Meta",
 *     description="Métadonnées de pagination",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="total", type="integer", example=50),
 *     @OA\Property(property="per_page", type="integer", example=15),
 *     @OA\Property(property="last_page", type="integer", example=4)
 * )
 */

class OpenApiSchemas
{
    // Cette classe sert uniquement à définir les schémas OpenAPI
    // Elle n'a pas de méthodes fonctionnelles
}