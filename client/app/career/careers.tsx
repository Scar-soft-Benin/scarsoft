"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
    FaSpinner,
    FaMapMarkerAlt,
    FaEuroSign,
    FaArrowRight,
    FaBriefcase
} from "react-icons/fa";
import AppBaseTitle from "~/components/appBaseTitle";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTag from "~/components/appBaseTag";
import type { RootState } from "~/store";
import { getAllJobs } from "~/store/sagas/jobSaga";
import type { Job } from "~/services/types/job.types";

const Careers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jobOffers = useSelector((state: RootState) => state.job.jobs);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getAllJobs());
        const delay = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(delay);
    }, [dispatch]);

    const handleApply = (jobId: number) => {
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

    return (
        <div className="min-h-screen">
            <AppBaseTitle
                title="Carrières"
                subtitle="Nous sommes toujours à la recherche de talents motivés pour renforcer notre équipe !"
            />

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {jobOffers.map((job: Job, index: number) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: index * 0.2
                            }}
                            className="job-card"
                        >
                            <AppBaseCard
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "white"
                                }}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            <AppBaseTag
                                                value={job.type}
                                                severity={getTagSeverity(
                                                    job.type
                                                )}
                                                className="text-xs font-semibold"
                                            />
                                            {"contract" in job &&
                                                job.contract && (
                                                    <AppBaseTag
                                                        value={job.contract}
                                                        severity="secondary"
                                                        className="text-xs"
                                                    />
                                                )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        <span className="text-sm">
                                            {job.location}
                                        </span>
                                    </div>

                                    {"mission" in job && job.mission && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {job.mission.length > 120
                                                ? `${job.mission.substring(
                                                      0,
                                                      120
                                                  )}...`
                                                : job.mission}
                                        </p>
                                    )}

                                    {Array.isArray(job.skills) &&
                                        job.skills.length > 0 && (
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
                                                            +
                                                            {job.skills.length -
                                                                3}{" "}
                                                            autres
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {job.salary && (
                                        <div className="flex items-center gap-2 mb-4 text-gray-600">
                                            <FaEuroSign className="text-green-500" />
                                            <span className="text-sm font-medium">
                                                {job.salary}
                                            </span>
                                        </div>
                                    )}

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
                        </motion.div>
                    ))}
                </div>

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
