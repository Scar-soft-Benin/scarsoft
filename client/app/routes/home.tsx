import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Scar Soft" },
        {
            name: "description",
            content:
                "Système informatique et logiciel, Scar-Soft est une société de solutions digitales adaptées à votre réussite ! Nous transformons vos idées en solutions performantes et innovantes. Scar-Soft est une entreprise spécialisée dans le développement d’applications, de logiciels sur mesure, le marketing digital, le community management et le recrutement IT. Notre mission est d’apporter des solutions fiables et innovantes adaptées aux besoins de nos clients."
        }
    ];
}

export default function Home() {
    return (
        <>
            <Welcome />
        </>
    );
}
