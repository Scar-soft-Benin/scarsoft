// Mock data (replace with API fetch later)
const mockRecruitments = [
    {
        id: "1",
        name: "Alice Brown",
        email: "alice@example.com",
        position: "Frontend Developer",
        resume: "resume.pdf",
        date: "2025-06-01"
    },
    {
        id: "2",
        name: "Bob White",
        email: "bob@example.com",
        position: "Backend Developer",
        resume: "resume.pdf",
        date: "2025-06-02"
    }
];

export default function Recruitment() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Recruitment Submissions</h2>
            <div className="bg-white rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Position</th>
                            <th className="p-2 text-left">Resume</th>
                            <th className="p-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRecruitments.map((recruitment) => (
                            <tr key={recruitment.id} className="border-t">
                                <td className="p-2">{recruitment.name}</td>
                                <td className="p-2">{recruitment.email}</td>
                                <td className="p-2">{recruitment.position}</td>
                                <td className="p-2">
                                    <a
                                        href={recruitment.resume}
                                        className="text-secondary"
                                    >
                                        Download
                                    </a>
                                </td>
                                <td className="p-2">{recruitment.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
