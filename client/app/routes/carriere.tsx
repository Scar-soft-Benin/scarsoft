// routes/contact.tsx
import Careers from "~/career/careers";


export function meta() {
    return [
        { title: "Scar Soft - Contactez-nous" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function Carriere() {
    return (
        <>
            <Careers />
        </>
    );
}
