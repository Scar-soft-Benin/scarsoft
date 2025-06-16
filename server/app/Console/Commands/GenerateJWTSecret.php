<?php
// app/Console/Commands/GenerateJWTSecret.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateJWTSecret extends Command
{
    protected $signature = 'jwt:secret {--show : Afficher la clé au lieu de la modifier dans .env} {--force : Forcer la génération même si une clé existe}';
    
    protected $description = 'Génère une clé secrète JWT sécurisée';

    public function handle(): int
    {
        $key = $this->generateSecretKey();

        if ($this->option('show')) {
            $this->info('Clé JWT générée:');
            $this->line($key);
            return Command::SUCCESS;
        }

        if (!$this->option('force') && !empty(env('JWT_SECRET'))) {
            if (!$this->confirm('Une clé JWT existe déjà. Voulez-vous la remplacer?')) {
                $this->info('Opération annulée.');
                return Command::SUCCESS;
            }
        }

        $this->updateEnvironmentFile($key);
        
        $this->info('Clé JWT générée et ajoutée au fichier .env avec succès!');
        $this->warn('Attention: Cette clé est utilisée pour signer vos tokens JWT. Gardez-la secrète et sécurisée.');
        $this->warn('Changer cette clé invalidera tous les tokens JWT existants.');

        return Command::SUCCESS;
    }

    private function generateSecretKey(): string
    {
        return base64_encode(Str::random(64));
    }

    private function updateEnvironmentFile(string $key): void
    {
        $envPath = base_path('.env');
        
        if (!file_exists($envPath)) {
            $this->error('Fichier .env non trouvé. Veuillez le créer d\'abord.');
            return;
        }

        $envContent = file_get_contents($envPath);
        
        if (str_contains($envContent, 'JWT_SECRET=')) {
            $envContent = preg_replace(
                '/^JWT_SECRET=.*$/m',
                'JWT_SECRET=' . $key,
                $envContent
            );
        } else {
            $envContent .= "\nJWT_SECRET=" . $key . "\n";
        }

        file_put_contents($envPath, $envContent);
    }
}