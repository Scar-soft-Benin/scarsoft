// ~/routes/company/auth/CompanyVerify.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router";
import { useMessage } from "~/context/messageContext";
// import AppButton from "../../components/appButton";
import { apiClient } from "~/services/config/apiConfig";
import AppBaseButton from "~/components/appBaseButton";
import AppButton from "~/dashboard/components/appButton";

const verifySchema = z.object({
  otp: z.string().min(6, "L'OTP doit contenir 6 caractères"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function CompanyVerify() {
  const navigate = useNavigate();
  const { addMessage } = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";

  const { control, handleSubmit, formState: { errors } } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: VerifyFormData) => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/company/verify-otp", { email, otp: data.otp });
      addMessage("Connexion réussie", "success");
      navigate("/company/dashboard");
    } catch (error) {
      addMessage("Erreur lors de la vérification de l'OTP", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    try {
      await apiClient.post("/company/resend-otp", { email });
      addMessage("OTP renvoyé avec succès", "success");
    } catch (error) {
      addMessage("Erreur lors du renvoi de l'OTP", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light-bg dark:bg-neutral-dark-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 bg-white dark:bg-neutral-dark-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
          Vérification OTP
        </h2>
        <p className="mb-4 text-neutral-light-secondary dark:text-neutral-dark-secondary">
          Un OTP a été envoyé à {email}.
        </p>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text"
          >
            OTP
          </label>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <input
                id="otp"
                {...field}
                className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                  errors.otp ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                } focus:ring-primary focus:border-primary`}
                placeholder="Entrez l'OTP"
              />
            )}
          />
          {errors.otp && <small className="text-danger">{errors.otp.message}</small>}
        </div>
        <div className="flex justify-between items-center">
          <AppButton
            label="Vérifier"
            type="primary"
            size="md"
            typeAttr="submit"
            disabled={isSubmitting}
            className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
          />
          <button
            type="button"
            onClick={resendOTP}
            className="text-sm text-primary hover:underline"
          >
            Renvoyer OTP
          </button>
        </div>
      </form>
    </div>
  );
}