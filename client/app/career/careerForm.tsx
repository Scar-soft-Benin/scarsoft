import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import AppBaseButton from "~/components/appBaseButton";
import Dialog from "~/dashboard/components/Dialog";
import type { CreateJobApplicationPayload } from "~/services/types/jobApply.types";
import { createJobApplication } from "~/store/sagas/jobApplySaga";
import { useTranslation } from "react-i18next";

interface CareerFormProps {
    visible: boolean;
    onClose: () => void;
    jobId: number;
}

interface FormDataFields {
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string;
    cvFile: FileList | null;
    cover_letter_content: string;
    cover_letter_file: FileList | null;
}

export default function CareerForm({
    visible,
    onClose,
    jobId
}: CareerFormProps) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormDataFields>({
        defaultValues: {
            applicant_name: "",
            applicant_email: "",
            applicant_phone: "",
            cvFile: null,
            cover_letter_content: "",
            cover_letter_file: null
        }
    });

    // CareerForm.tsx
    const submitForm = (data: FormDataFields) => {
        if (!data.cvFile || data.cvFile.length === 0) {
            dispatch({
                type: "ADD_MESSAGE",
                payload: { type: "error", text: t("careerForm.cvRequired") }
            });
            return;
        }

        // Log file details for debugging
        console.log("CareerForm: CV File =", {
            name: data.cvFile[0].name,
            type: data.cvFile[0].type,
            size: data.cvFile[0].size
        });

        const payload: CreateJobApplicationPayload = {
            jobOfferId: jobId,
            applicant_name: data.applicant_name,
            applicant_email: data.applicant_email,
            applicant_phone: data.applicant_phone,
            cv: data.cvFile[0],
            cover_letter_type:
                data.cover_letter_file && data.cover_letter_file.length > 0
                    ? "file"
                    : "text",
            cover_letter_content: data.cover_letter_content || undefined,
            cover_letter_file:
                data.cover_letter_file && data.cover_letter_file.length > 0
                    ? data.cover_letter_file[0]
                    : undefined
        };

        dispatch(createJobApplication(payload));
        reset();
        onClose();
    };

    return (
        <Dialog
            visible={visible}
            onHide={onClose}
            header={t("careerForm.applyNow")}
            style={{
                maxWidth: "900px",
                borderRadius: "1rem",
                backgroundColor: "white"
            }}
            footer={
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        {t("careerForm.requiredFields")}
                    </p>
                    <div className="flex gap-2">
                        <AppBaseButton
                            text={t("careerForm.cancel")}
                            type="second"
                            bgColor="bg-transparent"
                            textColor="text-green-500"
                            onClick={onClose}
                        />
                        <AppBaseButton
                            text={t("careerForm.submit")}
                            type="first"
                            bgColor="bg-green-500"
                            textColor="text-white"
                            onClick={handleSubmit(submitForm)}
                        />
                    </div>
                </div>
            }
        >
            <div className="grid md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("careerForm.fullname")} *
                        </label>
                        <Controller
                            name="applicant_name"
                            control={control}
                            rules={{
                                required: t("careerForm.fullnameRequired")
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Andrer White"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                        {errors.applicant_name && (
                            <span className="text-red-500 text-sm">
                                {errors.applicant_name.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("careerForm.email")} *
                        </label>
                        <Controller
                            name="applicant_email"
                            control={control}
                            rules={{
                                required: t("careerForm.emailRequired"),
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: t("careerForm.emailInvalid")
                                }
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="andrer@exemple.com"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                        {errors.applicant_email && (
                            <span className="text-red-500 text-sm">
                                {errors.applicant_email.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("careerForm.phone")} *
                        </label>
                        <Controller
                            name="applicant_phone"
                            control={control}
                            rules={{
                                required: t("careerForm.phoneRequired"),
                                pattern: {
                                    value: /^\+?[1-9]\d{1,14}$/,
                                    message: t("careerForm.phoneInvalid")
                                }
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="tel"
                                    placeholder="+229xxxxxxxxxx"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                        {errors.applicant_phone && (
                            <span className="text-red-500 text-sm">
                                {errors.applicant_phone.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="cvFile"
                            className="block text-sm font-medium text-gray-700"
                        >
                            {t("careerForm.cv")} (PDF, DOC, DOCX) *
                        </label>
                        <Controller
                            name="cvFile"
                            control={control}
                            rules={{
                                required: t("careerForm.cvRequired"),
                                validate: (files: FileList | null) =>
                                    files &&
                                    files.length > 0 &&
                                    [
                                        "application/pdf",
                                        "application/msword",
                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    ].includes(files[0].type) &&
                                    files[0].size <= 5 * 1024 * 1024
                                        ? true
                                        : t("careerForm.cvInvalid")
                            }}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                        field.onChange(e.target.files)
                                    }
                                    className="mt-1 block w-full p-2 text-lg text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                        {errors.cvFile && (
                            <span className="text-red-500 text-sm">
                                {errors.cvFile.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("careerForm.motivationLetter")} (
                            {t("careerForm.optional")})
                        </label>
                        <Controller
                            name="cover_letter_content"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    rows={4}
                                    placeholder={t(
                                        "careerForm.motivationLetterPlaceholder"
                                    )}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="cover_letter_file"
                            className="block text-sm font-medium text-gray-700"
                        >
                            {t("careerForm.motivationFile")} (PDF, DOC, DOCX,
                            TXT)
                        </label>
                        <Controller
                            name="cover_letter_file"
                            control={control}
                            rules={{
                                validate: (files: FileList | null) =>
                                    !files ||
                                    files.length === 0 ||
                                    ([
                                        "application/pdf",
                                        "application/msword",
                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                        "text/plain"
                                    ].includes(files[0].type) &&
                                        files[0].size <= 5 * 1024 * 1024)
                                        ? true
                                        : t("careerForm.motivationFileInvalid")
                            }}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={(e) =>
                                        field.onChange(e.target.files)
                                    }
                                    className="mt-1 block w-full p-2 text-lg text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            )}
                        />
                        {errors.cover_letter_file && (
                            <span className="text-red-500 text-sm">
                                {errors.cover_letter_file.message}
                            </span>
                        )}
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
