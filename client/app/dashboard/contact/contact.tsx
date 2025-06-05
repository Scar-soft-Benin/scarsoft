// Mock data (replace with API fetch later)
const mockContacts = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        message: "Interested in services",
        date: "2025-06-01"
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        message: "Partnership inquiry",
        date: "2025-06-02"
    }
];

export default function Contacts() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Contact Emails</h2>
            <div className="bg-white rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Message</th>
                            <th className="p-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockContacts.map((contact) => (
                            <tr key={contact.id} className="border-t">
                                <td className="p-2">{contact.name}</td>
                                <td className="p-2">{contact.email}</td>
                                <td className="p-2">{contact.message}</td>
                                <td className="p-2">{contact.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
