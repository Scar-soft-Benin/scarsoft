import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import AppBaseTitle from "~/components/appBaseTitle";
import { gsap, ScrollTrigger } from "~/utils/gsap";

interface JobOffer {
    id: string;
    title: string;
    type: string;
    location: string;
    mission: string;
    skills: string[];
    requirements: string[];
    workLocation: string;
}

const jobOffers: JobOffer[] = [
    {
        id: "1",
        title: "Développeur Full-Stack Expérimenté H/F à Cotonou",
        type: "Recrutement",
        location: "Cotonou",
        mission: "Nous recherchons un développeur se full-stack senior et rigoureux se pour contribuer aux projets de fintech. En charge de certaines de nos fonctionnalités, vous organiserez votre expertise pour en garantir la qualité d'exécution et encadrez les développeurs junior qui contribuent au projet.",
        skills: [
            "Django / Django-Rest-Framework",
            "Node.js",
            "Vue.js",
            "React.js / Next",
            "Android (Java/Kotlin)",
            "HTML/CSS"
        ],
        requirements: [
            "Avoir au moins 3 ans d'expériences en tant que développeur Full-Stack",
            "Habiter Cotonou ou environs"
        ],
        workLocation: "Agla, Cotonou"
    },
    {
        id: "2",
        title: "Community managers à Cotonou",
        type: "Recrutement",
        location: "Cotonou",
        mission: "Nous recherchons un community manager créatif et dynamique pour gérer nos réseaux sociaux et développer notre présence en ligne.",
        skills: [
            "Maîtrise des réseaux sociaux",
            "Création de contenu",
            "Canva / Photoshop",
            "Stratégie digitale",
            "Rédaction web"
        ],
        requirements: [
            "Avoir au moins 2 ans d'expérience en community management",
            "Être créatif et avoir un bon sens de la communication",
            "Habiter Cotonou ou environs"
        ],
        workLocation: "Agla, Cotonou"
    },
    {
        id: "3",
        title: "Développeur Full-Stack Expérimenté H/F à Cotonou",
        type: "Recrutement",
        location: "Cotonou",
        mission: "Poste senior pour développeur expérimenté souhaitant rejoindre une équipe dynamique dans le secteur fintech.",
        skills: [
            "Python / Django",
            "JavaScript / TypeScript",
            "React / Vue.js",
            "Base de données (PostgreSQL, MongoDB)",
            "API REST",
            "Git / GitLab"
        ],
        requirements: [
            "5+ ans d'expérience en développement full-stack",
            "Expérience en fintech appréciée",
            "Habiter Cotonou ou environs"
        ],
        workLocation: "Agla, Cotonou"
    },
    {
        id: "4",
        title: "Développeur Full-Stack Expérimenté H/F à Cotonou",
        type: "Recrutement",
        location: "Cotonou",
        mission: "Rejoignez notre équipe pour développer des solutions innovantes dans le domaine des technologies financières.",
        skills: [
            "Frameworks modernes (React, Angular)",
            "Backend (Node.js, Python)",
            "Bases de données",
            "Cloud (AWS, Azure)",
            "DevOps / CI/CD"
        ],
        requirements: [
            "Diplôme en informatique ou équivalent",
            "Expérience confirmée en développement",
            "Esprit d'équipe et autonomie"
        ],
        workLocation: "Agla, Cotonou"
    }
];

const Careers = () => {
    const navigate = useNavigate();
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate cards with stagger
        if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll(".job-card");
            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }

        // Cleanup ScrollTrigger on unmount
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleApply = (jobId: string) => {
        navigate(`/carriere-candidature/${jobId}`);
    };

    const cardFooter = (jobId: string) => (
        <div className="flex justify-end">
            <Button
                label="Postuler"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="p-button-text p-button-success"
                onClick={() => handleApply(jobId)}
                style={{ 
                    color: '#10b981',
                    fontWeight: '600',
                    padding: '0.5rem 0'
                }}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <AppBaseTitle
                title="Carrières"
                subtitle="Nous sommes toujours à la recherche de talents motivés pour renforcer notre équipe !"
            />
            
            <div ref={cardsRef} className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {jobOffers.map((job) => (
                        <Card
                            key={job.id}
                            className="job-card shadow-lg hover:shadow-xl transition-shadow duration-300 border-0"
                            style={{
                                borderRadius: '12px',
                                backgroundColor: 'white'
                            }}
                            footer={cardFooter(job.id)}
                        >
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                                    {job.title}
                                </h3>
                                <div className="mb-4">
                                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {job.type}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Careers;