import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import project1 from "./project_1.jpeg";
import project2 from "./project_2.jpeg";
import project3 from "./projet3.jpg";
import project4 from "./projet4.jpg";
import project5 from "./projet5.jpg";
import project6 from "./projet6.jpg";
import AppBaseTitle from "~/components/appBaseTitle";
import AppBaseButton from "~/components/appBaseButton"; // Adjust the import path as needed

// Types pour les projets
interface Project {
    image: string;
    title: string;
    subtitle: string;
    category: "web" | "mobile" | "ui-ux";
}

// Données des projets avec catégories
const projects: Project[] = [
    {
        image: project1,
        title: "Site E-commerce",
        subtitle: "Plateforme de vente en ligne moderne",
        category: "web"
    },
    {
        image: project2,
        title: "Application Blockchain",
        subtitle: "Interface de trading crypto",
        category: "mobile"
    },
    {
        image: project3,
        title: "Dashboard Analytics",
        subtitle: "Interface d'analyse de données",
        category: "web"
    },
    {
        image: project4,
        title: "App Mobile Stripe",
        subtitle: "Application de paiement mobile",
        category: "mobile"
    },
    {
        image: project5,
        title: "Wireframes UX",
        subtitle: "Conception d'expérience utilisateur",
        category: "ui-ux"
    },
    {
        image: project6,
        title: "Interface Tablet",
        subtitle: "Application tactile pour tablette",
        category: "ui-ux"
    }
];

// Configuration des filtres
const filterOptions = [
    { key: "all", label: "Afficher Tout" },
    { key: "web", label: "Sites Web" },
    { key: "mobile", label: "Applications Mobile" },
    { key: "ui-ux", label: "Conception UI/UX" }
];

const NosProject = () => {
    const projectsRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [filteredProjects, setFilteredProjects] =
        useState<Project[]>(projects);

    // Fonction de filtrage
    const handleFilterChange = (filterKey: string) => {
        setActiveFilter(filterKey);
        if (filterKey === "all") {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(
                (project) => project.category === filterKey
            );
            setFilteredProjects(filtered);
        }
    };

    // Animation GSAP
    useEffect(() => {
        if (projectsRef.current) {
            const projectCards =
                projectsRef.current.querySelectorAll(".project-card");
            if (projectCards.length > 0) {
                gsap.fromTo(
                    projectCards,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: projectsRef.current,
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
    }, [filteredProjects]);

    return (
        <div className="py-8 px-6">
            <AppBaseTitle
                title="Projets"
                subtitle="Nous avons collaboré avec de nombreuses entreprises à travers des projets novateurs"
            />

            {/* Menu de filtrage */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 my-8">
                {filterOptions.map((option) => (
                    <AppBaseButton
                        key={option.key}
                        text={option.label}
                        type={activeFilter === option.key ? "first" : "second"}
                        bgColor={
                            activeFilter === option.key
                                ? "bg-[#10b981]"
                                : "bg-transparent"
                        }
                        textColor={
                            activeFilter === option.key
                                ? "text-white"
                                : "text-[#10b981]"
                        }
                        className={`border-[#10b981] text-sm ${
                            activeFilter === option.key ? "" : "border"
                        }`}
                        onClick={() => handleFilterChange(option.key)}
                    />
                ))}
            </div>

            {/* Compteur de projets */}
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    {filteredProjects.length} projet
                    {filteredProjects.length > 1 ? "s" : ""}{" "}
                    {activeFilter !== "all" && (
                        <span className="ml-1">
                            dans{" "}
                            {filterOptions
                                .find((opt) => opt.key === activeFilter)
                                ?.label.toLowerCase()}
                        </span>
                    )}
                </p>
            </div>

            {/* Grille des projets */}
            <div
                ref={projectsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {filteredProjects.map((project, index) => (
                    <div
                        key={`${project.category}-${index}`}
                        className="project-card flex flex-col items-center"
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                            loading="lazy"
                            onLoad={() =>
                                console.log("Image chargée:", project.image)
                            }
                            onError={(e) => {
                                console.error(
                                    "Erreur de chargement image:",
                                    project.image
                                );
                                e.currentTarget.style.display = "none";
                            }}
                        />
                        <h3 className="text-xl font-semibold">
                            {project.title}
                        </h3>
                        <p className="text-center text-gray-600">
                            {project.subtitle}
                        </p>
                    </div>
                ))}
            </div>

            {/* Message si aucun projet */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        Aucun projet trouvé dans cette catégorie.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NosProject;
