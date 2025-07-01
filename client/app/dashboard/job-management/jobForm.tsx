// ~/dashboard/job-management/JobForm.tsx
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoading } from "~/context/loadingContext";
import { useMessage } from "~/context/messageContext";
import { jobService, type ExtendedJobOffer } from "~/services/jobService";
import TagInput from "../components/tagInput";
import AppButton from "../components/appButton";

const jobSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  type: z.enum(["Recrutement", "Stage", "Freelance"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type" }),
  }),
  contract: z.string().optional(),
  location: z.string().min(2, "Le lieu doit contenir au moins 2 caractères"),
  salary: z.string().optional(),
  mission: z.string().min(50, "La mission doit contenir au moins 50 caractères"),
  skills: z.array(z.string()).min(1, "Au moins une compétence est requise"),
  requirements: z.array(z.string()).min(1, "Au moins un prérequis est requis"),
  status: z.enum(["active", "archived", "draft"], {
    errorMap: () => ({ message: "Veuillez sélectionner un statut" }),
  }),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: ExtendedJobOffer | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const { showLoading, hideLoading } = useLoading();
  const { addMessage } = useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      type: "Recrutement",
      contract: "",
      location: "Cotonou, Bénin",
      salary: "",
      mission: "",
      skills: [],
      requirements: [],
      status: "active",
    },
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        type: (["Recrutement", "Stage", "Freelance"].includes(job.type) ? job.type : "Recrutement") as "Recrutement" | "Stage" | "Freelance",
        contract: job.contract || "",
        location: job.location,
        salary: job.salary || "",
        mission: job.mission,
        skills: job.skills,
        requirements: job.requirements,
        status: job.status,
      });
    } else {
      reset({
        title: "",
        type: "Recrutement",
        contract: "",
        location: "Cotonou, Bénin",
        salary: "",
        mission: "",
        skills: [],
        requirements: [],
        status: "active",
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    try {
      showLoading();
      if (job) {
        await jobService.updateJob({ id: job.id, ...data });
        addMessage("Offre modifiée avec succès", "success");
      } else {
        await jobService.createJob(data);
        addMessage("Offre créée avec succès", "success");
      }
      onSave();
    } catch {
      addMessage(
        job ? "Impossible de modifier l'offre" : "Impossible de créer l'offre",
        "error"
      );
    } finally {
      hideLoading();
    }
  };

  const typeOptions = [
    { label: "Recrutement", value: "Recrutement" },
    { label: "Stage", value: "Stage" },
    { label: "Freelance", value: "Freelance" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Brouillon", value: "draft" },
    { label: "Archivée", value: "archived" },
  ];

  const contractOptions = [
    { label: "Aucun", value: "" },
    { label: "CDI", value: "CDI" },
    { label: "CDD", value: "CDD" },
    { label: "Stage", value: "Stage" },
    { label: "Freelance", value: "Freelance" },
    { label: "Temps partiel", value: "Temps partiel" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Titre du poste *
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                id="title"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.title ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
                placeholder="Ex: Développeur Full Stack React/Node.js"
              />
            )}
          />
          {errors.title && <small className="text-danger">{errors.title.message}</small>}
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Type *
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                id="type"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.type ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.type && <small className="text-danger">{errors.type.message}</small>}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Statut *
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                id="status"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.status ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.status && <small className="text-danger">{errors.status.message}</small>}
        </div>

        <div>
          <label
            htmlFor="contract"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Type de contrat
          </label>
          <Controller
            name="contract"
            control={control}
            render={({ field }) => (
              <select
                id="contract"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.contract ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
              >
                {contractOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.contract && <small className="text-danger">{errors.contract.message}</small>}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Lieu *
          </label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <input
                id="location"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.location ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
                placeholder="Ex: Cotonou, Bénin"
              />
            )}
          />
          {errors.location && <small className="text-danger">{errors.location.message}</small>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="salary"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Salaire
          </label>
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <input
                id="salary"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.salary ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
                placeholder="Ex: 800 000 - 1 200 000 FCFA"
              />
            )}
          />
          {errors.salary && <small className="text-danger">{errors.salary.message}</small>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="mission"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Description de la mission *
          </label>
          <Controller
            name="mission"
            control={control}
            render={({ field }) => (
              <textarea
                id="mission"
                {...field}
                rows={6}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.mission ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
                placeholder="Décrivez en détail la mission et les responsabilités du poste..."
              />
            )}
          />
          {errors.mission && <small className="text-danger">{errors.mission.message}</small>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="skills"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Compétences requises *
          </label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                name="skills"
                placeholder="Appuyez sur Entrée pour ajouter une compétence"
                error={errors.skills?.message}
              />
            )}
          />
          <small className="text-neutral-light-secondary dark:text-neutral-dark-secondary mt-1">
            Appuyez sur Entrée après chaque compétence pour l'ajouter à la liste
          </small>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="requirements"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            Prérequis *
          </label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
                name="requirements"
                placeholder="Appuyez sur Entrée pour ajouter un prérequis"
                error={errors.requirements?.message}
              />
            )}
          />
          <small className="text-neutral-light-secondary dark:text-neutral-dark-secondary mt-1">
            Appuyez sur Entrée après chaque prérequis pour l'ajouter à la liste
          </small>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <AppButton
          label="Annuler"
          type="secondary"
          size="md"
          outlined
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text border-amber-500 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-400 "
        />
        <AppButton
          label={job ? "Modifier" : "Créer"}
          type="primary"
          size="md"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
        />
      </div>
    </form>
  );
}