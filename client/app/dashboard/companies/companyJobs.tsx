`use client`;

// ~/dashboard/compo/Jobs.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useMessage } from "~/context/messageContext";
import { useLoading } from "~/context/loadingContext";
import { jobService, type ExtendedJobOffer } from "~/services/jobService";
import { FiEye, FiEdit, FiArchive, FiRefreshCw, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import AppButton from "../components/appButton";
import type { Column } from "../components/Table";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import JobForm from "~/dashboard/job-management/jobForm";
import AppBaseButton from "~/components/appBaseButton";
import { FaArrowLeft } from "react-icons/fa";

export default function OffresEntreprise() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [offers, setOffers] = useState<ExtendedJobOffer[]>([]);
    const [companyName, setCompanyName] = useState("Entreprise inconnue");
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<ExtendedJobOffer | null>(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<ExtendedJobOffer | null>(null);
    const { showLoading, hideLoading } = useLoading();
    const { addMessage } = useMessage();

    useEffect(() => {
        if (!id) return;
        setCompanyName(id === "1" ? "Scar-Soft" : "Entreprise");
        loadOffers();
    }, [id]);

    const loadOffers = async () => {
        try {
            showLoading();
            const allJobs = await jobService.getAllJobs();
            const filtered = allJobs.filter((job) => job.companyId === id);
            setOffers(filtered);
        } catch {
            addMessage("Impossible de charger les offres", "error");
        } finally {
            hideLoading();
        }
    };

    const handleAction = async (
        action: "archive" | "reactivate" | "delete",
        job: ExtendedJobOffer
    ) => {
        try {
            showLoading();
            switch (action) {
                case "archive":
                    await jobService.archiveJob(job.id);
                    break;
                case "reactivate":
                    await jobService.reactivateJob(job.id);
                    break;
                case "delete":
                    await jobService.deleteJob(job.id);
                    setOffers((prev) => prev.filter((j) => j.id !== job.id));
                    setDeleteDialog(false);
                    setJobToDelete(null);
                    break;
            }
            await loadOffers();
            addMessage("Action effectuée avec succès", "success");
        } catch {
            addMessage("Erreur lors de l'action", "error");
        } finally {
            hideLoading();
        }
    };

    const columns: Column<ExtendedJobOffer>[] = [
        { header: "Titre", field: "title" },
        { header: "Lieu", field: "location" },
        { header: "Type", field: "type" },
        { header: "Statut", field: "status" },
        {
            header: "Actions",
            field: "actions",
            render: (row) => (
                <div className="flex gap-2 justify-center">
                    <AppButton
                        icon={<FiEye />}
                        type="info"
                        size="sm"
                        outlined
                        tooltip="Voir"
                        onClick={() => navigate(`/carriere-candidature/${row.id}`)}
                    />
                    <AppButton
                        icon={<FiEdit />}
                        type="primary"
                        size="sm"
                        outlined
                        tooltip="Modifier"
                        onClick={() => {
                            setEditingJob(row);
                            setShowForm(true);
                        }}
                    />
                    {row.status === "active" ? (
                        <AppButton
                            icon={<FiArchive />}
                            type="warning"
                            size="sm"
                            outlined
                            tooltip="Archiver"
                            onClick={() => handleAction("archive", row)}
                        />
                    ) : row.status === "archived" ? (
                        <AppButton
                            icon={<FiRefreshCw />}
                            type="primary"
                            size="sm"
                            outlined
                            tooltip="Réactiver"
                            onClick={() => handleAction("reactivate", row)}
                        />
                    ) : null}
                    <AppButton
                        icon={<FiTrash2 />}
                        type="danger"
                        size="sm"
                        outlined
                        tooltip="Supprimer"
                        onClick={() => {
                            setJobToDelete(row);
                            setDeleteDialog(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="job-management">
            <div className="mb-4 flex justify-between items-center">
                
                <AppBaseButton
                    text="Retour aux entreprises"
                    icon={<FaArrowLeft />}
                    onClick={() => navigate("/dashboard/company")}
                    type="second"
                    bgColor="bg-transparent"
                    textColor="text-green-600"
                />
            </div>


            <Table
                data={offers}
                columns={columns}
                title={`Offres d'emploi de ${companyName}`}
                detailPath="/carriere-candidature"
            />

            <Dialog
                visible={showForm}
                header={editingJob ? "Modifier l'offre" : "Nouvelle offre"}
                onHide={() => {
                    setShowForm(false);
                    setEditingJob(null);
                }}
                style={{ width: "80vw", maxWidth: "800px" }}
            >
                <JobForm
                    job={editingJob}
                    onSave={async () => {
                        setShowForm(false);
                        setEditingJob(null);
                        await loadOffers();
                        addMessage("Offre enregistrée", "success");
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingJob(null);
                    }}
                />
            </Dialog>

            <Dialog
                visible={deleteDialog}
                header="Confirmer la suppression"
                onHide={() => setDeleteDialog(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Annuler"
                            type="secondary"
                            size="sm"
                            outlined
                            onClick={() => setDeleteDialog(false)}
                        />
                        <AppButton
                            label="Supprimer"
                            type="danger"
                            size="sm"
                            onClick={() => jobToDelete && handleAction("delete", jobToDelete)}
                        />
                    </div>
                }
            >
                <div className="flex items-center p-4">
                    <FiAlertTriangle className="text-danger text-2xl mr-3" />
                    {jobToDelete && (
                        <span>
                            Êtes-vous sûr de vouloir supprimer l'offre <b>{jobToDelete.title}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
