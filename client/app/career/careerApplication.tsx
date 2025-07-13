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
  FaInfoCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { CiStar, CiCircleCheck } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import AppBaseTag from "~/components/appBaseTag";
import { gsap, ScrollTrigger } from "~/utils/gsap";
import CareerForm from "./careerForm";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { jobService } from "~/services/api/jobService";
import type { RootState } from "~/store";
import { setSingleJob } from "~/store/sagas/jobSaga";

const CareerApplication = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const job = useSelector((state: RootState) => state.job.singleJob);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJob(Number(jobId));
    } else {
      navigate("/carrieres");
    }
  }, [jobId, navigate]);

  const loadJob = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const jobData = await jobService.getJobById(id);
      if (jobData?.data?.data) {
        dispatch(setSingleJob(jobData.data.data));
      } else {
        setError(t("careerApplication.notAvailable"));
      }
    } catch (err) {
      setError(t("careerApplication.loadError"));
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [job, loading]);

  const handleEmailApplication = () => {
    if (job) {
      const subject = `${t("careerApplication.application")} - ${job.title}`;
      const body = `${t("careerApplication.emailBody", { title: job.title })}`;
      window.open(`mailto:rh@scar-soft.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const getTagSeverity = (type: string) => {
    switch (type) {
      case "Recrutement": return "success";
      case "Stage": return "info";
      case "Freelance": return "warning";
      default: return "info";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-green-500 text-3xl mb-4 animate-spin" />
          <p className="text-gray-600">{t("careerApplication.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertTriangle className="text-yellow-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || t("careerApplication.notFound")}</h2>
          <p className="text-gray-600 mb-6">{t("careerApplication.notFoundText")}</p>
          <AppBaseButton
            text={t("careerApplication.back")}
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
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <AppBaseButton
              text={t("careerApplication.back")}
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

        <div ref={contentRef} className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <AppBaseTag value={job.type} severity={getTagSeverity(job.type)} className="text-sm font-semibold" />
              {job.contract && <AppBaseTag value={job.contract} severity="secondary" className="text-sm" />}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{job.title}</h1>
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

          <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaBullseye className="text-green-500" />
                {t("careerApplication.mission")}
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">{job.mission}</p>
            </div>
          </AppBaseCard>

          <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCogs className="text-green-500" />
                {t("careerApplication.skills")}
              </h2>
              <ul className="space-y-2">
                {job.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <CiCircleCheck className="text-green-500 text-sm" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </AppBaseCard>

          <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-green-500" />
                {t("careerApplication.profile")}
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CiStar className="text-green-500 text-sm" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </AppBaseCard>

          <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" />
                {t("careerApplication.location")}
              </h2>
              <div className="flex items-center gap-2 text-gray-700">
                <FaBuilding className="text-gray-500" />
                <span className="font-medium">{job.location}</span>
              </div>
            </div>
          </AppBaseCard>

          <AppBaseCard className="mb-6" style={{ borderRadius: "12px" }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-green-500" />
                {t("careerApplication.application")}
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  <Trans i18nKey="careerApplication.instruction">
                    <strong>Rejoignez Scar-Soft</strong> en nous envoyant votre CV + lettre de motivation à
                    <a href="mailto:rh@scar-soft.net">rh@scar-soft.net</a>.
                  </Trans>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <AppBaseButton
                  text={t("careerApplication.emailApply")}
                  type="first"
                  bgColor="bg-green-500"
                  textColor="text-white"
                  onClick={handleEmailApplication}
                  icon={<FaEnvelope />}
                  iconPos="left"
                  className="flex-1"
                />
                <AppBaseButton
                  text={t("careerApplication.directApply")}
                  type="second"
                  bgColor="bg-transparent"
                  textColor="text-green-500"
                  onClick={() => setShowDialog(true)}
                  icon={<FaPaperPlane />}
                  iconPos="left"
                  className="flex-1 border-green-500"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <FaInfoCircle className="text-gray-500" />
                  {t("careerApplication.responseInfo")}
                </p>
              </div>
            </div>
          </AppBaseCard>
        </div>
      </div>

      <CareerForm
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        jobId={job.id}
      />
    </>
  );
};

export default CareerApplication;
