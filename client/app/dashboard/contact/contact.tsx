import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { gsap } from "gsap";
import { useMessage } from "~/context/messageContext";
import DataTable from "../components/DataTable";

// Mock data (replace with API fetch later)
const mockContacts = [
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
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation de la modale
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [isModalOpen]);

  const handleReply = (contact: any) => {
    setSelectedContact(contact);
    setReplySubject(`Re: Votre message du ${contact.date}`);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const handleSendReply = () => {
    // Placeholder pour envoi backend (POST /api/send-email)
    console.log("Envoi de l'email à", selectedContact.email, {
      subject: replySubject,
      message: replyMessage,
    });
    addMessage("Réponse envoyée avec succès.", "success");
    setIsModalOpen(false);
    setReplySubject("");
    setReplyMessage("");
  };

  const columns = [
    { header: "Nom", field: "name" },
    { header: "Email", field: "email" },
    { header: "Message", field: "message" },
    { header: "Date", field: "date" },
    {
      header: "Action",
      field: "action",
      render: (row: any) => (
        <Button
          label="Répondre"
          icon="pi pi-envelope"
          className="p-button-sm p-button-text"
          onClick={() => handleReply(row)}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable data={mockContacts} columns={columns} title="Messages de Contact" />
      <Dialog
        header={`Répondre à ${selectedContact?.name}`}
        visible={isModalOpen}
        style={{ width: "400px" }}
        onHide={() => setIsModalOpen(false)}
        className="dark:bg-gray-800 dark:text-white"
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
        </div>
      </Dialog>
    </>
  );
}

// Mock data (replace with API fetch later)
// const mockContacts = [
//     {
//         id: "1",
//         name: "John Doe",
//         email: "john@example.com",
//         message: "Interested in services",
//         date: "2025-06-01"
//     },
//     {
//         id: "2",
//         name: "Jane Smith",
//         email: "jane@example.com",
//         message: "Partnership inquiry",
//         date: "2025-06-02"
//     }
// ];

// export default function Contacts() {
//     return (
//         <div>
//             <h2 className="text-2xl font-bold mb-4">Contact Emails</h2>
//             <div className="bg-white rounded-lg shadow-md">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="p-2 text-left">Name</th>
//                             <th className="p-2 text-left">Email</th>
//                             <th className="p-2 text-left">Message</th>
//                             <th className="p-2 text-left">Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {mockContacts.map((contact) => (
//                             <tr key={contact.id} className="border-t">
//                                 <td className="p-2">{contact.name}</td>
//                                 <td className="p-2">{contact.email}</td>
//                                 <td className="p-2">{contact.message}</td>
//                                 <td className="p-2">{contact.date}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
