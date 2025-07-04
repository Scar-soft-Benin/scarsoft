<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class JobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'title' => [
                'required',
                'string',
                'max:255',
                'min:5',
            ],
            'type' => [
                'required',
                Rule::in(['Recrutement', 'Stage', 'Freelance']),
            ],
            'contract' => [
                'nullable',
                'string',
                'max:100',
            ],
            'location' => [
                'required',
                'string',
                'max:255',
                'min:2',
            ],
            'salary' => [
                'nullable',
                'string',
                'max:255',
            ],
            'mission' => [
                'required',
                'string',
                'max:5000',
                'min:50',
            ],
            'skills' => [
                'required',
                'array',
                'min:1',
                'max:20',
            ],
            'skills.*' => [
                'required',
                'string',
                'max:255',
                'distinct',
            ],
            'requirements' => [
                'required',
                'array',
                'min:1',
                'max:15',
            ],
            'requirements.*' => [
                'required',
                'string',
                'max:500',
                'distinct',
            ],
            'company_id' => [
                'required',
                'integer',
                'exists:companies,id',
            ],
            'company_contact_email' => [
                'nullable',
                'email:rfc,dns',
                'max:255',
            ],
            'is_internal' => [
                'boolean',
            ],
            'status' => [
                'sometimes',
                Rule::in(['active', 'archived', 'draft']),
            ],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du poste est obligatoire.',
            'title.min' => 'Le titre du poste doit contenir au moins 5 caractères.',
            'title.max' => 'Le titre du poste ne peut pas dépasser 255 caractères.',
            'type.required' => 'Le type d\'offre est obligatoire.',
            'type.in' => 'Le type d\'offre doit être : Recrutement, Stage ou Freelance.',
            'contract.max' => 'Le type de contrat ne peut pas dépasser 100 caractères.',
            'location.required' => 'Le lieu de travail est obligatoire.',
            'location.min' => 'Le lieu de travail doit contenir au moins 2 caractères.',
            'location.max' => 'Le lieu de travail ne peut pas dépasser 255 caractères.',
            'salary.max' => 'La fourchette salariale ne peut pas dépasser 255 caractères.',
            'mission.required' => 'La description de la mission est obligatoire.',
            'mission.min' => 'La description de la mission doit contenir au moins 50 caractères.',
            'mission.max' => 'La description de la mission ne peut pas dépasser 5000 caractères.',
            'skills.required' => 'Au moins une compétence est requise.',
            'skills.min' => 'Au moins une compétence est requise.',
            'skills.max' => 'Maximum 20 compétences autorisées.',
            'skills.*.required' => 'Chaque compétence est obligatoire.',
            'skills.*.max' => 'Chaque compétence ne peut pas dépasser 255 caractères.',
            'skills.*.distinct' => 'Les compétences doivent être uniques.',
            'requirements.required' => 'Au moins un prérequis est requis.',
            'requirements.min' => 'Au moins un prérequis est requis.',
            'requirements.max' => 'Maximum 15 prérequis autorisés.',
            'requirements.*.required' => 'Chaque prérequis est obligatoire.',
            'requirements.*.max' => 'Chaque prérequis ne peut pas dépasser 500 caractères.',
            'requirements.*.distinct' => 'Les prérequis doivent être uniques.',
            'company_id.required' => 'L\'entreprise est obligatoire.',
            'company_id.exists' => 'L\'entreprise sélectionnée n\'existe pas.',
            'company_contact_email.email' => 'L\'email de contact doit être valide.',
            'company_contact_email.max' => 'L\'email de contact ne peut pas dépasser 255 caractères.',
            'status.in' => 'Le statut doit être : active, archived ou draft.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'titre du poste',
            'type' => 'type d\'offre',
            'contract' => 'type de contrat',
            'location' => 'lieu de travail',
            'salary' => 'fourchette salariale',
            'mission' => 'description de la mission',
            'skills' => 'compétences',
            'requirements' => 'prérequis',
            'company_id' => 'entreprise',
            'company_contact_email' => 'email de contact',
            'is_internal' => 'offre interne',
            'status' => 'statut',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreurs de validation dans l\'offre d\'emploi',
                'errors' => $validator->errors(),
                'error_code' => 'VALIDATION_FAILED',
            ], 422)
        );
    }

    protected function prepareForValidation(): void
    {
        // Nettoyer les données avant validation
        $this->merge([
            'title' => trim($this->title ?? ''),
            'location' => trim($this->location ?? ''),
            'salary' => trim($this->salary ?? '') ?: null,
            'mission' => trim($this->mission ?? ''),
            'company_contact_email' => strtolower(trim($this->company_contact_email ?? '')) ?: null,
            'is_internal' => $this->boolean('is_internal', false),
        ]);

        // Nettoyer les tableaux
        if ($this->has('skills') && is_array($this->skills)) {
            $this->merge([
                'skills' => array_filter(array_map('trim', $this->skills))
            ]);
        }

        if ($this->has('requirements') && is_array($this->requirements)) {
            $this->merge([
                'requirements' => array_filter(array_map('trim', $this->requirements))
            ]);
        }
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            // Vérifier que l'entreprise est active
            if ($this->filled('company_id')) {
                $company = \App\Models\Company::find($this->company_id);
                if ($company && !$company->isActive()) {
                    $validator->errors()->add(
                        'company_id',
                        'Impossible de créer une offre pour une entreprise inactive.'
                    );
                }
            }

            // Validation conditionnelle pour les offres internes
            if ($this->boolean('is_internal')) {
                $scarSoftCompany = \App\Models\Company::where('email', 'contact@scar-soft.com')->first();
                if ($scarSoftCompany && $this->company_id != $scarSoftCompany->id) {
                    $validator->errors()->add(
                        'is_internal',
                        'Les offres internes doivent être associées à l\'entreprise ScarSoft.'
                    );
                }
            }
        });
    }
}