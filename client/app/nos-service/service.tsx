import AppBaseTitle from "~/components/appBaseTitle";
import card1 from "./card-1.jpeg";
import card2 from "./card-2.jpeg";
import card3 from "./card-3.jpeg";
import ServiceCard from "./serviceCard";

const Service = () => {
    const services = [
        {
            image: card1,
            title: "Développement d’applications et logiciels",
            description:
                "Nous créons des applications mobiles et web performantes, des logiciels métiers sur mesure et assurons leur intégration ainsi que leur maintenance.",
            alignment: "left" as const
        },
        {
            image: card2,
            title: "Marketing digital",
            description:
                "Nous mettons en place des stratégies de communication digitale, optimisons la visibilité des entreprises grâce au SEO/SEA et gérons des campagnes publicitaires ciblées pour maximiser leur impact.",
            alignment: "right" as const
        },
        {
            image: card3,
            title: "Recrutement IT",
            description:
                "Nous sélectionnons des talents spécialisés en IT, évaluons leurs compétences et accompagnons leur intégration pour répondre efficacement aux besoins des entreprises.",
            alignment: "left" as const
        }
    ];

    return (
        <div className="p-4">
            <AppBaseTitle
                title="Nos Services"
                subtitle="Nous proposons une large gamme de services dans les domaines suivants :"
            />
            {services.map((service, index) => (
                <ServiceCard
                    key={index}
                    image={service.image}
                    title={service.title}
                    description={service.description}
                    alignment={service.alignment}
                />
            ))}
        </div>
    );
};

export default Service;
