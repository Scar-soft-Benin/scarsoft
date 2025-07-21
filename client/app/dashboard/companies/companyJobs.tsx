import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "~/context/messageContext";
import { useLoading } from "~/context/loadingContext";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiArchive, FiRefreshCw, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import AppButton from "../components/appButton";
import type { Column } from "../components/Table";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import JobForm from "~/dashboard/job-management/jobForm";
import AppBaseButton from "~/components/appBaseButton";
import { FaArrowLeft } from "react-icons/fa";
import { getCompanyDetails, getCompanyJobs } from "~/store/sagas/companySaga";
import type { RootState } from "~/store";
import type { Job } from "~/services/types/job.types";
import { jobService } from "~/services/api/jobService";


export default function OffresEntreprise() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { showLoading, hideLoading } = useLoading();
    const { addMessage } = useMessage();

    // Récupérer les emplois et les détails de l'entreprise depuis le store Redux
    const companyJobs = useSelector((state: RootState) => state.company.companyJobs[id || ""] || []);
    const companyDetails = useSelector((state: RootState) => state.company.companies.find((c) => c.id.toString() === id));
    const [companyName, setCompanyName] = useState("Entreprise inconnue");
    const [offers, setOffers] = useState<Job[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

    useEffect(() => {
        if (!id) {
            addMessage("ID de l'entreprise manquant", "error");
            return;
        }
        // Dispatch des actions pour récupérer les emplois et les détails de l'entreprise
        dispatch(getCompanyJobs(id));
        dispatch(getCompanyDetails(id));
    }, [id, dispatch, addMessage]);

    // useEffect(() => {
    //     // Mettre à jour les offres avec les données du store
    //     setOffers(companyJobs);
    // }, [companyJobs]);

    useEffect(() => {
        // Mettre à jour le nom de l'entreprise avec les données réelles
        if (companyDetails) {
            setCompanyName(companyDetails.name);
        }
    }, [companyDetails]);

    const handleAction = async (
        action: "archive" | "reactivate" | "delete",
        job: Job
    ) => {
        try {
            showLoading();
            switch (action) {
                case "archive":
                    //   await jobService.archiveJob(job.id);
                    break;
                case "reactivate":
                    //   await jobService.reactivateJob(job.id);
                    break;
                case "delete":
                    await jobService.deleteJob(job.id);
                    setOffers((prev) => prev.filter((j) => j.id !== job.id));
                    setDeleteDialog(false);
                    setJobToDelete(null);
                    break;
            }
            // Recharger les emplois après une action
            dispatch(getCompanyJobs(id!));
            addMessage("Action effectuée avec succès", "success");
        } catch {
            addMessage("Erreur lors de l'action", "error");
        } finally {
            hideLoading();
        }
    };

    const columns: Column<Job>[] = [
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
                        onClick={() => navigate(`/carriere/candidature/${row.id}`)}
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
        <motion.div
            className="job-management p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="mb-4 flex justify-between items-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AppBaseButton
                    text="Retour aux entreprises"
                    icon={<FaArrowLeft />}
                    onClick={() => navigate("/dashboard/companies")}
                    type="second"
                    bgColor="bg-transparent"
                    textColor="text-green-600"
                />
                <AppBaseButton
                    text="Nouvelle offre"
                    icon={<FiEdit />}
                    onClick={() => setShowForm(true)}
                    type="first"
                    bgColor="bg-blue-600"
                    textColor="text-white"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Table
                    data={companyJobs}
                    columns={columns}
                    title={`Offres d'emploi de ${companyName}`}
                    // detailPath="/carriere/candidature"
                />
            </motion.div>

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
                    onSave={async () => {
                        setShowForm(false);
                        setEditingJob(null);
                        dispatch(getCompanyJobs(id!));
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
        </motion.div>
    );
}