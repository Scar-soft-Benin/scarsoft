import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "~/context/messageContext";
import type { Column } from "../components/Table";
import AppButton from "../components/appButton";
import AppToolbar from "../components/appToolBar";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiTrash2, FiEdit, FiUserPlus } from "react-icons/fi";
import type { RootState } from "~/store";
import { getCompanyUsers, inviteUser, updateUser, deleteUser } from "~/store/sagas/companySaga";

interface CompanyUsersProps {
  companyId: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "member";
}

const inviteSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  role: z.enum(["admin", "member"], { errorMap: () => ({ message: "Veuillez sélectionner un rôle" }) }),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function Users({ companyId }: CompanyUsersProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const { addMessage } = useMessage();
  const users = useSelector((state: RootState) => state.company.users); // Supposons un state pour les utilisateurs
  const error = useSelector((state: RootState) => state.company.error);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", name: "", role: "member" },
  });

  useEffect(() => {
    dispatch(getCompanyUsers({ companyId }));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (error) {
      addMessage(error.message, "error");
    }
  }, [error, addMessage]);

  const onInviteSubmit = (data: InviteFormData) => {
    dispatch(inviteUser({ ...data, companyId }));
    setShowInviteForm(false);
    reset();
    addMessage("Invitation envoyée avec succès", "success");
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setShowInviteForm(true);
    reset({ email: user.email, name: user.name, role: user.role });
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      dispatch(deleteUser({ userId: userToDelete.id, companyId }));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      addMessage("Utilisateur supprimé avec succès", "success");
    }
  };

  const actionsTemplate = (rowData: User) => (
    <div className="flex gap-2 justify-center">
      <AppButton
        icon={<FiEdit />}
        type="primary"
        size="sm"
        outlined
        tooltip="Modifier"
        onClick={() => editUser(rowData)}
      />
      <AppButton
        icon={<FiTrash2 />}
        type="danger"
        size="sm"
        outlined
        tooltip="Supprimer"
        onClick={() => confirmDeleteUser(rowData)}
      />
    </div>
  );

  const columns: Column<User>[] = [
    { header: "Nom", field: "name", filterable: true, sortable: true },
    { header: "Email", field: "email", filterable: true, sortable: true },
    { header: "Rôle", field: "role", filterable: true, sortable: true },
    { header: "Actions", field: "actions", render: actionsTemplate },
  ];

  const leftToolbarTemplate = () => (
    <AppButton
      label="Inviter un utilisateur"
      icon={<FiUserPlus className="mr-2" />}
      type="primary"
      onClick={() => {
        setSelectedUser(null);
        setShowInviteForm(true);
        reset({ email: "", name: "", role: "member" });
      }}
      className="bg-teal-500 hover:bg-teal-600 text-white"
    />
  );

  const rightToolbarTemplate = () => null;

  return (
    <div className="company-users p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
          Gestion des Utilisateurs
        </h2>
        <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
          Gérez les utilisateurs ayant accès à l'espace entreprise.
        </p>
      </div>

      <AppToolbar left={leftToolbarTemplate()} right={rightToolbarTemplate()} />

      <Table
        data={users || []}
        columns={columns}
        title="Utilisateurs de l'Entreprise"
        globalFilterFields={["name", "email", "role"]}
      />

      <Dialog
        visible={showInviteForm}
        header={selectedUser ? "Modifier l'utilisateur" : "Inviter un utilisateur"}
        onHide={() => {
          setShowInviteForm(false);
          setSelectedUser(null);
        }}
        style={{ width: "50vw", maxWidth: "600px" }}
      >
        <form onSubmit={handleSubmit(onInviteSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text">
              Nom *
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  id="name"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.name ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: John Doe"
                />
              )}
            />
            {errors.name && <small className="text-danger">{errors.name.message}</small>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text">
              Email *
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  id="email"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.email ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                  placeholder="Ex: john.doe@entreprise.com"
                />
              )}
            />
            {errors.email && <small className="text-danger">{errors.email.message}</small>}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-bold text-neutral-light-text dark:text-neutral-dark-text">
              Rôle *
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  id="role"
                  {...field}
                  className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                    errors.role ? "border-danger" : "border-neutral-light-border dark:border-neutral-dark-border"
                  } focus:ring-primary focus:border-primary`}
                >
                  <option value="member">Membre</option>
                  <option value="admin">Administrateur</option>
                </select>
              )}
            />
            {errors.role && <small className="text-danger">{errors.role.message}</small>}
          </div>
          <div className="flex justify-end gap-2">
            <AppButton
              label="Annuler"
              type="secondary"
              size="md"
              outlined
              onClick={() => {
                setShowInviteForm(false);
                setSelectedUser(null);
              }}
              className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text border-amber-500 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-400"
            />
            <AppButton
              label={selectedUser ? "Modifier" : "Inviter"}
              type="primary"
              size="md"
              typeAttr="submit"
              className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        visible={showDeleteConfirm}
        header="Confirmer la suppression"
        onHide={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        style={{ width: "40vw", maxWidth: "400px" }}
      >
        <div className="p-4">
          <p>
            Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
            <strong>{userToDelete?.name}</strong> ?
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <AppButton
              label="Annuler"
              type="secondary"
              onClick={() => {
                setShowDeleteConfirm(false);
                setUserToDelete(null);
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
}