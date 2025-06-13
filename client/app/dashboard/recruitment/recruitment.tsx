import DataTable from "../components/DataTable";

// Mock data (replace with API fetch later)
const mockRecruitments = [
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
  const columns = [
    { header: "Nom", field: "name" },
    { header: "Email", field: "email" },
    { header: "Poste", field: "position" },
    {
      header: "CV",
      field: "resume",
      render: (row: any) => (
        <a
          href={row.resume}
          className="text-emerald-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Télécharger
        </a>
      ),
    },
    { header: "Date", field: "date" },
  ];

  return (
    <DataTable
      data={mockRecruitments}
      columns={columns}
      title="Candidatures"
    />
  );
}