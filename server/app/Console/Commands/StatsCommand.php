<?php
// app/Console/Commands/StatsCommand.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Company;
use App\Models\Contact;
use App\Models\JobOffer;
use App\Models\JobApplication;
use App\Models\User;

class StatsCommand extends Command
{
    protected $signature = 'system:stats 
                           {--detailed : Afficher les statistiques détaillées}
                           {--json : Afficher les résultats en format JSON}';
    
    protected $description = 'Affiche les statistiques générales du système';

    public function handle(): int
    {
        $isDetailed = $this->option('detailed');
        $isJson = $this->option('json');

        if ($isJson) {
            $this->outputJson($isDetailed);
        } else {
            $this->outputTable($isDetailed);
        }

        return Command::SUCCESS;
    }

    private function getStats(bool $detailed = false): array
    {
        $stats = [
            'system' => [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'active' => Company::active()->count(),
                'inactive' => Company::inactive()->count(),
            ],
            'contacts' => [
                'total' => Contact::count(),
                'unread' => Contact::unread()->count(),
                'replied' => Contact::replied()->count(),
                'recent' => Contact::recent()->count(),
            ],
            'job_offers' => [
                'total' => JobOffer::count(),
                'active' => JobOffer::active()->count(),
                'archived' => JobOffer::archived()->count(),
                'internal' => JobOffer::internal()->count(),
                'external' => JobOffer::external()->count(),
            ],
            'job_applications' => [
                'total' => JobApplication::count(),
                'pending' => JobApplication::pending()->count(),
                'under_review' => JobApplication::underReview()->count(),
                'shortlisted' => JobApplication::shortlisted()->count(),
                'accepted' => JobApplication::accepted()->count(),
                'rejected' => JobApplication::rejected()->count(),
            ],
        ];

        if ($detailed) {
            $stats['detailed'] = [
                'job_offers_by_type' => [
                    'recrutement' => JobOffer::byType('Recrutement')->count(),
                    'stage' => JobOffer::byType('Stage')->count(),
                    'freelance' => JobOffer::byType('Freelance')->count(),
                ],
                'recent_activity' => [
                    'contacts_today' => Contact::whereDate('created_at', today())->count(),
                    'applications_today' => JobApplication::whereDate('created_at', today())->count(),
                    'offers_this_week' => JobOffer::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                    'users_this_month' => User::whereMonth('created_at', now()->month)->count(),
                ],
                'top_companies' => Company::withCount('jobOffers')
                    ->orderBy('job_offers_count', 'desc')
                    ->limit(5)
                    ->get(['name', 'job_offers_count'])
                    ->toArray(),
            ];
        }

        return $stats;
    }

    private function outputTable(bool $detailed): void
    {
        $stats = $this->getStats($detailed);

        $this->info('📊 Statistiques Générales du Système');
        $this->info('════════════════════════════════════');
        $this->newLine();

        // Statistiques des utilisateurs
        $this->line('👥 <fg=cyan>UTILISATEURS</fg=cyan>');
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Total utilisateurs', $stats['system']['total_users']],
                ['Utilisateurs actifs', $stats['system']['active_users']],
                ['Emails vérifiés', $stats['system']['verified_users']],
            ]
        );

        // Statistiques des entreprises
        $this->line('🏢 <fg=cyan>ENTREPRISES</fg=cyan>');
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Total entreprises', $stats['companies']['total']],
                ['Entreprises actives', $stats['companies']['active']],
                ['Entreprises inactives', $stats['companies']['inactive']],
            ]
        );

        // Statistiques des contacts
        $this->line('📧 <fg=cyan>CONTACTS</fg=cyan>');
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Total messages', $stats['contacts']['total']],
                ['Messages non lus', $stats['contacts']['unread']],
                ['Messages traités', $stats['contacts']['replied']],
                ['Messages récents (30j)', $stats['contacts']['recent']],
            ]
        );

        // Statistiques des offres d'emploi
        $this->line('💼 <fg=cyan>OFFRES D\'EMPLOI</fg=cyan>');
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Total offres', $stats['job_offers']['total']],
                ['Offres actives', $stats['job_offers']['active']],
                ['Offres archivées', $stats['job_offers']['archived']],
                ['Offres internes', $stats['job_offers']['internal']],
                ['Offres clients', $stats['job_offers']['external']],
            ]
        );

        // Statistiques des candidatures
        $this->line('📝 <fg=cyan>CANDIDATURES</fg=cyan>');
        $this->table(
            ['Métrique', 'Valeur'],
            [
                ['Total candidatures', $stats['job_applications']['total']],
                ['En attente', $stats['job_applications']['pending']],
                ['En cours d\'examen', $stats['job_applications']['under_review']],
                ['Présélectionnées', $stats['job_applications']['shortlisted']],
                ['Acceptées', $stats['job_applications']['accepted']],
                ['Rejetées', $stats['job_applications']['rejected']],
            ]
        );

        if ($detailed && isset($stats['detailed'])) {
            $this->newLine();
            $this->line('📈 <fg=yellow>STATISTIQUES DÉTAILLÉES</fg=yellow>');
            
            // Types d'offres
            $this->line('📋 Types d\'offres d\'emploi:');
            $this->table(
                ['Type', 'Nombre'],
                [
                    ['Recrutement', $stats['detailed']['job_offers_by_type']['recrutement']],
                    ['Stage', $stats['detailed']['job_offers_by_type']['stage']],
                    ['Freelance', $stats['detailed']['job_offers_by_type']['freelance']],
                ]
            );

            // Activité récente
            $this->line('⏰ Activité récente:');
            $this->table(
                ['Période', 'Contacts', 'Candidatures', 'Offres', 'Utilisateurs'],
                [
                    [
                        "Aujourd'hui",
                        $stats['detailed']['recent_activity']['contacts_today'],
                        $stats['detailed']['recent_activity']['applications_today'],
                        '-',
                        '-'
                    ],
                    [
                        'Cette semaine',
                        '-',
                        '-',
                        $stats['detailed']['recent_activity']['offers_this_week'],
                        '-'
                    ],
                    [
                        'Ce mois',
                        '-',
                        '-',
                        '-',
                        $stats['detailed']['recent_activity']['users_this_month']
                    ],
                ]
            );

            // Top entreprises
            if (!empty($stats['detailed']['top_companies'])) {
                $this->line('🏆 Top 5 entreprises (par nombre d\'offres):');
                $topCompanies = array_map(function($company) {
                    return [$company['name'], $company['job_offers_count']];
                }, $stats['detailed']['top_companies']);
                
                $this->table(['Entreprise', 'Nombre d\'offres'], $topCompanies);
            }
        }

        $this->newLine();
        $this->info('✅ Statistiques générées le ' . now()->format('d/m/Y à H:i:s'));
    }

    private function outputJson(bool $detailed): void
    {
        $stats = $this->getStats($detailed);
        $stats['generated_at'] = now()->toISOString();
        
        $this->line(json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}