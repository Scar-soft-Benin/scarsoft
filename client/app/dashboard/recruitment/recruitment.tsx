// pages/Recruitment.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table, { type Column } from "../components/Table";
import { FiTrash2, FiDownload, FiMail } from "react-icons/fi";
import AppButton from "../components/appButton";
import AppToolbar from "../components/appToolBar";
import Dialog from "../components/Dialog";
import type { JobApplication } from "~/services/types/jobApply.types";
import { useMessage } from "~/context/messageContext";
import {
    deleteJobApplication,
    getAllJobApplications,
} from "~/store/sagas/jobApplySaga";
import { getAllJobsForAdmin } from "~/store/sagas/jobSaga";
import type { RootState } from "~/store";
import { apiClient, STORAGE_BASE_URL } from "~/services/config/apiConfig";
import type { AxiosResponse } from "axios";
import { clearNotificationError, sendToCandidate, sendToCompany } from "~/store/sagas/notificationSaga";
import { Controller, useForm } from "react-hook-form";

const getFileExtension = (contentType: string | null): string => {
    switch (contentType) {
        case "application/pdf":
            return ".pdf";
        case "application/msword":
            return ".doc";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return ".docx";
        default:
            return ".bin"; // Fallback for unknown types
    }
};

type Recruitment = JobApplication;

interface FormData {
    recipientEmail: string;
    message: string;
}

export default function Recruitment() {
    const [mailType, setMailType] = useState<"candidat" | "entreprise" | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Recruitment | null>(null);
    const [showMailForm, setShowMailForm] = useState(false);
    const [message, setMessage] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<Recruitment | null>(null);
    const [showTypeDialog, setShowTypeDialog] = useState(false);

    const dispatch = useDispatch();
    const { addMessage } = useMessage();
    const jobApplys = useSelector((state: RootState) => state.jobApply.jobApplications);
    const jobs = useSelector((state: RootState) => state.job.jobs);
    const error = useSelector((state: RootState) => state.jobApply.error);
    const notificationError = useSelector((state: RootState) => state.notification.error);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            recipientEmail: "",
            message: "",
        },
    });

    useEffect(() => {
        dispatch(getAllJobApplications());
        dispatch(getAllJobsForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            addMessage(error.message, "error");
        }
        if (notificationError) {
            addMessage(notificationError.message, "error");
            dispatch(clearNotificationError());
        }
    }, [error, notificationError, addMessage, dispatch]);


    // Télécharge le CV ou un autre fichier associé à une candidature
    const handleDownloadCV = async (candidateId: number, fileType: string = "cv", openInNewTab: boolean = false) => {
        try {
            // Vérifier la présence d'un token
            const token = localStorage.getItem("auth_token");
            if (!token) {
                addMessage("Aucun token d'authentification trouvé", "error");
                return;
            }

            // Faire une requête pour obtenir les informations de téléchargement (JSON attendu)
            const response: AxiosResponse<{ success: boolean; download_url?: string; file_name?: string }> =
                await apiClient(`/admin/job-applications/${candidateId}/download/${fileType}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                        Accept: "application/json", // Attendre une réponse JSON
                    },
                });

            // Vérifier si la réponse est réussie
            if (!response.data.success || !response.data.download_url) {
                throw new Error("URL de téléchargement non trouvée dans la réponse du serveur");
            }

            const fileUrl = response.data.download_url;
            let fileName = response.data.file_name || `cv_${candidateId}.pdf`;

            // Extraire l'extension depuis l'URL si fileName n'est pas fourni
            if (!response.data.file_name) {
                const urlParts = fileUrl.split(".");
                const extension = urlParts.length > 1 ? `.${urlParts.pop()}` : ".pdf";
                fileName = `cv_${candidateId}${extension}`;
            }

            // Préfixer l'URL avec la base si elle est relative
            const baseUrl = STORAGE_BASE_URL; // Remplacez par votre URL de base si différente
            const absoluteFileUrl = fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl}`;

            console.log("Téléchargement du fichier depuis l'URL:", absoluteFileUrl);


            if (openInNewTab) {
                // Ouvrir dans un nouvel onglet pour visualisation
                window.open(absoluteFileUrl, "_blank");
                addMessage("Fichier ouvert dans un nouvel onglet", "success");
            } else {
                const link = document.createElement("a");
                link.href = absoluteFileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // window.URL.revokeObjectURL(url);

                addMessage("Fichier téléchargé avec succès", "success");
            }
        } catch (err) {
            // Si la réponse est un Blob JSON, tenter de le parser pour extraire l'erreur
            if (err instanceof Error && err.message.includes("Réponse inattendue")) {
                try {
                    const errorBlob = (err as any).response?.data;
                    if (errorBlob instanceof Blob) {
                        const errorText = await errorBlob.text();
                        const errorJson = JSON.parse(errorText);
                        addMessage(
                            `Erreur lors du téléchargement du fichier: ${errorJson.message || errorText}`,
                            "error"
                        );
                        return;
                    }
                } catch (parseError) {
                    // Ignorez les erreurs de parsing, utilisez le message par défaut
                }
            }
            const errorMessage = err instanceof Error ? err.message : String(err);
            addMessage(`Erreur lors du téléchargement du fichier: ${errorMessage}`, "error");
        }
    };

    // Ouvre le dialogue pour choisir le type de destinataire (candidat ou entreprise)
    const handleSendEmail = (rowData: JobApplication) => {
        setSelectedCandidate(rowData);
        setShowTypeDialog(true);
    };

    // Confirme le type de destinataire et ouvre le formulaire d'envoi d'email
    const confirmMailType = (type: "candidat" | "entreprise") => {
        if (!selectedCandidate) return;
        setMailType(type);

        let email = "";
        if (type === "candidat") {
            email = selectedCandidate.applicant_email;
        } else if (type === "entreprise") {
            const job = jobs.find((j) => j.id === Number(selectedCandidate.job_offer_id));
            email = job?.company_contact_email || "";
        }
        reset({ recipientEmail: email, message: "" }); // Réinitialise avec l'email approprié
        setShowTypeDialog(false);
        setShowMailForm(true);
    };

    // Envoie l'email au destinataire
    const sendEmail = async () => {
        if (!recipientEmail || !message || !selectedCandidate) {
            addMessage("Tous les champs sont requis", "error");
            return;
        }

        const jobOfferId = Number(selectedCandidate.job_offer_id); // Conversion de string à number
        if (isNaN(jobOfferId)) {
            addMessage("ID de l'offre d'emploi invalide", "error");
            return;
        }

        const payload = {
            candidate_email: recipientEmail,
            message,
            job_offer_id: jobOfferId,
        };

        if (mailType === "candidat") {
            dispatch(sendToCandidate(payload));
        } else if (mailType === "entreprise") {
            dispatch(sendToCompany({
                company_email: recipientEmail,
                message,
                candidate_id: selectedCandidate.id,
                job_offer_id: jobOfferId,
            }));
        }

        setShowMailForm(false);
        setMessage("");
        setMailType(null);
        setRecipientEmail("");
        setSelectedCandidate(null);
    };

    // Ouvre le dialogue de confirmation de suppression
    const confirmDelete = (candidate: Recruitment) => {
        setCandidateToDelete(candidate);
        setShowDeleteDialog(true);
    };

    // Supprime une candidature
    const deleteCandidate = () => {
        if (!candidateToDelete) return;
        dispatch(deleteJobApplication(candidateToDelete.id));
        setShowDeleteDialog(false);
        setCandidateToDelete(null);
        addMessage("Candidature supprimée avec succès", "success");
        dispatch(getAllJobApplications());
    };

    // Rendu personnalisé pour le statut
    const statusTemplate = (rowData: JobApplication) => {
        const getClassName = (status: string | undefined) => {
            switch (status) {
                case "pending":
                    return "bg-warning/10 text-warning border-warning";
                case "reviewed":
                    return "bg-info/10 text-info border-info";
                case "accepted":
                    return "bg-success/10 text-success border-success";
                case "rejected":
                    return "bg-danger/10 text-danger border-danger";
                default:
                    return "bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text border-neutral-light-border dark:border-neutral-dark-border";
            }
        };

        const getLabel = (status: string | undefined) => {
            switch (status) {
                case "pending":
                    return "En attente";
                case "reviewed":
                    return "Examinée";
                case "accepted":
                    return "Acceptée";
                case "rejected":
                    return "Rejetée";
                default:
                    return "Inconnu";
            }
        };

        return (
            <span
                className={`px-2 py-1 rounded-md border-l-4 ${getClassName(rowData.status)}`}
            >
                {getLabel(rowData.status)}
            </span>
        );
    };

    // Rendu personnalisé pour le poste (job_offer_id -> titre de l'offre)
    const jobTitleTemplate = (rowData: JobApplication) => {
        const job = jobs.find(
            (j) => j.id.toString() === rowData.job_offer_id || j.id === Number(rowData.job_offer_id)
        );
        return <span>{job ? job.title : rowData.job_offer_id}</span>;
    };

    // Rendu des actions (télécharger, envoyer, supprimer)
    const actionsTemplate = (rowData: Recruitment) => (
        <div className="flex gap-2 justify-center">
            <AppButton
                icon={<FiDownload />}
                type="info"
                size="sm"
                outlined
                tooltip="Ouvrir CV pour téléchargement"
                onClick={() => handleDownloadCV(rowData.id, "cv", true)} // Ouvrir dans un nouvel onglet
            />
            <AppButton
                icon={<FiMail />}
                type="primary"
                size="sm"
                outlined
                tooltip="Envoyer par mail"
                onClick={() => handleSendEmail(rowData)}
            />
            <AppButton
                icon={<FiTrash2 />}
                type="danger"
                size="sm"
                outlined
                tooltip="Supprimer"
                onClick={() => confirmDelete(rowData)}
            />
        </div>
    );

    const columns: Column<Recruitment>[] = [
        {
            header: "Nom",
            field: "applicant_name",
            filterable: true,
            sortable: true,
        },
        {
            header: "Email",
            field: "applicant_email",
            filterable: true,
            sortable: true,
        },
        {
            header: "Poste",
            field: "job_offer_id",
            render: jobTitleTemplate,
            filterable: true,
            sortable: true,
        },
        {
            header: "Date",
            field: "created_at",
            filterable: true,
            sortable: true,
        },
        {
            header: "Statut",
            field: "status",
            render: statusTemplate,
            filterable: true,
            sortable: true,
        },
        { header: "Actions", field: "actions", render: actionsTemplate },
    ];

    const leftToolbarTemplate = () => null;
    const rightToolbarTemplate = () => null;

    return (
        <div className="recruitment-management">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
                    Gestion des Candidatures
                </h2>
                <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
                    Consultez et gérez les candidatures reçues pour vos offres d'emploi.
                </p>
            </div>

            <AppToolbar left={leftToolbarTemplate()} right={rightToolbarTemplate()} />

            <Table
                data={jobApplys || []}
                columns={columns}
                title="Candidatures"
                globalFilterFields={["applicant_name", "applicant_email", "job_offer_id"]}
            />

            <Dialog
                visible={showTypeDialog}
                header="Choisir le destinataire"
                onHide={() => setShowTypeDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Annuler"
                            type="secondary"
                            onClick={() => setShowTypeDialog(false)}
                        />
                        <AppButton
                            label="Entreprise"
                            type="warning"
                            onClick={() => confirmMailType("entreprise")}
                        />
                        <AppButton
                            label="Candidat"
                            type="primary"
                            onClick={() => confirmMailType("candidat")}
                        />
                    </div>
                }
            >
                <p className="text-neutral-light-text dark:text-neutral-dark-text">
                    Voulez-vous envoyer cette candidature à un candidat ou à une entreprise ?
                </p>
            </Dialog>

            <Dialog
                visible={showMailForm}
                header={`Envoyer à ${mailType === "candidat" ? "le candidat" : "une entreprise"}`}
                onHide={() => setShowMailForm(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Annuler"
                            type="secondary"
                            onClick={() => setShowMailForm(false)}
                        />
                        <AppButton
                            label="Envoyer"
                            type="primary"
                            onClick={handleSubmit(sendEmail)}
                        />
                    </div>
                }
            >
                <Controller
                    name="recipientEmail"
                    control={control}
                    rules={{ required: "L'adresse e-mail est requise" }}
                    render={({ field }) => (
                        <input
                            id="recipientEmail"
                            {...field}
                            type="email"
                            className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                                errors.recipientEmail
                                    ? "border-danger"
                                    : "border-neutral-light-border dark:border-neutral-dark-border"
                            } focus:ring-primary focus:border-primary`}
                            placeholder="Adresse e-mail"
                        />
                    )}
                />
                {errors.recipientEmail && (
                    <small className="text-danger">{errors.recipientEmail.message}</small>
                )}

                <Controller
                    name="message"
                    control={control}
                    rules={{ required: "Le message est requis" }}
                    render={({ field }) => (
                        <textarea
                            id="message"
                            {...field}
                            rows={6}
                            className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                                errors.message
                                    ? "border-danger"
                                    : "border-neutral-light-border dark:border-neutral-dark-border"
                            } focus:ring-primary focus:border-primary`}
                            placeholder="Écrivez votre message ici..."
                        />
                    )}
                />
                {errors.message && (
                    <small className="text-danger">{errors.message.message}</small>
                )}
            </Dialog>

            <Dialog
                visible={showDeleteDialog}
                header="Confirmation de suppression"
                onHide={() => setShowDeleteDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Annuler"
                            type="secondary"
                            onClick={() => setShowDeleteDialog(false)}
                        />
                        <AppButton
                            label="Supprimer"
                            type="danger"
                            onClick={deleteCandidate}
                        />
                    </div>
                }
            >
                <p className="text-neutral-light-text dark:text-neutral-dark-text">
                    Êtes-vous sûr de vouloir supprimer la candidature de{" "}
                    <strong>{candidateToDelete?.applicant_name}</strong> ?
                </p>
            </Dialog>
        </div>
    );
}