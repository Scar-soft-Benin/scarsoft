import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMessage } from "~/context/messageContext";
// import AppButton from "~/components/appButton";
import { apiClient } from "~/services/config/apiConfig";
import AppButton from "~/dashboard/components/appButton";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function CompanyLogin() {
  const navigate = useNavigate();
  const { addMessage } = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/company/check-email", { email: data.email });
      if (response.data.exists) {
        navigate(`/company/auth/verify?email=${encodeURIComponent(data.email)}`);
      } else {
        navigate(`/company/auth/register?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      addMessage("Erreur lors de la vérification de l'email", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light-bg dark:bg-neutral-dark-bg">
      <div className="w-full max-w-md p-6 bg-white dark:bg-neutral-dark-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
          Connexion Entreprise
        </h2>
        <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary mb-4">
          Entrez votre adresse email pour commencer.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
            >
              Adresse Email *
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  id="email"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.email ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: contact@entreprise.com"
                />
              )}
            />
            {errors.email && <small className="text-danger">{errors.email.message}</small>}
          </div>
          <AppButton
            label="Vérifier"
            type="primary"
            size="md"
            typeAttr="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
          />
          <p className="text-center text-sm text-neutral-light-text dark:text-neutral-dark-text">
            Pas d'entreprise ?{" "}
            <a href="/company/auth/register" className="text-primary hover:underline">
              Créez-en une
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}