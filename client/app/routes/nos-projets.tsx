// routes/nos-service.tsx

import NosProject from "~/nos-projets/nos-projet";


export function meta() {
    return [
        { title: "Scar Soft - Nos Projets" },
        { name: "description", content: "Learn more about Scar-soft" }
    ];
}

export default function NosProjects() {
    return (
        <>
            <NosProject />
        </>
    );
}
