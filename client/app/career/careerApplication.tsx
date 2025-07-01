import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    FaSpinner,
    FaArrowLeft,
    FaMapMarkerAlt,
    FaEuroSign,
    FaBullseye,
    FaCogs,
    FaUser,
    FaBuilding,
    FaEnvelope,
    FaPhone,
    FaInfoCircle,
} from "react-icons/fa";
import { CiStar, CiCircleCheck } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTag from "~/components/appBaseTag";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import { jobService, type ExtendedJobOffer } from "~/services/jobService";

const CareerApplication = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<ExtendedJobOffer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (jobId) {
            loadJob(jobId);
        } else {
            navigate("/carrieres");
        }
    }, [jobId, navigate]);

    const loadJob = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const jobData = await jobService.getJobById(id);

            if (jobData && jobData.status === "active") {
                setJob(jobData);
            } else if (jobData && jobData.status !== "active") {
                setError("Cette offre d'emploi n'est plus disponible.");
            } else {
                setError("Offre d'emploi non trouvée.");
            }
        } catch (err) {
            setError("Impossible de charger l'offre d'emploi.");
            console.error("Error loading job:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contentRef.current && job && !loading) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out"
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [job, loading]);

    const handleEmailApplication = () => {
        if (job) {
            const subject = `Candidature - ${job.title}`;
            const body = `Bonjour,\n\nJe souhaite postuler pour le poste de ${job.title}.\n\nVeuillez trouver ci-joint mon CV et ma lettre de motivation.\n\nCordialement.`;
            window.open(
                `mailto:rh@scar-soft.net?subject=${encodeURIComponent(
                    subject
                )}&body=${encodeURIComponent(body)}`
            );
        }
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-green-500 text-3xl mb-4 animate-spin" />
                    <p className="text-gray-600">Chargement de l'offre...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiAlertTriangle className="text-yellow-500 text-4xl mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {error || "Offre non trouvée"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "L'offre d'emploi que vous recherchez n'existe pas ou a été supprimée."}
                    </p>
                    <AppBaseButton
                        text="Retour aux carrières"
                        type="first"
                        bgColor="bg-green-500"
                        textColor="text-white"
                        onClick={() => navigate("/carrieres")}
                        icon={<FaArrowLeft />}
                        iconPos="left"
                        className="font-semibold"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with back button */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <AppBaseButton
                        text="Retour aux carrières"
                        type="first"
                        bgColor="bg-transparent"
                        textColor="text-[#10b981]"
                        onClick={() => navigate("/carrieres")}
                        icon={<FaArrowLeft />}
                        iconPos="left"
                        className="font-semibold"
                    />
                </div>
            </div>

            <div
                ref={contentRef}
                className="container mx-auto px-6 py-8 max-w-4xl"
            >
                {/* En-tête avec titre et tags */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <AppBaseTag
                            value={job.type}
                            severity={getTagSeverity(job.type)}
                            className="text-sm font-semibold"
                        />
                        {job.contract && (
                            <AppBaseTag
                                value={job.contract}
                                severity="secondary"
                                className="text-sm"
                            />
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {job.title}
                    </h1>

                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-green-500" />
                            <span>{job.location}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-2">
                                <FaEuroSign className="text-green-500" />
                                <span>{job.salary}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mission */}
                <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaBullseye className="text-green-500" />
                            Mission
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            {job.mission}
                        </p>
                    </div>
                </AppBaseCard>

                {/* Compétences et aptitudes exigées */}
                <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaCogs className="text-green-500" />
                            Compétences et aptitudes exigées
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Vous êtes à l’aise sur différentes technologies
                            parmi :
                        </p>
                        <ul className="space-y-2">
                            {job.skills.map((skill, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-gray-700"
                                >
                                    <CiCircleCheck className="text-green-500 text-sm" />
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </AppBaseCard>

                {/* Profil */}
                <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUser className="text-green-500" />
                            Profil
                        </h2>
                        <ul className="space-y-2">
                            {job.requirements.map((requirement, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-gray-700"
                                >
                                    <CiStar className="text-green-500 text-sm" />
                                    {requirement}
                                </li>
                            ))}
                        </ul>
                    </div>
                </AppBaseCard>

                {/* Lieu de travail */}
                <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-green-500" />
                            Lieu de travail
                        </h2>
                        <div className="flex items-center gap-2 text-gray-700">
                            <FaBuilding className="text-gray-500" />
                            <span className="font-medium">{job.location}</span>
                        </div>
                    </div>
                </AppBaseCard>

                {/* Candidature */}
                <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaEnvelope className="text-green-500" />
                            Candidature
                        </h2>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Rejoignez Scar-Soft</strong> en nous
                                envoyant votre CV + lettre de motivation et
                                références à l’adresse :{" "}
                                <a
                                    href="mailto:rh@scar-soft.net"
                                    className="text-green-600 hover:text-green-700 font-semibold underline"
                                >
                                    rh@scar-soft.net
                                </a>
                            </p>{" "}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <AppBaseButton
                                text="Postuler par email"
                                type="first"
                                bgColor="bg-green-500"
                                textColor="text-white"
                                onClick={handleEmailApplication}
                                icon={<FaEnvelope />}
                                iconPos="left"
                                className="flex-1"
                            />
                            <AppBaseButton
                                text="Contacter RH"
                                type="second"
                                bgColor="bg-transparent"
                                textColor="text-green-500"
                                onClick={() => navigate("/contactez-nous")}
                                icon={<FaPhone />}
                                iconPos="left"
                                className="flex-1 border-green-500"
                            />
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            <p className="flex items-center gap-2">
                                <FaInfoCircle className="text-gray-500" />
                                Nous vous répondrons dans les plus brefs délais.
                            </p>
                        </div>
                    </div>
                </AppBaseCard>
            </div>
        </div>
    );
};

export default CareerApplication;
