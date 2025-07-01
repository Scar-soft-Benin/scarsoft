// pages/Contacts.tsx
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import Dialog from "../components/Dialog";
import Table, { type Column } from "../components/Table";
import { useMessage } from "~/context/messageContext";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    message: "Interested in services",
    date: "2025-06-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    message: "Partnership inquiry",
    date: "2025-06-02",
  },
];

export default function Contacts() {
  const { addMessage } = useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [isModalOpen]);

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact);
    setReplySubject(`Re: Votre message du ${contact.date}`);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const handleSendReply = () => {
    if (selectedContact) {
      console.log("Envoi de l'email à", selectedContact.email, {
        subject: replySubject,
        message: replyMessage,
      });
      addMessage("Réponse envoyée avec succès.", "success");
    }
    setIsModalOpen(false);
    setReplySubject("");
    setReplyMessage("");
  };

  const columns: Column<Contact>[] = [
    { header: "Nom", field: "name" },
    { header: "Email", field: "email" },
    { header: "Message", field: "message" },
    { header: "Date", field: "date" },
    {
      header: "Action",
      field: "action",
      render: (row: Contact) => (
        <Button
          label="Répondre"
          icon="pi pi-envelope"
          className="p-button-sm p-button-text"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click navigation
            handleReply(row);
          }}
        />
      ),
    },
  ];

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Annuler"
        className="p-button-sm p-button-outlined"
        onClick={() => setIsModalOpen(false)}
      />
      <Button
        label="Envoyer"
        className="p-button-sm p-button-raised"
        onClick={handleSendReply}
      />
    </div>
  );

  return (
    <>
      <Table
        data={mockContacts}
        columns={columns}
        title="Messages de Contact"
        detailPath="/contacts"
      />
      <Dialog
        header={`Répondre à ${selectedContact?.name}`}
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        footer={dialogFooter}
      >
        <div ref={modalRef} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Sujet
            </label>
            <InputText
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="w-full p-inputtext-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <InputTextarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={5}
              className="w-full p-inputtext-sm"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}