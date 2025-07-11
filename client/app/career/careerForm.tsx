import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import AppBaseButton from "~/components/appBaseButton";
import Dialog from "~/dashboard/components/Dialog";
import type { CreateJobApplicationPayload } from "~/services/types/jobApply.types";
import { createJobApplication } from "~/store/sagas/jobApplySaga";
// import { createJobApplicationRequest } from "../store/jobApply/jobApplyActions";
// import type { CreateJobApplicationPayload } from "../types/jobApply.types"; // adapte selon ton projet

interface CareerFormProps {
  visible: boolean;
  onClose: () => void;
  jobId: number;
}

interface FormDataFields {
  fullname: string;
  email: string;
  phone: string;
  cvFile: String;
  motivationLetter: string;
  motivationFile: string;
}

export default function CareerForm({ visible, onClose, jobId }: CareerFormProps) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataFields>({
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      cvFile: undefined,
      motivationLetter: "",
      motivationFile: undefined,
    },
  });

  const submitForm = (data: FormDataFields) => {
    if (!data.cvFile || data.cvFile.length === 0) {
      alert("Le CV est requis.");
      return;
    }

    const payload: CreateJobApplicationPayload = {
      jobOfferId: jobId,
      applicant_name: data.fullname,
      applicant_email: data.email,
      applicant_phone: data.phone,
      cv: data.cvFile[0],
      cover_letter_type: data.motivationFile?.length > 0 ? "file" : "text",
      cover_letter_content: data.motivationLetter || undefined,
      cover_letter_file: data.motivationFile?.[0],
    };

    // dispatch(createJobApplication(payload));
    reset();
    onClose();
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header="Postuler maintenant"
      style={{ maxWidth: "900px", borderRadius: "1rem", backgroundColor: "white" }}
      footer={
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">Tous les champs marqués * sont obligatoires</p>
          <div className="flex gap-2">
            <AppBaseButton text="Annuler" type="second" bgColor="bg-transparent" textColor="text-green-500" onClick={onClose} />
            <AppBaseButton text="Envoyer" type="first" bgColor="bg-green-500" textColor="text-white" onClick={handleSubmit(submitForm)} />
          </div>
        </div>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet *</label>
            <Controller
              name="fullname"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Andrer White"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
            {errors.fullname && <span className="text-red-500 text-sm">Ce champ est requis</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="andrer@exemple.com"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
            {errors.email && <span className="text-red-500 text-sm">Ce champ est requis</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  placeholder="+229xxxxxxxxxx"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
            {errors.phone && <span className="text-red-500 text-sm">Ce champ est requis</span>}
          </div>

          <div>
            <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700">CV (PDF) *</label>
            <Controller
              name="cvFile"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="mt-1 block w-full p-2 text-lg text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
            {errors.cvFile && <span className="text-red-500 text-sm">Le CV est requis</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lettre de motivation (facultatif)</label>
            <Controller
              name="motivationLetter"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  placeholder="Taper votre lettre de motivation..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="motivationFile" className="block text-sm font-medium text-gray-700">Lettre de motivation (fichier PDF)</label>
            <Controller
              name="motivationFile"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="mt-1 block w-full p-2 text-lg text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="/images/job-apply.svg"
            alt="Illustration candidature"
            className="w-full h-auto rounded-xl shadow"
          />
        </div>
      </div>
    </Dialog>
  );
}
