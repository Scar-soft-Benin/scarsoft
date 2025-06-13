// ~/dashboard/job-management/jobForm.tsx
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Toast } from 'primereact/toast';
import { useLoading } from "~/context/loadingContext";
import { jobService, type ExtendedJobOffer, type JobServiceCreateRequest } from "~/services/jobService";

// Schéma de validation
const jobSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  type: z.enum(['Recrutement', 'Stage', 'Freelance'], {
    errorMap: () => ({ message: "Veuillez sélectionner un type" })
  }),
  contract: z.string().optional(),
  location: z.string().min(2, "Le lieu doit contenir au moins 2 caractères"),
  salary: z.string().optional(),
  mission: z.string().min(50, "La mission doit contenir au moins 50 caractères"),
  skills: z.array(z.string()).min(1, "Au moins une compétence est requise"),
  requirements: z.array(z.string()).min(1, "Au moins un prérequis est requis"),
  status: z.enum(['active', 'archived', 'draft'], {
    errorMap: () => ({ message: "Veuillez sélectionner un statut" })
  })
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: ExtendedJobOffer | null;
  onSave: () => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const toast = useRef<Toast>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      type: 'Recrutement',
      contract: '',
      location: 'Cotonou, Bénin',
      salary: '',
      mission: '',
      skills: [],
      requirements: [],
      status: 'active'
    }
  });

  useEffect(() => {
    if (job) {
      // Pré-remplir le formulaire pour l'édition
      reset({
        title: job.title,
        // type: job.type,
        contract: job.contract || '',
        location: job.location,
        salary: job.salary || '',
        mission: job.mission,
        skills: job.skills,
        requirements: job.requirements,
        status: job.status
      });
    } else {
      // Réinitialiser pour un nouveau job
      reset({
        title: '',
        type: 'Recrutement',
        contract: '',
        location: 'Cotonou, Bénin',
        salary: '',
        mission: '',
        skills: [],
        requirements: [],
        status: 'active'
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      showLoading();

      if (job) {
        // Mise à jour
        await jobService.updateJob({
          id: job.id,
          ...data
        });
      } else {
        // Création
        await jobService.createJob(data);
      }

      onSave();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: job 
          ? 'Impossible de modifier l\'offre' 
          : 'Impossible de créer l\'offre',
        life: 3000
      });
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  // Options pour les dropdowns
  const typeOptions = [
    { label: 'Recrutement', value: 'Recrutement' },
    { label: 'Stage', value: 'Stage' },
    { label: 'Freelance', value: 'Freelance' }
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Brouillon', value: 'draft' },
    { label: 'Archivée', value: 'archived' }
  ];

  const contractOptions = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Stage', value: 'Stage' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Temps partiel', value: 'Temps partiel' }
  ];

  return (
    <div className="job-form">
      <Toast ref={toast} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <div className="grid formgrid p-fluid">
          {/* Titre */}
          <div className="field col-12">
            <label htmlFor="title" className="font-bold">
              Titre du poste *
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputText
                  id="title"
                  {...field}
                  className={errors.title ? 'p-invalid' : ''}
                  placeholder="Ex: Développeur Full Stack React/Node.js"
                />
              )}
            />
            {errors.title && (
              <small className="p-error">{errors.title.message}</small>
            )}
          </div>

          {/* Type et Statut */}
          <div className="field col-12 md:col-6">
            <label htmlFor="type" className="font-bold">
              Type *
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="type"
                  {...field}
                  options={typeOptions}
                  className={errors.type ? 'p-invalid' : ''}
                  placeholder="Sélectionner un type"
                />
              )}
            />
            {errors.type && (
              <small className="p-error">{errors.type.message}</small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="status" className="font-bold">
              Statut *
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="status"
                  {...field}
                  options={statusOptions}
                  className={errors.status ? 'p-invalid' : ''}
                  placeholder="Sélectionner un statut"
                />
              )}
            />
            {errors.status && (
              <small className="p-error">{errors.status.message}</small>
            )}
          </div>

          {/* Contrat et Lieu */}
          <div className="field col-12 md:col-6">
            <label htmlFor="contract" className="font-bold">
              Type de contrat
            </label>
            <Controller
              name="contract"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="contract"
                  {...field}
                  options={contractOptions}
                  className={errors.contract ? 'p-invalid' : ''}
                  placeholder="Sélectionner un type de contrat"
                  showClear
                />
              )}
            />
            {errors.contract && (
              <small className="p-error">{errors.contract.message}</small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="location" className="font-bold">
              Lieu *
            </label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <InputText
                  id="location"
                  {...field}
                  className={errors.location ? 'p-invalid' : ''}
                  placeholder="Ex: Cotonou, Bénin"
                />
              )}
            />
            {errors.location && (
              <small className="p-error">{errors.location.message}</small>
            )}
          </div>

          {/* Salaire */}
          <div className="field col-12">
            <label htmlFor="salary" className="font-bold">
              Salaire
            </label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <InputText
                  id="salary"
                  {...field}
                  className={errors.salary ? 'p-invalid' : ''}
                  placeholder="Ex: 800 000 - 1 200 000 FCFA"
                />
              )}
            />
            {errors.salary && (
              <small className="p-error">{errors.salary.message}</small>
            )}
          </div>

          {/* Mission */}
          <div className="field col-12">
            <label htmlFor="mission" className="font-bold">
              Description de la mission *
            </label>
            <Controller
              name="mission"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="mission"
                  {...field}
                  rows={6}
                  className={errors.mission ? 'p-invalid' : ''}
                  placeholder="Décrivez en détail la mission et les responsabilités du poste..."
                />
              )}
            />
            {errors.mission && (
              <small className="p-error">{errors.mission.message}</small>
            )}
          </div>

          {/* Compétences */}
          <div className="field col-12">
            <label htmlFor="skills" className="font-bold">
              Compétences requises *
            </label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Chips
                  id="skills"
                  {...field}
                  className={errors.skills ? 'p-invalid' : ''}
                  placeholder="Appuyez sur Entrée pour ajouter une compétence"
                />
              )}
            />
            {errors.skills && (
              <small className="p-error">{errors.skills.message}</small>
            )}
            <small className="text-gray-500">
              Appuyez sur Entrée après chaque compétence pour l'ajouter à la liste
            </small>
          </div>

          {/* Prérequis */}
          <div className="field col-12">
            <label htmlFor="requirements" className="font-bold">
              Prérequis *
            </label>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <Chips
                  id="requirements"
                  {...field}
                  className={errors.requirements ? 'p-invalid' : ''}
                  placeholder="Appuyez sur Entrée pour ajouter un prérequis"
                />
              )}
            />
            {errors.requirements && (
              <small className="p-error">{errors.requirements.message}</small>
            )}
            <small className="text-gray-500">
              Appuyez sur Entrée après chaque prérequis pour l'ajouter à la liste
            </small>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            type="button"
            label="Annuler"
            icon="pi pi-times"
            className="p-button-text p-button-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label={job ? 'Modifier' : 'Créer'}
            icon={job ? 'pi pi-pencil' : 'pi pi-plus'}
            className="p-button-success"
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default JobForm;