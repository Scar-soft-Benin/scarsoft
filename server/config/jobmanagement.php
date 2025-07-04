<?php
// config/jobmanagement.php

return [
    /*
    |--------------------------------------------------------------------------
    | Job Management Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour le système de gestion des emplois et candidatures
    |
    */

    'file_uploads' => [
        /*
        |--------------------------------------------------------------------------
        | Types de fichiers autorisés
        |--------------------------------------------------------------------------
        */
        'cv' => [
            'allowed_types' => ['pdf', 'doc', 'docx'],
            'max_size_mb' => 5,
        ],
        
        'cover_letter' => [
            'allowed_types' => ['pdf', 'doc', 'docx', 'txt'],
            'max_size_mb' => 5,
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Chemins de stockage
        |--------------------------------------------------------------------------
        */
        'storage_paths' => [
            'cv' => 'applications/cvs',
            'cover_letters' => 'applications/cover-letters',
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Nettoyage automatique
        |--------------------------------------------------------------------------
        */
        'cleanup' => [
            'auto_cleanup_enabled' => env('JOB_MANAGEMENT_AUTO_CLEANUP', false),
            'cleanup_schedule' => 'weekly', // daily, weekly, monthly
            'orphaned_files_retention_days' => 30,
        ],
    ],

    'applications' => [
        /*
        |--------------------------------------------------------------------------
        | Limitation des candidatures
        |--------------------------------------------------------------------------
        */
        'rate_limiting' => [
            'per_ip_per_day' => 10,
            'per_email_per_offer' => 1, // Une seule candidature par email par offre
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Statuts des candidatures
        |--------------------------------------------------------------------------
        */
        'statuses' => [
            'pending' => 'En attente',
            'under_review' => 'En cours d\'examen',
            'shortlisted' => 'Présélectionné',
            'rejected' => 'Rejeté',
            'accepted' => 'Accepté',
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Notifications automatiques
        |--------------------------------------------------------------------------
        */
        'notifications' => [
            'send_confirmation_to_applicant' => env('JOB_SEND_APPLICANT_CONFIRMATION', true),
            'send_notification_to_company' => env('JOB_SEND_COMPANY_NOTIFICATION', true),
            'send_status_updates' => env('JOB_SEND_STATUS_UPDATES', true),
        ],
    ],

    'job_offers' => [
        /*
        |--------------------------------------------------------------------------
        | Configuration des offres d'emploi
        |--------------------------------------------------------------------------
        */
        'types' => [
            'Recrutement',
            'Stage', 
            'Freelance',
        ],
        
        'statuses' => [
            'active' => 'Active',
            'archived' => 'Archivée',
            'draft' => 'Brouillon',
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Limites de contenu
        |--------------------------------------------------------------------------
        */
        'limits' => [
            'max_skills' => 20,
            'max_requirements' => 15,
            'min_mission_length' => 50,
            'max_mission_length' => 5000,
        ],
        
        /*
        |--------------------------------------------------------------------------
        | Publication automatique
        |--------------------------------------------------------------------------
        */
        'auto_publish' => [
            'internal_offers' => true,
            'external_offers' => false, // Nécessite validation manuelle
        ],
    ],

    'companies' => [
        /*
        |--------------------------------------------------------------------------
        | Configuration des entreprises
        |--------------------------------------------------------------------------
        */
        'default_company' => [
            'name' => 'ScarSoft',
            'email' => 'contact@scar-soft.com',
            'is_internal' => true,
        ],
        
        'validation' => [
            'require_unique_email' => true,
            'auto_activate' => true,
        ],
    ],

    'contacts' => [
        /*
        |--------------------------------------------------------------------------
        | Configuration du système de contact
        |--------------------------------------------------------------------------
        */
        'rate_limiting' => [
            'per_ip_per_hour' => 5,
            'per_email_per_day' => 3,
        ],
        
        'auto_response' => [
            'enabled' => env('CONTACT_AUTO_RESPONSE', false),
            'template' => 'emails.contact-auto-response',
        ],
        
        'admin_notification' => [
            'enabled' => env('CONTACT_ADMIN_NOTIFICATION', true),
            'email' => env('CONTACT_ADMIN_EMAIL', 'admin@scar-soft.com'),
        ],
    ],

    'security' => [
        /*
        |--------------------------------------------------------------------------
        | Sécurité et validation
        |--------------------------------------------------------------------------
        */
        'file_scanning' => [
            'enabled' => env('JOB_MANAGEMENT_FILE_SCAN', false),
            'max_scan_size_mb' => 10,
        ],
        
        'input_sanitization' => [
            'strip_html_tags' => true,
            'filter_profanity' => false,
        ],
        
        'ip_blocking' => [
            'enabled' => env('JOB_MANAGEMENT_IP_BLOCKING', false),
            'blocked_ips' => [],
        ],
    ],

    'emails' => [
        /*
        |--------------------------------------------------------------------------
        | Configuration des emails manuels
        |--------------------------------------------------------------------------
        */
        'templates' => [
            'candidate' => 'emails.candidate-notification',
            'company' => 'emails.company-notification',
        ],
        
        'from' => [
            'address' => env('MAIL_FROM_ADDRESS', 'noreply@scar-soft.com'),
            'name' => env('MAIL_FROM_NAME', 'ScarSoft'),
        ],
        
        'attachments' => [
            'max_total_size_mb' => 25, // Taille max totale des pièces jointes
            'cv_filename_format' => 'CV_{candidate_name}',
            'cover_letter_filename_format' => 'Lettre_motivation_{candidate_name}',
        ],
        
        'rate_limiting' => [
            'max_emails_per_admin_per_hour' => 50,
        ],
    ],
        /*
        |--------------------------------------------------------------------------
        | Configuration API
        |--------------------------------------------------------------------------
        */
        'pagination' => [
            'default_per_page' => 15,
            'max_per_page' => 100,
        ],
        
        'cache' => [
            'enabled' => env('JOB_MANAGEMENT_CACHE', true),
            'ttl_minutes' => 60,
        ],
        
        'versioning' => [
            'current_version' => 'v1',
            'supported_versions' => ['v1'],
        ],
];