// ~/dashboard/job-management/jobManagement.tsx
import { useState, useEffect, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { gsap } from "~/utils/gsap";
import { useLoading } from "~/context/loadingContext";
import { jobService, type ExtendedJobOffer } from "~/services/jobService";
import JobForm from "./jobForm";

interface GlobalFilter {
  global: { value: string | null; matchMode: FilterMatchMode };
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<ExtendedJobOffer[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<ExtendedJobOffer[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [filters, setFilters] = useState<GlobalFilter>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<ExtendedJobOffer | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<ExtendedJobOffer | null>(null);
  
  const { showLoading, hideLoading } = useLoading();
  const toast = useRef<Toast>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [jobs]);

  const loadJobs = async () => {
    try {
      showLoading();
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les offres d\'emploi',
        life: 3000
      });
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

  const deleteJob = async () => {
    if (!jobToDelete) return;

    try {
      showLoading();
      await jobService.deleteJob(jobToDelete.id);
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      setDeleteDialog(false);
      setJobToDelete(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Offre supprimée avec succès',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer l\'offre',
        life: 3000
      });
    } finally {
      hideLoading();
    }
  };

  const archiveJob = async (job: ExtendedJobOffer) => {
    try {
      showLoading();
      await jobService.archiveJob(job.id);
      await loadJobs();
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Offre archivée avec succès',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible d\'archiver l\'offre',
        life: 3000
      });
    } finally {
      hideLoading();
    }
  };

  const reactivateJob = async (job: ExtendedJobOffer) => {
    try {
      showLoading();
      await jobService.reactivateJob(job.id);
      await loadJobs();
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Offre réactivée avec succès',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de réactiver l\'offre',
        life: 3000
      });
    } finally {
      hideLoading();
    }
  };

  const onJobSaved = async () => {
    setShowForm(false);
    setEditingJob(null);
    await loadJobs();
    toast.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: editingJob ? 'Offre modifiée avec succès' : 'Offre créée avec succès',
      life: 3000
    });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    const newFilters = { ...filters };
    newFilters.global.value = value;
    setFilters(newFilters);
  };

  // Templates pour les colonnes
  const statusTemplate = (rowData: ExtendedJobOffer) => {
    const getSeverity = (status: string) => {
      switch (status) {
        case 'active': return 'success';
        case 'archived': return 'warning';
        case 'draft': return 'secondary';
        default: return 'info';
      }
    };

    const getLabel = (status: string) => {
      switch (status) {
        case 'active': return 'Active';
        case 'archived': return 'Archivée';
        case 'draft': return 'Brouillon';
        default: return status;
      }
    };

    return (
      <Tag 
        value={getLabel(rowData.status)} 
        severity={getSeverity(rowData.status)} 
      />
    );
  };

  const typeTemplate = (rowData: ExtendedJobOffer) => {
    const getSeverity = (type: string) => {
      switch (type) {
        case 'Recrutement': return 'success';
        case 'Stage': return 'info';
        case 'Freelance': return 'warning';
        default: return 'info';
      }
    };

    return (
      <Tag 
        value={rowData.type} 
        severity={getSeverity(rowData.type)} 
      />
    );
  };

  const dateTemplate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const actionsTemplate = (rowData: ExtendedJobOffer) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          size="small"
          className="p-button-rounded p-button-info p-button-text"
          tooltip="Voir"
          onClick={() => window.open(`/carriere-candidature/${rowData.id}`, '_blank')}
        />
        <Button
          icon="pi pi-pencil"
          size="small"
          className="p-button-rounded p-button-success p-button-text"
          tooltip="Modifier"
          onClick={() => editJob(rowData)}
        />
        {rowData.status === 'active' ? (
          <Button
            icon="pi pi-archive"
            size="small"
            className="p-button-rounded p-button-warning p-button-text"
            tooltip="Archiver"
            onClick={() => archiveJob(rowData)}
          />
        ) : rowData.status === 'archived' ? (
          <Button
            icon="pi pi-refresh"
            size="small"
            className="p-button-rounded p-button-success p-button-text"
            tooltip="Réactiver"
            onClick={() => reactivateJob(rowData)}
          />
        ) : null}
        <Button
          icon="pi pi-trash"
          size="small"
          className="p-button-rounded p-button-danger p-button-text"
          tooltip="Supprimer"
          onClick={() => confirmDeleteJob(rowData)}
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nouvelle offre"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex gap-2 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher..."
          />
        </span>
      </div>
    );
  };

  return (
    <div className="job-management">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="card">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Gestion des Offres d'Emploi
          </h2>
          <p className="text-gray-600">
            Gérez vos offres d'emploi : créez, modifiez, archivez ou supprimez les postes.
          </p>
        </div>

        <Toolbar 
          className="mb-4" 
          left={leftToolbarTemplate} 
          right={rightToolbarTemplate}
        />

        <div ref={tableRef}>
          <DataTable
            value={jobs}
            selection={selectedJobs}
            onSelectionChange={(e) => setSelectedJobs(e.value as unknown as ExtendedJobOffer[])}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} offres"
            filters={filters}
            globalFilterFields={['title', 'type', 'location', 'status']}
            emptyMessage="Aucune offre d'emploi trouvée."
            stripedRows
            removableSort
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{ width: '3rem' }}
            />
            
            <Column
              field="title"
              header="Titre du poste"
              sortable
              style={{ minWidth: '200px' }}
            />
            
            <Column
              field="type"
              header="Type"
              body={typeTemplate}
              sortable
              style={{ minWidth: '120px' }}
            />
            
            <Column
              field="location"
              header="Lieu"
              sortable
              style={{ minWidth: '150px' }}
            />
            
            <Column
              field="salary"
              header="Salaire"
              sortable
              style={{ minWidth: '150px' }}
            />
            
            <Column
              field="status"
              header="Statut"
              body={statusTemplate}
              sortable
              style={{ minWidth: '100px' }}
            />
            
            {/* <Column
              field="createdAt"
              header="Créé le"
              body={(rowData) => dateTemplate(rowData.createdAt)}
              sortable
              style={{ minWidth: '120px' }}
            />
            
            <Column
              field="updatedAt"
              header="Modifié le"
              body={(rowData) => dateTemplate(rowData.updatedAt)}
              sortable
              style={{ minWidth: '120px' }}
            /> */}
            
            <Column
              header="Actions"
              body={actionsTemplate}
              exportable={false}
              style={{ minWidth: '200px' , textAlign: 'center' }}
            />
          </DataTable>
        </div>
      </div>

      {/* Dialog pour le formulaire */}
      <Dialog
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingJob(null);
        }}
        header={editingJob ? 'Modifier l\'offre' : 'Nouvelle offre'}
        modal
        className="p-fluid"
        style={{ width: '80vw', maxWidth: '800px' }}
        maximizable
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

      {/* Dialog de confirmation de suppression */}
      <Dialog
        visible={deleteDialog}
        onHide={() => setDeleteDialog(false)}
        header="Confirmer la suppression"
        modal
        footer={
          <div>
            <Button
              label="Non"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialog(false)}
            />
            <Button
              label="Oui"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={deleteJob}
            />
          </div>
        }
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {jobToDelete && (
            <span>
              Êtes-vous sûr de vouloir supprimer définitivement l'offre{' '}
              <b>{jobToDelete.title}</b> ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default JobManagement;