// ~/dashboard/job-management/Jobs.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMessage } from "~/context/messageContext";
import type { Job } from "~/services/types/job.types";
import { FiEye } from "react-icons/fi";
import AppButton from "../components/appButton";
import type { Column } from "../components/Table";
import AppToolbar from "../components/appToolBar";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import type { RootState } from "~/store";
import JobForm from "./jobForm";
import { getAllJobs } from "~/store/sagas/jobSaga";

const Jobs = () => {
    const [showForm, setShowForm] = useState(false);
    const { addMessage } = useMessage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jobs = useSelector((state: RootState) => state.job.jobs);

    useEffect(() => {
        dispatch(getAllJobs());
    }, [dispatch]);

    const onJobSaved = () => {
        setShowForm(false);
        addMessage("Offre créée avec succès", "success");
        dispatch(getAllJobs());
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
            </div>
        );
    };

    const columns: Column<Job>[] = [
        {
            header: "Titre du poste",
            field: "title",
            filterable: true,
            sortable: true
        },
        {
            header: "Type",
            field: "type",
            render: typeTemplate,
            filterable: true,
            sortable: true
        },
        { header: "Lieu", field: "location", filterable: true, sortable: true },
        {
            header: "Salaire",
            field: "salary",
            filterable: true,
            sortable: true
        },
        { header: "Actions", field: "actions", render: actionsTemplate }
    ];

    const leftToolbarTemplate = () => (
        <AppButton
            label="Nouvelle offre"
            icon={<FiEye className="mr-2" />}
            type="primary"
            onClick={() => setShowForm(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white"
        />
    );

    const rightToolbarTemplate = () => null; // Table component handles global filtering

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
                detailPath="/carriere-candidature"
                globalFilterFields={["title", "type", "location", "salary"]}
            />

            <Dialog
                visible={showForm}
                header="Nouvelle offre"
                onHide={() => setShowForm(false)}
                style={{ width: "80vw", maxWidth: "800px" }}
            >
                <JobForm
                    onSave={onJobSaved}
                    onCancel={() => setShowForm(false)}
                />
            </Dialog>
        </div>
    );
};

export default Jobs;
