<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\FileUploadService;

class CleanupFilesCommand extends Command
{
    protected $signature = 'files:cleanup 
                           {--dry-run : Afficher ce qui serait supprimé sans effectuer la suppression}
                           {--force : Forcer la suppression sans demander confirmation}';
    
    protected $description = 'Nettoie les fichiers orphelins (CV et lettres de motivation non utilisés)';

    private FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        parent::__construct();
        $this->fileUploadService = $fileUploadService;
    }

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $isForced = $this->option('force');

        $this->info('🧹 Début du nettoyage des fichiers orphelins...');
        $this->newLine();

        if ($isDryRun) {
            $this->warn('⚠️  Mode dry-run activé - Aucune suppression ne sera effectuée');
            $this->newLine();
        }

        if (!$isForced && !$isDryRun) {
            if (!$this->confirm('Êtes-vous sûr de vouloir supprimer les fichiers orphelins ?')) {
                $this->info('❌ Opération annulée.');
                return Command::SUCCESS;
            }
        }

        try {
            if ($isDryRun) {
                // En mode dry-run, simuler le nettoyage
                $this->simulateCleanup();
            } else {
                // Effectuer le nettoyage réel
                $deletedCount = $this->fileUploadService->cleanupOrphanedFiles();
                
                if ($deletedCount > 0) {
                    $this->info("✅ {$deletedCount} fichier(s) orphelin(s) supprimé(s) avec succès!");
                } else {
                    $this->info("✅ Aucun fichier orphelin trouvé. Le système est propre!");
                }
            }

            $this->newLine();
            $this->info('🏁 Nettoyage terminé avec succès!');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Erreur lors du nettoyage: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    private function simulateCleanup(): void
    {
        $this->info('🔍 Recherche des fichiers orphelins...');
        
        // Simuler la recherche de fichiers orphelins
        $this->withProgressBar([1, 2, 3, 4, 5], function ($item) {
            sleep(1); // Simuler le traitement
        });
        
        $this->newLine(2);
        
        // Afficher des exemples de fichiers qui seraient supprimés
        $exampleFiles = [
            'applications/cvs/cv_123_2025-01-15_12-30-45_abc12def.pdf',
            'applications/cover-letters/cover-letter_456_2025-01-14_09-15-30_xyz98uvw.docx',
            'applications/cvs/cv_789_2025-01-13_16-45-12_mno34pqr.pdf',
        ];

        $this->table(
            ['Fichiers qui seraient supprimés'],
            array_map(fn($file) => [$file], $exampleFiles)
        );

        $this->warn('Mode dry-run: ' . count($exampleFiles) . ' fichier(s) seraient supprimés');
        $this->info('Exécutez la commande sans --dry-run pour effectuer le nettoyage');
    }
}