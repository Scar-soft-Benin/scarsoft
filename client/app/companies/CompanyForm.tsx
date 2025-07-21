import { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useMessage } from "~/context/messageContext";
import type { CreateCompanyPayload } from "~/services/types/company.types";
// import AppButton from "../components/appButton";
import { createCompany } from "~/store/sagas/companySaga";
import AppButton from "~/dashboard/components/appButton";

const companySchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .min(6, "Le numéro de téléphone doit contenir au moins 6 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  contact_person: z
    .string()
    .min(3, "Le contact doit contenir au moins 3 caractères"),
  notes: z.string().optional()
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  onSave: () => void;
  onCancel: () => void;
  initialEmail?: string; // Nouveau prop pour pré-remplir l'email
}

export default function CompanyForm({ onSave, onCancel, initialEmail }: CompanyFormProps) {
  const dispatch = useDispatch();
  const { addMessage } = useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: initialEmail || "",
      phone: "",
      address: "",
      website: "",
      contact_person: "",
      notes: ""
    },
    shouldFocusError: false
  });

  useEffect(() => {
    console.log("CompanyForm: Resetting form");
    reset({
      name: "",
      email: initialEmail || "",
      phone: "",
      address: "",
      website: "",
      contact_person: "",
      notes: ""
    });
  }, [reset, initialEmail]);

  const onSubmit: SubmitHandler<CompanyFormData> = (data, event) => {
    event?.preventDefault();
    console.log("CompanyForm: onSubmit called with data:", data);
    try {
      dispatch(createCompany(data as CreateCompanyPayload));
      console.log("CompanyForm: Dispatched createCompany action");
      addMessage("Entreprise créée avec succès", "success");
      onSave();
    } catch (error) {
      console.error("CompanyForm: Error in onSubmit:", error);
      addMessage("Impossible de créer l'entreprise", "error");
    }
  };

  return (
    <div className="company-form p-6">
      <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
        Créer une Entreprise
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Nom de l'entreprise *
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  id="name"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.name
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: TechCorp Solutions"
                />
              )}
            />
            {errors.name && (
              <small className="text-danger">
                {errors.name.message}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Email *
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  id="email"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.email
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: contact@techcorp.com"
                />
              )}
            />
            {errors.email && (
              <small className="text-danger">
                {errors.email.message}
              </small>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Téléphone *
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  id="phone"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.phone
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: 0123456789"
                />
              )}
            />
            {errors.phone && (
              <small className="text-danger">
                {errors.phone.message}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Adresse *
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  id="address"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.address
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: 123 Business Street, City"
                />
              )}
            />
            {errors.address && (
              <small className="text-danger">
                {errors.address.message}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="website"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Site web
            </label>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <input
                  id="website"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.website
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: https://techcorp.com"
                />
              )}
            />
            {errors.website && (
              <small className="text-danger">
                {errors.website.message}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="contact_person"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Personne de contact *
            </label>
            <Controller
              name="contact_person"
              control={control}
              render={({ field }) => (
                <input
                  id="contact_person"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.contact_person
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: John Manager"
                />
              )}
            />
            {errors.contact_person && (
              <small className="text-danger">
                {errors.contact_person.message}
              </small>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Notes
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  id="notes"
                  {...field}
                  rows={4}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.notes
                      ? "border-danger"
                      : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: Notes importantes sur l'entreprise..."
                />
              )}
            />
            {errors.notes && (
              <small className="text-danger">
                {errors.notes.message}
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
            typeAttr="submit"
            disabled={isSubmitting}
            className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
          />
        </div>
      </form>
    </div>
  );
}