import { useEffect } from "react";
import Table, { type Column } from "../components/Table";
import { useMessage } from "~/context/messageContext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { getAllContacts } from "~/store/sagas/contactSaga";
import type { Contact } from "~/services/types/contact.types";

export default function Contacts() {
    const { addMessage } = useMessage();
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.contact.contacts);
    const contact = useSelector((state: RootState) => state.contact);
    const { error, loading } = useSelector((state: RootState) => state.contact);

    // Fetch contacts only when params change
    useEffect(() => {
        dispatch(getAllContacts());
    }, [dispatch]);

    useEffect(() => {
        console.log("Contacts:", contacts);
        console.log("Contact reducer:", contact);
    }, [dispatch]);

    // Handle errors separately
    useEffect(() => {
        if (error) {
            addMessage(error.message, "error");
        }
    }, [error, addMessage, dispatch]);
    

    const columns: Column<Contact>[] = [
        { header: "Nom", field: "name" },
        { header: "Email", field: "email" },
        { header: "Sujet", field: "subject" },
        { header: "Message", field: "message" },
        { header: "Date de création", field: "created_at" }
    ];

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-2">
                    Gestion des Contacts
                </h1>
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
                globalFilterFields={["name", "email", "subject", "message", "created_at"]}
            />
        </div>
    );
}
