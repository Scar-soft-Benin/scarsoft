// pages/Recruitment.tsx

import Table, { type Column } from "../components/Table";

interface Recruitment {
  id: string;
  name: string;
  email: string;
  position: string;
  resume: string;
  date: string;
}

const mockRecruitments: Recruitment[] = [
  {
    id: "1",
    name: "Alice Brown",
    email: "alice@example.com",
    position: "Frontend Developer",
    resume: "resume.pdf",
    date: "2025-06-01",
  },
  {
    id: "2",
    name: "Bob White",
    email: "bob@example.com",
    position: "Backend Developer",
    resume: "resume.pdf",
    date: "2025-06-02",
  },
];

export default function Recruitment() {
  const columns: Column<Recruitment>[] = [
    { header: "Nom", field: "name" },
    { header: "Email", field: "email" },
    { header: "Poste", field: "position" },
    {
      header: "CV",
      field: "resume",
      render: (row: Recruitment) => (
        <a
          href={row.resume}
          className="text-emerald-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevent row click navigation
        >
          Télécharger
        </a>
      ),
    },
    { header: "Date", field: "date" },
  ];

  return (
    <Table
      data={mockRecruitments}
      columns={columns}
      title="Candidatures"
      detailPath="/recruitment"
    />
  );
}