// pages/Recruitment.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table, { type Column } from "../components/Table";
import { FiTrash2, FiDownload, FiMail } from "react-icons/fi";
import AppButton from "../components/appButton";
import AppToolbar from "../components/appToolBar";
import Dialog from "../components/Dialog";
import type { JobApplication } from "~/services/types/jobApply.types";
import type { Job } from "~/services/types/job.types";
import { useMessage } from "~/context/messageContext";
import {
  deleteJobApplication,
  getAllJobApplications,
} from "~/store/sagas/jobApplySaga";
import { getAllJobsForAdmin } from "~/store/sagas/jobSaga";
import type { RootState } from "~/store";

type Recruitment = JobApplication;

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
  const jobApplyLoading = useSelector((state: RootState) => state.jobApply.loading);
  const jobsLoading = useSelector((state: RootState) => state.job.loading);
  const jobs = useSelector((state: RootState) => state.job.jobs);
  const error = useSelector((state: RootState) => state.jobApply.error);

  useEffect(() => {
    dispatch(getAllJobApplications());
    dispatch(getAllJobsForAdmin());
    // console.log("Recruitment: Fetching job applications...");
    // console.log("Recruitment: jobApplys =", jobApplys);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addMessage(error.message, "error");
    }
  }, [error, addMessage]);

  const handleDownloadCV = async (candidateId: number, fileType: string = "cv") => {
    console.log("handleDownloadCV: candidateId =", candidateId, "fileType =", fileType);
    try {
      const response = await fetch(`/api/admin/job-applications/${candidateId}/download/${fileType}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(`Échec du téléchargement du CV: ${response.statusText}`);

      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = `cv_${candidateId}.pdf`; // Nom par défaut
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addMessage("CV téléchargé avec succès", "success");
    } catch (err) {
      console.error("handleDownloadCV: Error =", err);
      addMessage("Erreur lors du téléchargement du CV.", "error");
    }
  };

  const handleSendEmail = (rowData: JobApplication) => {
    setSelectedCandidate(rowData);
    setShowTypeDialog(true);
  };

  const confirmMailType = (type: "candidat" | "entreprise") => {
    if (!selectedCandidate) return;
    setMailType(type);
    setRecipientEmail(type === "candidat" ? selectedCandidate.applicant_email : "");
    setShowTypeDialog(false);
    setShowMailForm(true);
  };

  const sendEmail = async () => {
    if (!recipientEmail || !message || !selectedCandidate) {
      addMessage("Tous les champs sont requis", "error");
      return;
    }

    const payload = {
      candidateId: selectedCandidate.id,
      to: recipientEmail,
      message,
      type: mailType,
    };

    try {
      const response = await fetch("/api/send-candidate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de l'envoi");

      addMessage("Email envoyé avec succès !", "success");
      setShowMailForm(false);
      setMessage("");
      setMailType(null);
      setRecipientEmail("");
      setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
      addMessage("Erreur lors de l'envoi du mail.", "error");
    }
  };

  const confirmDelete = (candidate: Recruitment) => {
    setCandidateToDelete(candidate);
    setShowDeleteDialog(true);
  };

  const deleteCandidate = () => {
    if (!candidateToDelete) return;
    dispatch(deleteJobApplication(candidateToDelete.id));
    setShowDeleteDialog(false);
    setCandidateToDelete(null);
    addMessage("Candidature supprimée avec succès", "success");
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
      <span className={`px-2 py-1 rounded-md border-l-4 ${getClassName(rowData.status)}`}>
        {getLabel(rowData.status)}
      </span>
    );
  };

  // Rendu personnalisé pour le poste (job_offer_id -> titre de l'offre)
  const jobTitleTemplate = (rowData: JobApplication) => {
    const job = jobs.find((j) => j.id.toString() === rowData.job_offer_id || j.id === Number(rowData.job_offer_id));
    return <span>{job ? job.title : rowData.job_offer_id}</span>;
  };

  const actionsTemplate = (rowData: Recruitment) => (
    <div className="flex gap-2 justify-center">
      <AppButton
        icon={<FiDownload />}
        type="info"
        size="sm"
        outlined
        tooltip="Télécharger CV"
        onClick={() => handleDownloadCV(rowData.id, "cv")}
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
    { header: "Nom", field: "applicant_name", filterable: true, sortable: true },
    { header: "Email", field: "applicant_email", filterable: true, sortable: true },
    { header: "Poste", field: "job_offer_id", render: jobTitleTemplate, filterable: true, sortable: true },
    { header: "Date", field: "created_at", filterable: true, sortable: true },
    { header: "Statut", field: "status", render: statusTemplate, filterable: true, sortable: true },
    { header: "Actions", field: "actions", render: actionsTemplate },
  ];

  const leftToolbarTemplate = () => null; // Pas de bouton "Nouvelle candidature" nécessaire ici
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
              onClick={sendEmail}
            />
          </div>
        }
      >
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
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