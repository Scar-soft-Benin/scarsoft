"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
    FaSpinner,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaEuroSign,
    FaArrowRight,
    FaBriefcase,
    FaSyncAlt
} from "react-icons/fa";
import AppBaseTitle from "~/components/appBaseTitle";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTag from "~/components/appBaseTag";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import { jobService, type ExtendedJobOffer } from "~/services/jobService";

const Careers = () => {
    const navigate = useNavigate();
    const cardsRef = useRef<HTMLDivElement>(null);
    const [jobOffers, setJobOffers] = useState<ExtendedJobOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadActiveJobs();
    }, []);

    const loadActiveJobs = async () => {
        try {
            setLoading(true);
            const data = await jobService.getActiveJobs();
            setJobOffers(data);
        } catch (err) {
            setError("Impossible de charger les offres d'emploi");
            console.error("Error loading jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cardsRef.current && !loading) {
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

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [jobOffers, loading]);

    const handleApply = (jobId: string) => {
        navigate(`/carriere-candidature/${jobId}`);
    };

    const getTagSeverity = (type: string) => {
        switch (type) {
            case "Recrutement":
                return "success";
            case "Stage":
                return "info";
            case "Freelance":
                return "warning";
            default:
                return "info";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AppBaseTitle
                    title="Carrières"
                    subtitle="Nous sommes toujours à la recherche de talents motivés pour renforcer notre équipe !"
                />
                <div className="container mx-auto px-6 py-12 text-center">
                    <FaSpinner className="text-green-500 text-3xl mb-4 animate-spin" />
                    <p className="text-gray-600">
                        Chargement des offres d'emploi...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <AppBaseTitle
                    title="Carrières"
                    subtitle="Nous sommes toujours à la recherche de talents motivés pour renforcer notre équipe !"
                />
                <div className="container mx-auto px-6 py-12 text-center">
                    <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Erreur de chargement
                    </h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <AppBaseButton
                        text="Réessayer"
                        type="first"
                        bgColor="bg-dime-green"
                        textColor="text-white"
                        onClick={loadActiveJobs}
                        className="font-semibold"
                        icon={<FaSyncAlt />}
                        iconPos="left"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <AppBaseTitle
                title="Carrières"
                subtitle="Nous sommes toujours à la recherche de talents motivés pour renforcer notre équipe !"
            />

            <div ref={cardsRef} className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {jobOffers.map((job) => (
                        <AppBaseCard
                            key={job.id}
                            className="job-card"
                            style={{
                                borderRadius: "12px",
                                backgroundColor: "white"
                            }}
                        >
                            <div className="p-6">
                                {/* En-tête avec tags */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2">
                                        <AppBaseTag
                                            value={job.type}
                                            severity={getTagSeverity(job.type)}
                                            className="text-xs font-semibold"
                                        />
                                        {job.contract && (
                                            <AppBaseTag
                                                value={job.contract}
                                                severity="secondary"
                                                className="text-xs"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Titre du poste */}
                                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2">
                                    {job.title}
                                </h3>
                                <div className="flex5 items-center gap-2 mb-3 text-gray-600">
                                    <FaMapMarkerAlt className="text-green-500" />
                                    <span className="text-sm">
                                        {job.location}
                                    </span>
                                </div>

                                {/* Aperçu de la mission */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {job.mission.length > 120
                                        ? `${job.mission.substring(0, 120)}...`
                                        : job.mission}
                                </p>

                                {/* Compétences (3 premières) */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills
                                            .slice(0, 3)
                                            .map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        {job.skills.length > 3 && (
                                            <span className="text-gray-500 text-xs py-1 px-2">
                                                +{job.skills.length - 3} autres
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Salaire si disponible */}
                                {job.salary && (
                                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                                        <FaEuroSign className="text-green-500" />
                                        <span className="text-sm font-medium">
                                            {job.salary}
                                        </span>
                                    </div>
                                )}

                                {/* Bouton Postuler */}
                                <div className="flex justify-end pt-2 border-t border-gray-100">
                                    <AppBaseButton
                                        text="Postuler"
                                        type="first"
                                        bgColor="bg-transparent"
                                        textColor="text-[#10b981]"
                                        onClick={() => handleApply(job.id)}
                                        className="font-semibold"
                                        icon={<FaArrowRight />}
                                        iconPos="right"
                                    />
                                </div>
                            </div>
                        </AppBaseCard>
                    ))}
                </div>

                {/* Message si aucune offre */}
                {jobOffers.length === 0 && (
                    <div className="text-center py-12">
                        <FaBriefcase className="text-gray-400 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Aucune offre disponible
                        </h3>
                        <p className="text-gray-500">
                            Revenez bientôt pour découvrir nos nouvelles
                            opportunités !
                        </p>
                    </div>
                )}
            </div>

            {/* CSS pour line-clamp */}
            <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default Careers;
