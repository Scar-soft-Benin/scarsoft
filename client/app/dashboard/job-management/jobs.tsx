// ~/dashboard/job-management/Jobs.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMessage } from "~/context/messageContext";
import { useLoading } from "~/context/loadingContext";
import { jobService, type ExtendedJobOffer,  } from "~/services/jobService";
import { FiEye, FiEdit, FiArchive, FiRefreshCw, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import AppButton from "../components/appButton";
import type { Column } from "../components/Table";
import AppToolbar from "../components/appToolBar";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import JobForm from "./jobForm";

const Jobs = () => {
  const [jobs, setJobs] = useState<ExtendedJobOffer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<ExtendedJobOffer | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<ExtendedJobOffer | null>(null);
  const { showLoading, hideLoading } = useLoading();
  const { addMessage } = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      showLoading();
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch {
      addMessage("Impossible de charger les offres d'emploi", "error");
    } finally {
      hideLoading();
    }
  };

  const handleJobAction = async (
    action: "archive" | "reactivate" | "delete",
    job: ExtendedJobOffer
  ) => {
    try {
      showLoading();
      switch (action) {
        case "archive":
          await jobService.archiveJob(job.id);
          addMessage("Offre archivée avec succès", "success");
          break;
        case "reactivate":
          await jobService.reactivateJob(job.id);
          addMessage("Offre réactivée avec succès", "success");
          break;
        case "delete":
          await jobService.deleteJob(job.id);
          setJobs(jobs.filter((j) => j.id !== job.id));
          setDeleteDialog(false);
          setJobToDelete(null);
          addMessage("Offre supprimée avec succès", "success");
          break;
      }
      if (action !== "delete") await loadJobs();
    } catch {
      addMessage(
        `Impossible de ${action === "archive" ? "archiver" : action === "reactivate" ? "réactiver" : "supprimer"} l'offre`,
        "error"
      );
    } finally {
      hideLoading();
    }
  };

  const openNew = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const editJob = (job: ExtendedJobOffer) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const confirmDeleteJob = (job: ExtendedJobOffer) => {
    setJobToDelete(job);
    setDeleteDialog(true);
  };

  const onJobSaved = async () => {
    setShowForm(false);
    setEditingJob(null);
    await loadJobs();
    addMessage(
      editingJob ? "Offre modifiée avec succès" : "Offre créée avec succès",
      "success"
    );
  };

  const statusTemplate = (rowData: ExtendedJobOffer) => {
    const getClassName = (status: string) => {
      switch (status) {
        case "active":
          return "bg-success/10 text-success border-success";
        case "archived":
          return "bg-warning/10 text-warning border-warning";
        case "draft":
          return "bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text border-neutral-light-border dark:border-neutral-dark-border";
        default:
          return "bg-info/10 text-info border-info";
      }
    };

    const getLabel = (status: string) => {
      switch (status) {
        case "active": return "Active";
        case "archived": return "Archivée";
        case "draft": return "Brouillon";
        default: return status;
      }
    };

    return (
      <span className={`px-2 py-1 rounded-md border-l-4 ${getClassName(rowData.status)}`}>
        {getLabel(rowData.status)}
      </span>
    );
  };

  const typeTemplate = (rowData: ExtendedJobOffer) => {
    const getClassName = (type: string) => {
      switch (type) {
        case "Recrutement":
          return "bg-success/10 text-success border-success";
        case "Stage":
          return "bg-info/10 text-info border-info";
        case "Freelance":
          return "bg-warning/10 text-warning border-warning";
        default:
          return "bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text border-neutral-light-border dark:border-neutral-dark-border";
      }
    };

    return (
      <span className={`px-2 py-1 rounded-md border-l-4 ${getClassName(rowData.type)}`}>
        {rowData.type}
      </span>
    );
  };
  

  const actionsTemplate = (rowData: ExtendedJobOffer) => {
    return (
      <div className="flex gap-2 justify-center">
        <AppButton
          icon={<FiEye />}
          type="info"
          size="sm"
          outlined
          tooltip="Voir"
          onClick={() => {
            navigate(`/carriere-candidature/${rowData.id}`);
          }}
        />
        <AppButton
          icon={<FiEdit />}
          type="primary"
          size="sm"
          outlined
          tooltip="Modifier"
          onClick={() => {
            editJob(rowData);
          }}
        />
        {rowData.status === "active" ? (
          <AppButton
            icon={<FiArchive />}
            type="warning"
            size="sm"
            outlined
            tooltip="Archiver"
            onClick={() => {
              handleJobAction("archive", rowData);
            }}
          />
        ) : rowData.status === "archived" ? (
          <AppButton
            icon={<FiRefreshCw />}
            type="primary"
            size="sm"
            outlined
            tooltip="Réactiver"
            onClick={() => {
              handleJobAction("reactivate", rowData);
            }}
          />
        ) : null}
        <AppButton
          icon={<FiTrash2 />}
          type="danger"
          size="sm"
          outlined
          tooltip="Supprimer"
          onClick={() => {
            confirmDeleteJob(rowData);
          }}
        />
      </div>
    );
  };

  const columns: Column<ExtendedJobOffer>[] = [
    { header: "Titre du poste", field: "title", filterable: true, sortable: true },
    { header: "Type", field: "type", render: typeTemplate, filterable: true, sortable: true },
    { header: "Lieu", field: "location", filterable: true, sortable: true },
    { header: "Salaire", field: "salary", filterable: true, sortable: true },
    { header: "Statut", field: "status", render: statusTemplate, filterable: true, sortable: true },
    { header: "Actions", field: "actions", render: actionsTemplate },
  ];

  const leftToolbarTemplate = () => (
    <AppButton
      label="Nouvelle offre"
      icon={<FiEye className="mr-2" />}
      type="primary"
      onClick={openNew}
      className="bg-teal-500 hover:bg-teal-600 text-white"
    />
  );

  const rightToolbarTemplate = () => (
    <input
      type="search"
      placeholder="Rechercher..."
      className="p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
      onChange={() => {}}
    />
  );

  const deleteDialogFooter = (
    <div className="flex justify-end gap-2">
      <AppButton
        label="Non"
        type="secondary"
        size="sm"
        outlined
        onClick={() => setDeleteDialog(false)}
      />
      <AppButton
        label="Oui"
        type="danger"
        size="sm"
        onClick={() => jobToDelete && handleJobAction("delete", jobToDelete)}
      />
    </div>
  );

  return (
    <div className="job-management">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
          Gestion des Offres d'Emploi
        </h2>
        <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
          Gérez vos offres d'emploi : créez, modifiez, archivez ou supprimez les postes.
        </p>
      </div>

      <AppToolbar left={leftToolbarTemplate()} right={rightToolbarTemplate()} />

      <Table
        data={jobs}
        columns={columns}
        title="Offres d'Emploi"
        detailPath="/jobs"
        globalFilterFields={["title", "type", "location", "status"]}
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
          onSave={onJobSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      </Dialog>

      <Dialog
        visible={deleteDialog}
        header="Confirmer la suppression"
        footer={deleteDialogFooter}
        onHide={() => setDeleteDialog(false)}
      >
        <div className="flex items-center p-4">
          <FiAlertTriangle className="text-danger text-2xl mr-3" />
          {jobToDelete && (
            <span className="text-neutral-light-text dark:text-neutral-dark-text">
              Êtes-vous sûr de vouloir supprimer définitivement l'offre{" "}
              <b>{jobToDelete.title}</b> ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Jobs;