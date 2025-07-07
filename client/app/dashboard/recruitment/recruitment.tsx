// pages/Recruitment.tsx
import { useState } from "react";
import Table, { type Column } from "../components/Table";
import { FiTrash2, FiDownload, FiMail } from "react-icons/fi";
import AppButton from "../components/appButton";
import Dialog from "../components/Dialog";

interface Recruitment {
  id: string;
  name: string;
  email: string;
  position: string;
  resume: string;
  date: string;
}

const mockRecruitments: Recruitment[] = [
  {
    id: "1",
    name: "Alice Brown",
    email: "alice@example.com",
    position: "Frontend Developer",
    resume: "alice_cv.pdf",
    date: "2025-06-01",
  },
  {
    id: "2",
    name: "Bob White",
    email: "bob@example.com",
    position: "Backend Developer",
    resume: "bob_cv.pdf",
    date: "2025-06-02",
  },
  {
    id: "3",
    name: "John White",
    email: "white@example.com",
    position: "Backend Developer",
    resume: "john_cv.pdf",
    date: "2025-06-02",
  },
];

export default function Recruitment() {
  const [mailType, setMailType] = useState<"candidat" | "entreprise" | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Recruitment | null>(null);
  const [showMailForm, setShowMailForm] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Recruitment | null>(null);
  const [showTypeDialog, setShowTypeDialog] = useState(false);

  const handleDownloadCV = (resumeFileName: string) => {
    const url = `/uploads/cvs/${resumeFileName}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = (rowData: Recruitment) => {
    setSelectedCandidate(rowData);
    setShowTypeDialog(true);
  };

  const confirmMailType = (type: "candidat" | "entreprise") => {
    if (!selectedCandidate) return;
    setMailType(type);
    setRecipientEmail(type === "candidat" ? selectedCandidate.email : "");
    setShowTypeDialog(false);
    setShowMailForm(true);
  };

  const sendEmail = async () => {
    if (!recipientEmail || !message || !selectedCandidate) {
      alert("Tous les champs sont requis");
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

      alert("Email envoyé avec succès !");
      setShowMailForm(false);
      setMessage("");
      setMailType(null);
      setRecipientEmail("");
      setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du mail.");
    }
  };

  const confirmDelete = (candidate: Recruitment) => {
    setCandidateToDelete(candidate);
    setShowDeleteDialog(true);
  };

  const deleteCandidate = () => {
    if (!candidateToDelete) return;
    alert(`Suppression de ${candidateToDelete.name}`);
    setShowDeleteDialog(false);
    setCandidateToDelete(null);
  };

  const actionsTemplate = (rowData: Recruitment) => (
    <div className="flex gap-2 justify-center">
      <AppButton
        icon={<FiDownload />}
        type="info"
        size="sm"
        outlined
        tooltip="Télécharger CV"
        onClick={() => handleDownloadCV(rowData.resume)}
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
    { header: "Nom", field: "name" },
    { header: "Email", field: "email" },
    { header: "Poste", field: "position" },
    { header: "Date", field: "date" },
    { header: "Actions", field: "actions", render: actionsTemplate },
  ];

  return (
    <>
      <Table
        data={mockRecruitments}
        columns={columns}
        title="Candidatures"
      />

      <Dialog
        visible={showTypeDialog}
        header="Choisir le destinataire"
        onHide={() => setShowTypeDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton label="Annuler" type="secondary" onClick={() => setShowTypeDialog(false)} />
            <AppButton label="Entreprise" type="warning" onClick={() => confirmMailType("entreprise")} />
            <AppButton label="Candidat" type="primary" onClick={() => confirmMailType("candidat")} />
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
            <AppButton label="Annuler" type="secondary" onClick={() => setShowMailForm(false)} />
            <AppButton label="Envoyer" type="primary" onClick={sendEmail} />
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
            <AppButton label="Annuler" type="secondary" onClick={() => setShowDeleteDialog(false)} />
            <AppButton label="Supprimer" type="danger" onClick={deleteCandidate} />
          </div>
        }
      >
        <p className="text-neutral-light-text dark:text-neutral-dark-text">
          Êtes-vous sûr de vouloir supprimer la candidature de <strong>{candidateToDelete?.name}</strong> ?
        </p>
      </Dialog>
    </>
  );
}