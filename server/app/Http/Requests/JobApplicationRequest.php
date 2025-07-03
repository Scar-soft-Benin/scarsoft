<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class JobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicant_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-ZÀ-ÿ\s\-\'\.]+$/', // Lettres, espaces, traits d'union, apostrophes et points
            ],
            'applicant_email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'unique:job_applications,applicant_email,NULL,id,job_offer_id,' . $this->route('jobOffer'),
            ],
            'applicant_phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[\+]?[0-9\s\-\(\)]+$/', // Numéros, espaces, traits d'union, parenthèses et +
            ],
            'cv' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:5120', // 5MB
            ],
            'cover_letter_type' => [
                'required',
                'in:text,file',
            ],
            'cover_letter_content' => [
                'required_if:cover_letter_type,text',
                'nullable',
                'string',
                'min:50',
                'max:5000',
            ],
            'cover_letter_file' => [
                'required_if:cover_letter_type,file',
                'nullable',
                'file',
                'mimes:pdf,doc,docx,txt',
                'max:5120', // 5MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'applicant_name.required' => 'Le nom complet est obligatoire.',
            'applicant_name.regex' => 'Le nom ne peut contenir que des lettres, espaces, traits d\'union et apostrophes.',
            'applicant_email.required' => 'L\'adresse email est obligatoire.',
            'applicant_email.email' => 'L\'adresse email doit être valide.',
            'applicant_email.unique' => 'Vous avez déjà postulé pour cette offre d\'emploi.',
            'applicant_phone.required' => 'Le numéro de téléphone est obligatoire.',
            'applicant_phone.regex' => 'Le format du numéro de téléphone n\'est pas valide.',
            'cv.required' => 'Le CV est obligatoire.',
            'cv.mimes' => 'Le CV doit être un fichier PDF, DOC ou DOCX.',
            'cv.max' => 'Le CV ne peut pas dépasser 5MB.',
            'cover_letter_type.required' => 'Le type de lettre de motivation est obligatoire.',
            'cover_letter_type.in' => 'Le type de lettre de motivation doit être "text" ou "file".',
            'cover_letter_content.required_if' => 'Le contenu de la lettre de motivation est obligatoire.',
            'cover_letter_content.min' => 'La lettre de motivation doit contenir au moins 50 caractères.',
            'cover_letter_content.max' => 'La lettre de motivation ne peut pas dépasser 5000 caractères.',
            'cover_letter_file.required_if' => 'Le fichier de lettre de motivation est obligatoire.',
            'cover_letter_file.mimes' => 'La lettre de motivation doit être un fichier PDF, DOC, DOCX ou TXT.',
            'cover_letter_file.max' => 'La lettre de motivation ne peut pas dépasser 5MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            'applicant_name' => 'nom complet',
            'applicant_email' => 'adresse email',
            'applicant_phone' => 'numéro de téléphone',
            'cv' => 'CV',
            'cover_letter_type' => 'type de lettre de motivation',
            'cover_letter_content' => 'contenu de la lettre de motivation',
            'cover_letter_file' => 'fichier de lettre de motivation',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreurs de validation dans votre candidature',
                'errors' => $validator->errors(),
                'error_code' => 'VALIDATION_FAILED',
            ], 422)
        );
    }

    protected function prepareForValidation(): void
    {
        // Nettoyer les données avant validation
        $this->merge([
            'applicant_name' => trim($this->applicant_name ?? ''),
            'applicant_email' => strtolower(trim($this->applicant_email ?? '')),
            'applicant_phone' => preg_replace('/\s+/', '', $this->applicant_phone ?? ''),
        ]);
    }
}