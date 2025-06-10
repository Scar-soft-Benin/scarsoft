// routes/nos-service.tsx

import Services from "~/nos-service/services";


export function meta() {
    return [
        { title: "Scar Soft - Nos Services" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function NosService() {
    return (
        <>
            <Services />
        </>
    );
}
