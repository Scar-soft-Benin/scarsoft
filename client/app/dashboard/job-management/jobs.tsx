import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMessage } from "~/context/messageContext";
import type { Job } from "~/services/types/job.types";
import { FiArchive, FiEdit, FiEye, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import AppButton from "../components/appButton";
import type { Column } from "../components/Table";
import AppToolbar from "../components/appToolBar";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import type { RootState } from "~/store";
import JobForm from "./jobForm";
import {
  getAllJobsForAdmin,
  updateJob,
  deleteJob,
} from "~/store/sagas/jobSaga";

const Jobs = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const { addMessage } = useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.job.jobs);
  const loading = useSelector((state: RootState) => state.job.loading);
  const error = useSelector((state: RootState) => state.job.error);

  useEffect(() => {
    dispatch(getAllJobsForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addMessage(error.message, "error");
    }
  }, [error, addMessage]);

  const onJobSaved = () => {
    setShowForm(false);
    setSelectedJob(null);
    addMessage("Offre créée ou mise à jour avec succès", "success");
    dispatch(getAllJobsForAdmin());
  };

  const editJob = (rowData: Job) => {
    setSelectedJob(rowData);
    setShowForm(true);
  };

  const handleJobAction = (action: "archive" | "reactivate", rowData: Job) => {
    const updatedJob: Job = {
      ...rowData,
      status: action === "archive" ? "archived" : "active",
    };
    dispatch(updateJob(updatedJob));
  };

  const confirmDeleteJob = (rowData: Job) => {
    setJobToDelete(rowData);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      dispatch(deleteJob(jobToDelete.id.toString()));
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  const typeTemplate = (rowData: Job) => {
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
      <span
        className={`px-2 py-1 rounded-md border-l-4 ${getClassName(
          rowData.type
        )}`}
      >
        {rowData.type}
      </span>
    );
  };

  const statusTemplate = (rowData: Job) => {
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
        case "active":
          return "Active";
        case "archived":
          return "Archivée";
        case "draft":
          return "Brouillon";
        default:
          return status;
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded-md border-l-4 ${getClassName(
          rowData.status
        )}`}
      >
        {getLabel(rowData.status)}
      </span>
    );
  };

  const actionsTemplate = (rowData: Job) => {
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

  const columns: Column<Job>[] = [
    {
      header: "Titre du poste",
      field: "title",
      filterable: true,
      sortable: true,
    },
    {
      header: "Type",
      field: "type",
      render: typeTemplate,
      filterable: true,
      sortable: true,
    },
    {
      header: "Lieu",
      field: "location",
      filterable: true,
      sortable: true,
    },
    {
      header: "Salaire",
      field: "salary",
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
    {
      header: "Actions",
      field: "actions",
      render: actionsTemplate,
    },
  ];

  const leftToolbarTemplate = () => (
    <AppButton
      label="Nouvelle offre"
      icon={<FiEye className="mr-2" />}
      type="primary"
      onClick={() => {
        setSelectedJob(null); // Reset for new job creation
        setShowForm(true);
      }}
      className="bg-teal-500 hover:bg-teal-600 text-white"
    />
  );

  const rightToolbarTemplate = () => null;

  return (
    <div className="job-management">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
          Gestion des Offres d'Emploi
        </h2>
        <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
          Créez et consultez vos offres d'emploi.
        </p>
      </div>

      <AppToolbar
        left={leftToolbarTemplate()}
        right={rightToolbarTemplate()}
      />

      <Table
        data={jobs}
        columns={columns}
        title="Offres d'Emploi"
        // detailPath="/carriere-candidature"
        globalFilterFields={["title", "type", "location", "salary"]}
      />

      <Dialog
        visible={showForm}
        header={selectedJob ? "Modifier l'offre" : "Nouvelle offre"}
        onHide={() => {
          setShowForm(false);
          setSelectedJob(null);
        }}
        style={{ width: "80vw", maxWidth: "800px" }}
      >
        <JobForm
          job={selectedJob}
          onSave={onJobSaved}
          onCancel={() => {
            setShowForm(false);
            setSelectedJob(null);
          }}
        />
      </Dialog>

      <Dialog
        visible={showDeleteConfirm}
        header="Confirmer la suppression"
        onHide={() => {
          setShowDeleteConfirm(false);
          setJobToDelete(null);
        }}
        style={{ width: "40vw", maxWidth: "400px" }}
      >
        <div className="p-4">
          <p>
            Êtes-vous sûr de vouloir supprimer l'offre{" "}
            <strong>{jobToDelete?.title}</strong> ?
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <AppButton
              label="Annuler"
              type="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setJobToDelete(null);
              }}
            />
            <AppButton
              label="Supprimer"
              type="danger"
              onClick={handleDeleteConfirm}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Jobs;