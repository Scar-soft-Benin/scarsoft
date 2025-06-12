// routes/contact.tsx
import CareerApplication from "~/career/careerApplication";


export function meta() {
    return [
        { title: "Scar Soft - Carrière Candidature" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function CarriereCandidature() {
    return (
        <>
            <CareerApplication />
        </>
    );
}
