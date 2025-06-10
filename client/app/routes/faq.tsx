// routes/nos-service.tsx

import Faq from "~/faq/faq";


export function meta() {
    return [
        { title: "Scar Soft - Nos Services" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function FAQ() {
    return (
        <>
            <Faq />
        </>
    );
}
