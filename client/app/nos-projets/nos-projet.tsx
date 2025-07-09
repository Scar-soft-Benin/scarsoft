import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import { useTranslation, Trans } from "react-i18next";

import project1 from "./project_1.jpeg";
import project2 from "./project_2.jpeg";
import project3 from "./projet3.jpg";
import project4 from "./projet4.jpg";
import project5 from "./projet5.jpg";
import project6 from "./projet6.jpg";

import AppBaseTitle from "~/components/appBaseTitle";
import AppBaseButton from "~/components/appBaseButton";

interface Project {
  image: string;
  title: string;
  subtitle: string;
  category: "web" | "mobile" | "ui-ux";
}

const NosProject = () => {
  const { t } = useTranslation();
  const projectsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const projects: Project[] = [
    {
      image: project1,
      title: t("projects.items.0.title"),
      subtitle: t("projects.items.0.subtitle"),
      category: "web"
    },
    {
      image: project2,
      title: t("projects.items.1.title"),
      subtitle: t("projects.items.1.subtitle"),
      category: "mobile"
    },
    {
      image: project3,
      title: t("projects.items.2.title"),
      subtitle: t("projects.items.2.subtitle"),
      category: "web"
    },
    {
      image: project4,
      title: t("projects.items.3.title"),
      subtitle: t("projects.items.3.subtitle"),
      category: "mobile"
    },
    {
      image: project5,
      title: t("projects.items.4.title"),
      subtitle: t("projects.items.4.subtitle"),
      category: "ui-ux"
    },
    {
      image: project6,
      title: t("projects.items.5.title"),
      subtitle: t("projects.items.5.subtitle"),
      category: "ui-ux"
    }
  ];

  const filterOptions = [
    { key: "all", label: t("projects.filters.all") },
    { key: "web", label: t("projects.filters.web") },
    { key: "mobile", label: t("projects.filters.mobile") },
    { key: "ui-ux", label: t("projects.filters.uiux") }
  ];

  useEffect(() => {
    handleFilterChange("all");
  }, []);

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

  useEffect(() => {
    if (projectsRef.current) {
      const projectCards = projectsRef.current.querySelectorAll(".project-card");
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProjects]);

  return (
    <div className="py-8 px-6">
      <AppBaseTitle
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
      />

      {/* Menu de filtrage */}
      <div className="flex flex-wrap justify-center gap-4 my-8">
        {filterOptions.map((option) => (
          <AppBaseButton
            key={option.key}
            text={option.label}
            type={activeFilter === option.key ? "first" : "second"}
            bgColor={activeFilter === option.key ? "bg-[#10b981]" : "bg-transparent"}
            textColor={activeFilter === option.key ? "text-white" : "text-[#10b981]"}
            className={`border-[#10b981] text-sm ${activeFilter !== option.key ? "border" : ""}`}
            onClick={() => handleFilterChange(option.key)}
          />
        ))}
      </div>

      {/* Compteur de projets */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          {/* <Trans
            i18nKey="projects.count"
            values={{
              count: filteredProjects.length,
              category:
                activeFilter !== "all"
                  ? filterOptions.find(opt => opt.key === activeFilter)?.label.toLowerCase()
                  : undefined
            }}
            components={{ bold: <strong /> }}
          >
            {{ count: filteredProjects.length }} project<strong>s</strong>
            <span className="ml-1">in {{ category }}</span>
          </Trans> */}
          <Trans
            i18nKey="projects.count"
            values={{
              count: filteredProjects.length,
              category:
                activeFilter !== "all"
                  ? filterOptions.find(opt => opt.key === activeFilter)?.label.toLowerCase()
                  : ""
            }}
            components={{ bold: <strong />, span: <span className="ml-1" /> }}
          />
        </p>
      </div>

      {/* Grille des projets */}
      <div
        ref={projectsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.map((project, index) => (
          <div key={`${project.category}-${index}`} className="project-card flex flex-col items-center">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
              loading="lazy"
              onError={(e) => {
                console.error("Erreur image:", project.image);
                e.currentTarget.style.display = "none";
              }}
            />
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-center text-gray-600">{project.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Aucun projet */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t("projects.empty")}
          </p>
        </div>
      )}
    </div>
  );
};

export default NosProject;
