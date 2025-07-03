<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="SCARSOFT API",
 *     version="1.0.0",
 *     description="API SCARSOFT de recrutement et d'offres d'emploi",
 *     @OA\Contact(
 *         email="support@scarsoft.com",
 *         name="Support SCARSOFT"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Serveur de développement SCARSOFT"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Authentification JWT via header Authorization: Bearer {token}"
 * )
 * 
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     description="Modèle utilisateur",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="Identifiant unique de l'utilisateur",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="name",
 *         type="string",
 *         description="Nom complet de l'utilisateur",
 *         example="John Doe"
 *     ),
 *     @OA\Property(
 *         property="email",
 *         type="string",
 *         format="email",
 *         description="Adresse email de l'utilisateur",
 *         example="john.doe@example.com"
 *     ),
 *     @OA\Property(
 *         property="email_verified_at",
 *         type="string",
 *         format="date-time",
 *         nullable=true,
 *         description="Date et heure de vérification de l'email",
 *         example="2024-01-15T10:30:00Z"
 *     ),
 *     @OA\Property(
 *         property="is_active",
 *         type="boolean",
 *         description="Statut d'activation du compte",
 *         example=true
 *     ),
 *     @OA\Property(
 *         property="last_login_at",
 *         type="string",
 *         format="date-time",
 *         nullable=true,
 *         description="Date et heure de la dernière connexion",
 *         example="2024-01-15T14:25:30Z"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Date et heure de création du compte",
 *         example="2024-01-10T09:15:00Z"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Date et heure de dernière mise à jour",
 *         example="2024-01-15T14:25:30Z"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="ApiResponse",
 *     type="object",
 *     title="Réponse API standard",
 *     description="Structure de réponse standard de l'API",
 *     @OA\Property(
 *         property="success",
 *         type="boolean",
 *         description="Indique si la requête a réussi",
 *         example=true
 *     ),
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         description="Message descriptif de la réponse",
 *         example="Opération réussie"
 *     ),
 *     @OA\Property(
 *         property="error_code",
 *         type="string",
 *         nullable=true,
 *         description="Code d'erreur en cas d'échec",
 *         example="VALIDATION_FAILED"
 *     )
 * )
 */
abstract class Controller
{
    //
}