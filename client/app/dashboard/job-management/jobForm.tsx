// ~/dashboard/job-management/JobForm.tsx
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "~/context/messageContext";
import type { CreateJobPayload } from "~/services/types/job.types";
import TagInput from "../components/tagInput";
import AppButton from "../components/appButton";
import { createJob } from "~/store/sagas/jobSaga";
import type { RootState } from "~/store";
import { getAllCompanies } from "~/store/reducer/companyReducer";
import type { Company } from "~/services/types/company.types";

const jobSchema = z.object({
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
    type: z.enum(["Recrutement", "Stage", "Freelance"], {
        errorMap: () => ({ message: "Veuillez sélectionner un type" })
    }),
    contract: z.string().optional(),
    location: z.string().min(2, "Le lieu doit contenir au moins 2 caractères"),
    salary: z.string().optional(),
    mission: z
        .string()
        .min(50, "La mission doit contenir au moins 50 caractères"),
    skills: z.array(z.string()).min(1, "Au moins une compétence est requise"),
    requirements: z
        .array(z.string())
        .min(1, "Au moins un prérequis est requis"),
    company_id: z.number().min(1, "L'ID de l'entreprise est requis"),
    company_contact_email: z.string().email("Adresse email invalide"),
    is_internal: z.boolean()
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
    onSave: () => void;
    onCancel: () => void;
}

export default function JobForm({ onSave, onCancel }: JobFormProps) {
    const dispatch = useDispatch();
    const { addMessage } = useMessage();
    const { companies, loading, error } = useSelector(
        (state: RootState) => state.company
    );
    const [companyFetchError, setCompanyFetchError] = useState<string | null>(
        null
    );

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
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
            company_id: 1, // Default value, adjust based on auth context
            company_contact_email: "",
            is_internal: false
        }
    });

    useEffect(() => {
        reset({
            title: "",
            type: "Recrutement",
            contract: "",
            location: "Cotonou, Bénin",
            salary: "",
            mission: "",
            skills: [],
            requirements: [],
            company_id: 1, // Adjust based on auth context
            company_contact_email: "",
            is_internal: false
        });
    }, [reset]);

    // Fetch companies on mount
    useEffect(() => {
        console.log("JobForm: Dispatching getAllCompanies");
        dispatch(getAllCompanies({ status: "active" })); // Required status
    }, [dispatch]);

    // Handle company fetch errors
    useEffect(() => {
        if (error) {
            console.log("JobForm: Company fetch error:", error);
            setCompanyFetchError(error);
            addMessage(error, "error");
        } else {
            setCompanyFetchError(null);
        }
    }, [error, addMessage]);

    // Set default company_id if companies are loaded
    useEffect(() => {
        if (companies.length > 0 && !errors.company_id) {
            console.log(
                "JobForm: Setting default company_id:",
                companies[0].id
            );
            setValue("company_id", companies[0].id);
        }
    }, [companies, setValue]);

    const onSubmit = async (data: JobFormData) => {
        console.log("JobForm: onSubmit called with data:", data);
        try {
            dispatch(createJob(data as CreateJobPayload));
            onSave();
        } catch (error) {
            console.error("JobForm: Error in onSubmit:", error);
            addMessage("Impossible de créer l'offre", "error");
        }
    };

    const typeOptions = [
        { label: "Recrutement", value: "Recrutement" },
        { label: "Stage", value: "Stage" },
        { label: "Freelance", value: "Freelance" }
    ];

    const contractOptions = [
        { label: "Aucun", value: "" },
        { label: "CDI", value: "CDI" },
        { label: "CDD", value: "CDD" },
        { label: "Stage", value: "Stage" },
        { label: "Freelance", value: "Freelance" },
        { label: "Temps partiel", value: "Temps partiel" }
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
                                    errors.title
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                placeholder="Ex: Développeur Full Stack React/Node.js"
                            />
                        )}
                    />
                    {errors.title && (
                        <small className="text-danger">
                            {errors.title.message}
                        </small>
                    )}
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
                                    errors.type
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                            >
                                {typeOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.type && (
                        <small className="text-danger">
                            {errors.type.message}
                        </small>
                    )}
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
                                    errors.contract
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                            >
                                {contractOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.contract && (
                        <small className="text-danger">
                            {errors.contract.message}
                        </small>
                    )}
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
                                    errors.location
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                placeholder="Ex: Cotonou, Bénin"
                            />
                        )}
                    />
                    {errors.location && (
                        <small className="text-danger">
                            {errors.location.message}
                        </small>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="company_contact_email"
                        className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
                    >
                        Email de contact *
                    </label>
                    <Controller
                        name="company_contact_email"
                        control={control}
                        render={({ field }) => (
                            <input
                                id="company_contact_email"
                                {...field}
                                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                                    errors.company_contact_email
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                placeholder="Ex: user@example.com"
                            />
                        )}
                    />
                    {errors.company_contact_email && (
                        <small className="text-danger">
                            {errors.company_contact_email.message}
                        </small>
                    )}
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
                                    errors.salary
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                placeholder="Ex: 800 000 - 1 200 000 FCFA"
                            />
                        )}
                    />
                    {errors.salary && (
                        <small className="text-danger">
                            {errors.salary.message}
                        </small>
                    )}
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
                                    errors.mission
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                placeholder="Décrivez en détail la mission et les responsabilités du poste..."
                            />
                        )}
                    />
                    {errors.mission && (
                        <small className="text-danger">
                            {errors.mission.message}
                        </small>
                    )}
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
                        Appuyez sur Entrée après chaque compétence pour
                        l'ajouter à la liste
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
                        Appuyez sur Entrée après chaque prérequis pour l'ajouter
                        à la liste
                    </small>
                </div>

                <div>
                    <label
                        htmlFor="company_id"
                        className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
                    >
                        Entreprise *
                    </label>
                    <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => (
                            <select
                                id="company_id"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                }
                                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                                    errors.company_id
                                        ? "border-danger"
                                        : "border-neutral-light-border dark:border-neutral-dark-border"
                                } focus:ring-primary focus:border-primary`}
                                disabled={loading || !!companyFetchError}
                            >
                                <option value="" disabled>
                                    {loading
                                        ? "Chargement..."
                                        : companyFetchError
                                        ? "Erreur de chargement"
                                        : "Sélectionner une entreprise"}
                                </option>
                                {companies.map((company: Company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.company_id && (
                        <small className="text-danger">
                            {errors.company_id.message}
                        </small>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="is_internal"
                        className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
                    >
                        Offre interne
                    </label>
                    <Controller
                        name="is_internal"
                        control={control}
                        render={({
                            field: { onChange, value, ref, name, onBlur }
                        }) => (
                            <input
                                id="is_internal"
                                type="checkbox"
                                name={name}
                                ref={ref}
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                onBlur={onBlur}
                                className="mt-1"
                            />
                        )}
                    />
                    {errors.is_internal && (
                        <small className="text-danger">
                            {errors.is_internal.message}
                        </small>
                    )}
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
                    className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text border-amber-500 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-400"
                />
                <AppButton
                    label="Créer"
                    type="primary"
                    size="md"
                    typeAttr="submit" // Use type="submit" for form submission
                    disabled={isSubmitting}
                    className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
                />
            </div>
        </form>
    );
}
