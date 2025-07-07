// pages/Contacts.tsx
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { gsap } from "gsap";
import Dialog from "../components/Dialog";
import Table, { type Column } from "../components/Table";
import { useMessage } from "~/context/messageContext";
import AppBaseButton from "~/components/appBaseButton";
import { FaEnvelope } from "react-icons/fa";

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
  const modalRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      replySubject: "",
      replyMessage: "",
    },
  });

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
    reset({ replySubject: `Re: Votre message du ${contact.date}`, replyMessage: "" });
    setIsModalOpen(true);
  };

  const onSubmit = (data: { replySubject: string; replyMessage: string }) => {
    if (selectedContact) {
      console.log("Envoi de l'email à", selectedContact.email, data);
      addMessage("Réponse envoyée avec succès.", "success");
    }
    setIsModalOpen(false);
    reset();
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
        <AppBaseButton
          text="Répondre"
          icon={<FaEnvelope />}
          type="first"
          textColor=""
          bgColor="bg-transparent"
          iconPos="left"
          className="p-button-sm p-button-text"
          onClick={(e) => {
            e.stopPropagation();
            handleReply(row);
          }}
        />
      ),
    },
  ];

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <AppBaseButton
        text="Annuler"
        type="second"
        textColor=""
        bgColor="bg-transparent"
        className="p-button-sm p-button-outlined"
        onClick={() => setIsModalOpen(false)}
      />
      <AppBaseButton
        text="Envoyer"
        type="first"
        textColor=""
        bgColor="bg-transparent"
        className="p-button-sm p-button-raised"
        onClick={handleSubmit(onSubmit)}
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
        <div ref={modalRef} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Sujet
            </label>
            <Controller
              name="replySubject"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <Controller
              name="replyMessage"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              )}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
