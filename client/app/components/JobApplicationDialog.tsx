// // components/JobApplicationDialog.tsx
// import { useState } from "react";
// import Dialog from "./Dialog";
// import AppBaseButton from "./appBaseButton";

// interface JobApplicationDialogProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit?: (data: {
//     fullname: string;
//     email: string;
//     phone: string;
//     cvFile: File | null;
//     motivationLetter: string;
//     motivationFile: File | null;
//   }) => void;
// }

// export default function JobApplicationDialog({ visible, onClose, onSubmit }: JobApplicationDialogProps) {
//   const [fullname, setFullname] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [cvFile, setCvFile] = useState<File | null>(null);
//   const [motivationLetter, setMotivationLetter] = useState("");
//   const [motivationFile, setMotivationFile] = useState<File | null>(null);

//   const handleSubmit = () => {
//     if (!fullname || !email || !phone || !cvFile) {
//       alert("Veuillez remplir tous les champs obligatoires.");
//       return;
//     }
//     onSubmit?.({ fullname, email, phone, cvFile, motivationLetter, motivationFile });
//     onClose();
//     // reset
//     setFullname("");
//     setEmail("");
//     setPhone("");
//     setCvFile(null);
//     setMotivationLetter("");
//     setMotivationFile(null);
//   };

//   return (
//     <Dialog
//       visible={visible}
//       onHide={onClose}
//       header={<h2 className="text-2xl font-bold text-green-600">Postuler maintenant</h2>}
//       style={{ maxWidth: "900px", borderRadius: "1rem" }}
//       footer={
//         <div className="flex justify-between items-center">
//           <p className="text-sm text-gray-400">Tous les champs marqués * sont obligatoires</p>
//           <div className="flex gap-2">
//             <AppBaseButton label="Annuler" type="second" onClick={onClose} />
//             <AppBaseButton label="Envoyer" type="first" onClick={handleSubmit} />
//           </div>
//         </div>
//       }
//     >
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Formulaire */}
//         <div className="space-y-4">
//           <input
//             type="text"
//             required
//             placeholder="Nom complet *"
//             className="w-full p-2 border rounded"
//             value={fullname}
//             onChange={(e) => setFullname(e.target.value)}
//           />
//           <input
//             type="email"
//             required
//             placeholder="Email *"
//             className="w-full p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="tel"
//             required
//             placeholder="Téléphone *"
//             className="w-full p-2 border rounded"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//           <input
//             type="file"
//             accept=".pdf"
//             required
//             className="w-full"
//             onChange={(e) => setCvFile(e.target.files?.[0] || null)}
//           />
//           <textarea
//             rows={4}
//             placeholder="Lettre de motivation (facultatif)"
//             className="w-full p-2 border rounded"
//             value={motivationLetter}
//             onChange={(e) => setMotivationLetter(e.target.value)}
//           />
//           <input
//             type="file"
//             accept=".pdf"
//             className="w-full"
//             onChange={(e) => setMotivationFile(e.target.files?.[0] || null)}
//           />
//         </div>

//         {/* Illustration */}
//         <div className="hidden md:block">
//           <img
//             src="/images/job-apply.svg"
//             alt="Illustration candidature"
//             className="w-full h-auto rounded-xl shadow"
//           />
//         </div>
//       </div>
//     </Dialog>
//   );
// }
