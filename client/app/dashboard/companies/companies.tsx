import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { Company } from "~/services/types/company.types";
import type { RootState } from "~/store";
import { FaBuilding } from "react-icons/fa";
import { useMessage } from "~/context/messageContext";
import CompanyForm from "./companyForm";
import AppButton from "../components/appButton";
import AppToolbar from "../components/appToolBar";
import Dialog from "../components/Dialog";
import Table, { type Column } from "../components/Table";
import { clearError, getAllCompanies } from "~/store/sagas/companySaga";

export default function Entreprises() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addMessage } = useMessage();
  const { companies = [], meta, error, loading } = useSelector(
    (state: RootState) => state.company || { companies: [], meta: null, error: null, loading: false }
  );
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(15);

  const params = useMemo(
    () => ({
      search: search || undefined,
      status,
      page,
      per_page: perPage,
    }),
    [search, status, page, perPage]
  );

  useEffect(() => {
    console.log("Entreprises: Dispatching getAllCompanies with params:", params);
    dispatch(getAllCompanies(params));
  }, [dispatch, params]);

  useEffect(() => {
    console.log("Entreprises: Companies updated:", companies, "Meta:", meta);
    if (error) {
      console.log("Entreprises: Error detected:", error);
      addMessage(error.message, "error");
      dispatch(clearError());
    }
  }, [error, addMessage, dispatch, companies, meta]);

  const onCompanySaved = () => {
    console.log("Entreprises: onCompanySaved called");
    setShowForm(false);
    setPage(1);
    dispatch(getAllCompanies({ ...params }));
  };

  const columns: Column<Company>[] = [
    {
      header: "Nom",
      field: "name",
      filterable: true,
      sortable: true,
      render: (company) => (
        <div className="flex items-center gap-3">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
              {company.name[0]}
            </div>
          )}
          <span className="font-medium text-gray-800">{company.name}</span>
        </div>
      ),
    },
    {
      header: "Email",
      field: "contact_email",
      filterable: true,
    },
    {
      header: "Statut",
      field: "status",
      filterable: true,
    },
    {
      header: "Offres publiées",
      field: "job_offers_count",
      sortable: true,
    },
    {
      header: "Offres actives",
      field: "active_job_offers_count",
      sortable: true,
    },
    {
      header: "Créé par",
      field: "creator_name",
      filterable: true,
    },
    {
      header: "Action",
      field: "action",
      render: (row) => (
        <AppButton
          label="Voir les offres"
          icon={<FaBuilding />}
          type="info"
          size="sm"
          outlined
          onClick={() => navigate(`/dashboard/company/${row.id}/jobs`)}
          className="text-green-600"
        />
      ),
    },
  ];

  const leftToolbarTemplate = () => (
    <div className="flex flex-col sm:flex-row gap-4">
      <AppButton
        label="Nouvelle entreprise"
        icon={<FaBuilding className="mr-2" />}
        type="primary"
        size="md"
        onClick={() => {
          console.log("Entreprises: Opening company form");
          setShowForm(true);
        }}
        className="bg-teal-500 hover:bg-teal-600 text-white"
      />
      <input
        type="search"
        value={search}
        onChange={(e) => {
          console.log("Entreprises: Search filter changed:", e.target.value);
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Rechercher par nom, email, contact..."
        className="p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
      />
      <select
        value={status}
        onChange={(e) => {
          console.log("Entreprises: Status filter changed:", e.target.value);
          setStatus(e.target.value as "active" | "inactive");
          setPage(1);
        }}
        className="p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
      >
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
      </select>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
          Gestion des Entreprises
        </h1>
        <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
          Créez et consultez vos entreprises.
        </p>
      </div>

      {loading && (
        <div className="text-center my-4">
          <span className="animate-spin">⏳ Chargement des entreprises...</span>
        </div>
      )}
      {!loading && Array.isArray(companies) && companies.length === 0 && (
        <div className="text-center my-4 text-warning">
          Aucune entreprise disponible.{" "}
          <button
            className="underline text-primary"
            onClick={() => setShowForm(true)}
          >
            Créer une entreprise
          </button>
        </div>
      )}

      <AppToolbar left={leftToolbarTemplate()} />

      <Table
        data={Array.isArray(companies) ? companies : []}
        columns={columns}
        title="Entreprises avec offres publiées"
        globalFilterFields={["name", "email", "contact_person", "creator_name"]}
        meta={meta ?? undefined}
        onPageChange={(newPage) => {
          console.log("Entreprises: Page changed to:", newPage);
          setPage(newPage);
        }}
        onPerPageChange={(newPerPage) => {
          console.log("Entreprises: Per page changed to:", newPerPage);
          setPerPage(newPerPage);
          setPage(1);
        }}
      />

      <Dialog
        visible={showForm}
        header="Nouvelle entreprise"
        onHide={() => {
          console.log("Entreprises: Closing company form");
          setShowForm(false);
        }}
        style={{ width: "80vw", maxWidth: "800px" }}
      >
        <CompanyForm
          onSave={onCompanySaved}
          onCancel={() => {
            console.log("Entreprises: Cancelled company form");
            setShowForm(false);
          }}
        />
      </Dialog>
    </div>
  );
}