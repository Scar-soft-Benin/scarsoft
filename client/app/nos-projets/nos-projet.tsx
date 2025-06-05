import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import project1 from "./project_1.jpeg";
import project2 from "./project_2.jpeg";
import AppBaseTitle from "~/components/appBaseTitle";

const projects = [
    {
        image: project1,
        title: "Project 1 Title",
        subtitle: "Project 1 Subtitle"
    },
    {
        image: project2,
        title: "Project 2 Title",
        subtitle: "Project 2 Subtitle"
    },
    {
        image: project1,
        title: "Project 3 Title",
        subtitle: "Project 3 Subtitle"
    }
];

const NosProject = () => {
    const projectsRef = useRef<HTMLDivElement>(null);

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
    }, []);

    return (
        <div className="py-8 px-6">
            <AppBaseTitle
                title="Projets"
                subtitle="Nous avons collaboré avec de nombreuses entreprises à travers des projets novateurs"
            />

            <div
                ref={projectsRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="project-card flex flex-col items-center"
                    >
                        <img
                            src={project.image}
                            alt={`Project ${index + 1}`}
                            className="w-lg h-64 object-cover rounded-lg mb-4"
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
        </div>
    );
};

export default NosProject;
