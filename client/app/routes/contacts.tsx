// routes/contact.tsx
import Contacts from "~/contact-us/contacts";


export function meta() {
    return [
        { title: "Scar Soft - Contactez-nous" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function ContactezNous() {
    return (
        <>
            <Contacts />
        </>
    );
}
