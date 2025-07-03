<?php
// database/seeders/CompanySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        // Créer l'utilisateur admin par défaut s'il n'existe pas
        $admin = User::firstOrCreate(
            ['email' => 'admin@scar-soft.com'],
            [
                'name' => 'Admin ScarSoft',
                'password' => bcrypt('password123'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Créer l'entreprise ScarSoft
        Company::firstOrCreate(
            ['email' => 'contact@scar-soft.com'],
            [
                'name' => 'ScarSoft',
                'phone' => '+229 68 505 786',
                'address' => "Agla, Petit à petit 2\nCotonou, Littoral\nBénin",
                'website' => 'https://scar-soft.com',
                'contact_person' => 'Équipe ScarSoft',
                'status' => 'active',
                'notes' => 'Entreprise principale - ScarSoft. Société spécialisée dans le développement d\'applications, le marketing digital et le recrutement IT.',
                'created_by' => $admin->id,
            ]
        );

        // Créer quelques entreprises clientes d'exemple
        $clientCompanies = [
            [
                'name' => 'TechCorp Solutions',
                'email' => 'contact@techcorp-solutions.com',
                'phone' => '+229 21 123 456',
                'address' => "Zone Industrielle\nCotonou, Bénin",
                'website' => 'https://techcorp-solutions.com',
                'contact_person' => 'Jean-Baptiste Kouassi',
                'status' => 'active',
                'notes' => 'Client entreprise spécialisée dans les solutions technologiques pour PME.',
            ],
            [
                'name' => 'Digital Finance Group',
                'email' => 'rh@digitalfinance.bj',
                'phone' => '+229 21 987 654',
                'address' => "Quartier des Affaires\nCotonou, Bénin",
                'website' => 'https://digitalfinance.bj',
                'contact_person' => 'Marie Assogba',
                'status' => 'active',
                'notes' => 'Groupe financier recherchant des profils tech pour leur transformation digitale.',
            ],
            [
                'name' => 'StartUp Innovation Hub',
                'email' => 'team@startup-hub.org',
                'phone' => '+229 21 456 789',
                'address' => "Cocotomey\nAbomey-Calavi, Atlantique\nBénin",
                'website' => 'https://startup-hub.org',
                'contact_person' => 'Kofi Mensah',
                'status' => 'active',
                'notes' => 'Incubateur de startups, recrute régulièrement des développeurs et designers.',
            ],
            [
                'name' => 'EcoAgri Technologies',
                'email' => 'contact@ecoagri-tech.com',
                'phone' => '+229 21 321 654',
                'address' => "Zone Agro-industrielle\nParakou, Borgou\nBénin",
                'website' => null,
                'contact_person' => 'Dr. Amélie Togbé',
                'status' => 'inactive',
                'notes' => 'Entreprise agro-tech temporairement inactive. Contact suspendu.',
            ],
        ];

        foreach ($clientCompanies as $companyData) {
            Company::firstOrCreate(
                ['email' => $companyData['email']],
                array_merge($companyData, ['created_by' => $admin->id])
            );
        }

        $this->command->info('✅ Entreprises créées avec succès!');
        $this->command->info('📧 Admin créé: admin@scar-soft.com / password123');
        $this->command->info('🏢 ' . Company::count() . ' entreprises créées au total');
    }
}