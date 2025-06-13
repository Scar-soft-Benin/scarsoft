'use client'

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Message } from "primereact/message";
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
            navigate('/carrieres');
        }
    }, [jobId, navigate]);

    const loadJob = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const jobData = await jobService.getJobById(id);
            
            if (jobData && jobData.status === 'active') {
                setJob(jobData);
            } else if (jobData && jobData.status !== 'active') {
                setError('Cette offre d\'emploi n\'est plus disponible.');
            } else {
                setError('Offre d\'emploi non trouvée.');
            }
        } catch (err) {
            setError('Impossible de charger l\'offre d\'emploi.');
            console.error('Error loading job:', err);
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
            window.open(`mailto:rh@scar-soft.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }
    };

    const getTagSeverity = (type: string) => {
        switch (type) {
            case 'Recrutement': return 'success';
            case 'Stage': return 'info';
            case 'Freelance': return 'warning';
            default: return 'info';
        }
    };

    // État de chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-green-500 text-3xl mb-4"></i>
                    <p className="text-gray-600">Chargement de l'offre...</p>
                </div>
            </div>
        );
    }

    // Erreur ou offre non trouvée
    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {error || 'Offre non trouvée'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || 'L\'offre d\'emploi que vous recherchez n\'existe pas ou a été supprimée.'}
                    </p>
                    <Button 
                        label="Retour aux carrières" 
                        icon="pi pi-arrow-left"
                        onClick={() => navigate('/carrieres')}
                        className="p-button-success"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header avec bouton retour */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Retour aux carrières"
                        className="p-button-text p-button-success"
                        onClick={() => navigate('/carrieres')}
                        style={{ color: '#10b981', fontWeight: '600' }}
                    />
                </div>
            </div>

            <div ref={contentRef} className="container mx-auto px-6 py-8 max-w-4xl">
                {/* En-tête avec titre et tags */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Tag 
                            value={job.type} 
                            severity={getTagSeverity(job.type)}
                            className="text-sm font-semibold"
                        />
                        {job.contract && (
                            <Tag 
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
                            <i className="pi pi-map-marker text-green-500"></i>
                            <span>{job.location}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-2">
                                <i className="pi pi-euro text-green-500"></i>
                                <span>{job.salary}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mission */}
                <Card className="mb-6 shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-target text-green-500"></i>
                            Mission
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            {job.mission}
                        </p>
                    </div>
                </Card>

                {/* Compétences et aptitudes exigées */}
                <Card className="mb-6 shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-cog text-green-500"></i>
                            Compétences et aptitudes exigées
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Vous êtes à l'aise sur différentes technologies parmi :
                        </p>
                        <ul className="space-y-2">
                            {job.skills.map((skill, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700">
                                    <i className="pi pi-check-circle text-green-500 text-sm"></i>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>

                {/* Profil */}
                <Card className="mb-6 shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-user text-green-500"></i>
                            Profil
                        </h2>
                        <ul className="space-y-2">
                            {job.requirements.map((requirement, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700">
                                    <i className="pi pi-star text-green-500 text-sm"></i>
                                    {requirement}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>

                {/* Lieu de travail */}
                <Card className="mb-6 shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-map-marker text-green-500"></i>
                            Lieu de travail
                        </h2>
                        <div className="flex items-center gap-2 text-gray-700">
                            <i className="pi pi-building text-gray-500"></i>
                            <span className="font-medium">{job.location}</span>
                        </div>
                    </div>
                </Card>

                {/* Candidature */}
                <Card className="mb-6 shadow-lg border-0" style={{ borderRadius: '12px' }}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="pi pi-send text-green-500"></i>
                            Candidature
                        </h2>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Rejoignez Scar-Soft</strong> en nous envoyant votre CV + lettre de motivation et références à l'adresse :{" "}
                                <a 
                                    href="mailto:rh@scar-soft.net" 
                                    className="text-green-600 hover:text-green-700 font-semibold underline"
                                >
                                    rh@scar-soft.net
                                </a>
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                label="Postuler par email"
                                icon="pi pi-envelope"
                                className="p-button-success flex-1"
                                onClick={handleEmailApplication}
                            />
                            <Button
                                label="Contacter RH"
                                icon="pi pi-phone"
                                className="p-button-outlined p-button-success flex-1"
                                onClick={() => navigate('/contactez-nous')}
                            />
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500">
                            <p>
                                <i className="pi pi-info-circle mr-2"></i>
                                Nous vous répondrons dans les plus brefs délais.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Message d'encouragement */}
                <Message 
                    severity="info" 
                    className="w-full"
                    content={
                        <div className="flex items-center gap-2">
                            <i className="pi pi-heart text-blue-500"></i>
                            <span>
                                Cette offre vous intéresse ? N'hésitez pas à postuler, nous serions ravis de vous rencontrer !
                            </span>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CareerApplication;