import { useForm, Controller } from "react-hook-form";
import AppBaseButton from "~/components/appBaseButton";
import Dialog from "~/dashboard/components/Dialog";


interface CareerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: FormDataFields) => void;
}

interface FormDataFields {
  fullname: string;
  email: string;
  phone: string;
  cvFile: FileList;
  motivationLetter: string;
  motivationFile: FileList;
}

export default function CareerForm({ visible, onClose, onSubmit }: CareerFormProps) {
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
    onSubmit?.(data);
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
            <AppBaseButton text="Annuler" type="second" textColor={""} bgColor={""} onClick={onClose} />
            <AppBaseButton text="Envoyer" type="first" textColor={""} bgColor={""} onClick={handleSubmit(submitForm)} />
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
