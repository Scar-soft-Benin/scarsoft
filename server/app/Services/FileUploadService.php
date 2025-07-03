<?php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    private array $allowedCvTypes = ['pdf', 'doc', 'docx'];
    private array $allowedCoverLetterTypes = ['pdf', 'doc', 'docx', 'txt'];
    private int $maxFileSize = 5120; // 5MB in KB

    public function uploadCV(UploadedFile $file, int $jobOfferId): array
    {
        if (!$this->validateFile($file, $this->allowedCvTypes)) {
            return [
                'success' => false,
                'error' => 'Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX',
                'error_code' => 'INVALID_FILE_TYPE',
            ];
        }

        if (!$this->validateFileSize($file)) {
            return [
                'success' => false,
                'error' => 'Fichier trop volumineux. Taille maximum : 5MB',
                'error_code' => 'FILE_TOO_LARGE',
            ];
        }

        $filename = $this->generateUniqueFilename($file, 'cv', $jobOfferId);
        $path = $file->storeAs('applications/cvs', $filename, 'public');

        return [
            'success' => true,
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ];
    }

    public function uploadCoverLetter(UploadedFile $file, int $jobOfferId): array
    {
        if (!$this->validateFile($file, $this->allowedCoverLetterTypes)) {
            return [
                'success' => false,
                'error' => 'Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, TXT',
                'error_code' => 'INVALID_FILE_TYPE',
            ];
        }

        if (!$this->validateFileSize($file)) {
            return [
                'success' => false,
                'error' => 'Fichier trop volumineux. Taille maximum : 5MB',
                'error_code' => 'FILE_TOO_LARGE',
            ];
        }

        $filename = $this->generateUniqueFilename($file, 'cover-letter', $jobOfferId);
        $path = $file->storeAs('applications/cover-letters', $filename, 'public');

        return [
            'success' => true,
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ];
    }

    public function deleteFile(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return true;
    }

    public function getFileUrl(string $path): string
    {
        return Storage::url($path);
    }

    public function getFileSize(string $path): int
    {
        return Storage::disk('public')->size($path);
    }

    public function fileExists(string $path): bool
    {
        return Storage::disk('public')->exists($path);
    }

    private function validateFile(UploadedFile $file, array $allowedTypes): bool
    {
        $extension = strtolower($file->getClientOriginalExtension());
        return in_array($extension, $allowedTypes);
    }

    private function validateFileSize(UploadedFile $file): bool
    {
        return $file->getSize() <= ($this->maxFileSize * 1024);
    }

    private function generateUniqueFilename(UploadedFile $file, string $type, int $jobOfferId): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('Y-m-d_H-i-s');
        $random = Str::random(8);
        
        return "{$type}_{$jobOfferId}_{$timestamp}_{$random}.{$extension}";
    }

    public function cleanupOrphanedFiles(): int
    {
        $deletedCount = 0;
        
        // Récupérer tous les fichiers CV stockés
        $cvFiles = Storage::disk('public')->files('applications/cvs');
        $coverLetterFiles = Storage::disk('public')->files('applications/cover-letters');
        
        // Récupérer les chemins utilisés en base de données
        $usedCvPaths = \App\Models\JobApplication::pluck('cv_path')->filter()->toArray();
        $usedCoverLetterPaths = \App\Models\JobApplication::whereNotNull('cover_letter_path')
            ->pluck('cover_letter_path')->filter()->toArray();
        
        // Supprimer les fichiers CV orphelins
        foreach ($cvFiles as $file) {
            if (!in_array($file, $usedCvPaths)) {
                Storage::disk('public')->delete($file);
                $deletedCount++;
            }
        }
        
        // Supprimer les fichiers de lettres de motivation orphelins
        foreach ($coverLetterFiles as $file) {
            if (!in_array($file, $usedCoverLetterPaths)) {
                Storage::disk('public')->delete($file);
                $deletedCount++;
            }
        }
        
        return $deletedCount;
    }

    public function getFileInfo(string $path): ?array
    {
        if (!$this->fileExists($path)) {
            return null;
        }

        return [
            'path' => $path,
            'url' => $this->getFileUrl($path),
            'size' => $this->getFileSize($path),
            'size_human' => $this->formatBytes($this->getFileSize($path)),
            'last_modified' => Storage::disk('public')->lastModified($path),
        ];
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}