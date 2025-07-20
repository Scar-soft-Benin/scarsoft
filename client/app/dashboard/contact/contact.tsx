import { useEffect, useState } from "react";
import Table, { type Column } from "../components/Table";
import { useMessage } from "~/context/messageContext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { getAllContacts, deleteContact, replyToContact, updateContactStatus } from "~/store/sagas/contactSaga";
import type { Contact, ReplyContactPayload, UpdateContactStatusPayload } from "~/services/types/contact.types";
import { FiTrash2, FiMail, FiEye } from "react-icons/fi";
import AppButton from "../components/appButton";
import Dialog from "../components/Dialog";
import { useForm, Controller } from "react-hook-form";

type ReplyFormData = {
    replyMessage: string;
};

export default function Contacts() {
    const { addMessage } = useMessage();
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.contact.contacts);
    const { error, loading } = useSelector((state: RootState) => state.contact);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showReplyDialog, setShowReplyDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ReplyFormData>({
        defaultValues: {
            replyMessage: "",
        },
    });

    // Fetch contacts on mount
    useEffect(() => {
        dispatch(getAllContacts());
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            addMessage(error.message, "error");
        }
    }, [error, addMessage]);

    // Handle reply submission
    const handleReply = async (data: ReplyFormData) => {
        if (!selectedContact) {
            addMessage("Aucun contact sélectionné", "error");
            return;
        }
        try {
            const payload: ReplyContactPayload = { reply_message: data.replyMessage };
            dispatch(replyToContact({ contactId: selectedContact.id.toString(), data: payload }));
            setShowReplyDialog(false);
            reset();
            setSelectedContact(null);
            addMessage("Réponse envoyée avec succès", "success");
        } catch (err) {
            addMessage(`Erreur lors de l'envoi de la réponse: ${err instanceof Error ? err.message : String(err)}`, "error");
        }
    };

    // Handle delete confirmation
    const confirmDelete = (contact: Contact) => {
        setContactToDelete(contact);
        setShowDeleteDialog(true);
    };

    // Handle delete action
    const deleteContactAction = () => {
        if (!contactToDelete) return;
        dispatch(deleteContact(contactToDelete.id.toString()));
        setShowDeleteDialog(false);
        setContactToDelete(null);
        addMessage("Message supprimé avec succès", "success");
    };

    // Handle status change
    const handleStatusChange = (contact: Contact, status: UpdateContactStatusPayload["status"]) => {
        dispatch(updateContactStatus(contact.id.toString(), { status }));
        addMessage(`Statut mis à jour: ${status}`, "success");
    };

    // Status template for visual rendering
    const statusTemplate = (rowData: Contact) => {
        const getClassName = (status: string) => {
            switch (status) {
                case "unread":
                    return "bg-warning/10 text-warning border-warning";
                case "read":
                    return "bg-info/10 text-info border-info";
                case "replied":
                    return "bg-success/10 text-success border-success";
                case "archived":
                    return "bg-neutral/10 text-neutral border-neutral";
                default:
                    return "bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text border-neutral-light-border dark:border-neutral-dark-border";
            }
        };

        const getLabel = (status: string) => {
            switch (status) {
                case "unread":
                    return "Non lu";
                case "read":
                    return "Lu";
                case "replied":
                    return "Répondu";
                case "archived":
                    return "Archivé";
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

    // Actions template for buttons
    const actionsTemplate = (rowData: Contact) => (
        <div className="flex gap-2 justify-center">
            <AppButton
                icon={<FiEye />}
                type="info"
                size="sm"
                outlined
                tooltip="Afficher les détails"
                onClick={() => {
                    setSelectedContact(rowData);
                    setShowDetailsDialog(true);
                }}
            />
            <AppButton
                icon={<FiMail />}
                type="primary"
                size="sm"
                outlined
                tooltip="Répondre"
                onClick={() => {
                    setSelectedContact(rowData);
                    setShowReplyDialog(true);
                }}
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

    const columns: Column<Contact>[] = [
        { header: "Nom", field: "name", filterable: true, sortable: true },
        { header: "Email", field: "email", filterable: true, sortable: true },
        { header: "Sujet", field: "subject", filterable: true, sortable: true },
        { header: "Message", field: "message", filterable: true },
        { header: "Date de création", field: "created_at", filterable: true, sortable: true },
        { header: "Statut", field: "status", render: statusTemplate, filterable: true, sortable: true },
        { header: "Actions", field: "actions", render: actionsTemplate },
    ];

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
                    Gestion des Contacts
                </h1>
                <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary">
                    Consultez et gérez les messages de contact reçus.
                </p>
            </div>
            {loading && (
                <div className="text-center my-4">
                    <span className="animate-spin">
                        ⏳ Chargement des contacts...
                    </span>
                </div>
            )}
            <Table
                data={Array.isArray(contacts) ? contacts : []}
                columns={columns}
                title="Messages de Contact"
                globalFilterFields={["name", "email", "subject", "message", "created_at", "status"]}
            />

            {/* Modal for displaying contact details */}
            <Dialog
                visible={showDetailsDialog}
                header="Détails du Message"
                onHide={() => {
                    setShowDetailsDialog(false);
                    setSelectedContact(null);
                }}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Fermer"
                            type="secondary"
                            onClick={() => {
                                setShowDetailsDialog(false);
                                setSelectedContact(null);
                            }}
                        />
                        <AppButton
                            label="Répondre"
                            type="primary"
                            onClick={() => {
                                setShowDetailsDialog(false);
                                setShowReplyDialog(true);
                            }}
                        />
                    </div>
                }
            >
                {selectedContact && (
                    <div className="text-neutral-light-text dark:text-neutral-dark-text space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Nom :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.name}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Email :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.email}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Sujet :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.subject}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Date :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.created_at}</span>
                            </p>
                            <p className="md:col-span-2">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text block mb-1">Message :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary bg-neutral-light-surface dark:bg-neutral-dark-surface p-3 rounded-md block">{selectedContact.message}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Statut :</span>
                                <span>{statusTemplate(selectedContact)}</span>
                            </p>
                            {selectedContact.reply_message && (
                                <p className="md:col-span-2">
                                    <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text block mb-1">Réponse :</span>
                                    <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary bg-neutral-light-surface dark:bg-neutral-dark-surface p-3 rounded-md block">{selectedContact.reply_message}</span>
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">Changer le statut :</p>
                            <div className="flex gap-2 flex-wrap">
                                {["unread", "read", "replied", "archived"].map((status) => (
                                    <AppButton
                                        key={status}
                                        label={status.charAt(0).toUpperCase() + status.slice(1)}
                                        type={status === selectedContact.status ? "primary" : "secondary"}
                                        size="sm"
                                        onClick={() => handleStatusChange(selectedContact, status as UpdateContactStatusPayload["status"])}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Modal for replying to a contact */}
            <Dialog
                visible={showReplyDialog}
                header="Répondre au Message"
                onHide={() => {
                    setShowReplyDialog(false);
                    reset();
                    setSelectedContact(null);
                }}
                footer={
                    <div className="flex justify-end gap-2">
                        <AppButton
                            label="Annuler"
                            type="secondary"
                            onClick={() => {
                                setShowReplyDialog(false);
                                reset();
                                setSelectedContact(null);
                            }}
                        />
                        <AppButton
                            label="Envoyer"
                            type="primary"
                            onClick={handleSubmit(handleReply)}
                        />
                    </div>
                }
            >
                {selectedContact && (
                    <div className="text-neutral-light-text dark:text-neutral-dark-text space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Nom :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.name}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Email :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.email}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text mr-2">Sujet :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary">{selectedContact.subject}</span>
                            </p>
                            <p className="md:col-span-2">
                                <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text block mb-1">Message :</span>
                                <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary bg-neutral-light-surface dark:bg-neutral-dark-surface p-3 rounded-md block">{selectedContact.message}</span>
                            </p>
                            {selectedContact.reply_message && (
                                <p className="md:col-span-2">
                                    <span className="font-bold text-neutral-light-text dark:text-neutral-dark-text block mb-1">Réponse précédente :</span>
                                    <span className="text-neutral-light-secondary dark:text-neutral-dark-secondary bg-neutral-light-surface dark:bg-neutral-dark-surface p-3 rounded-md block">{selectedContact.reply_message}</span>
                                </p>
                            )}
                        </div>
                        <div>
                            <Controller
                                name="replyMessage"
                                control={control}
                                rules={{ required: "Le message de réponse est requis" }}
                                render={({ field }) => (
                                    <textarea
                                        id="replyMessage"
                                        {...field}
                                        rows={6}
                                        className={`mt-1 w-full p-2 border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface ${
                                            errors.replyMessage
                                                ? "border-danger"
                                                : "border-neutral-light-border dark:border-neutral-dark-border"
                                        } focus:ring-primary focus:border-primary`}
                                        placeholder="Écrivez votre réponse ici..."
                                    />
                                )}
                            />
                            {errors.replyMessage && (
                                <small className="text-danger">{errors.replyMessage.message}</small>
                            )}
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Modal for delete confirmation */}
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
                            onClick={deleteContactAction}
                        />
                    </div>
                }
            >
                <p className="text-neutral-light-text dark:text-neutral-dark-text">
                    Êtes-vous sûr de vouloir supprimer le message de{" "}
                    <strong className="font-bold text-neutral-light-text dark:text-neutral-dark-text">{contactToDelete?.name}</strong> ?
                </p>
            </Dialog>
        </div>
    );
}