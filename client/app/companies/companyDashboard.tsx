// ~/dashboard/company/CompanyDashboard.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiBriefcase, FiUsers, FiClock } from "react-icons/fi";
// import AppButton from "~/components/appButton";
import type { RootState } from "~/store";
// import { getAllJobsForCompany } from "~/store/sagas/jobSaga"; // Nouveau saga pour les offres de l'entreprise
// import { getAllJobApplicationsForCompany } from "~/store/sagas/jobApplySaga"; // Nouveau saga pour les candidatures de l'entreprise
import AppButton from "~/dashboard/components/appButton";

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector((state: RootState) => state.job.jobs);
  const jobApplications = useSelector((state: RootState) => state.jobApply.jobApplications);

  // useEffect(() => {
  //   dispatch(getAllJobsForCompany()); // Charger les offres de l'entreprise
  //   dispatch(getAllJobApplicationsForCompany()); // Charger les candidatures de l'entreprise
  // }, [dispatch]);

  const stats = [
    { label: "Offres Actives", value: jobs.filter(j => j.status === "active").length, icon: <FiBriefcase />, color: "bg-teal-100 text-teal-800" },
    { label: "Candidatures Reçues", value: jobApplications.length, icon: <FiUsers />, color: "bg-blue-100 text-blue-800" },
    { label: "En Attente", value: jobApplications.filter(ja => ja.status === "pending").length, icon: <FiClock />, color: "bg-yellow-100 text-yellow-800" },
  ];

  return (
    <div className="company-dashboard p-6">
      <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
        Tableau de Bord Entreprise
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-md ${stat.color} flex items-center`}>
            <div className="text-3xl mr-4">{stat.icon}</div>
            <div>
              <p className="text-sm font-bold">{stat.label}</p>
              <p className="text-2xl">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <AppButton
          label="Gérer les Offres"
          type="primary"
          size="md"
          onClick={() => navigate("/company/jobs")}
          className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
        />
        <AppButton
          label="Gérer les Candidatures"
          type="primary"
          size="md"
          onClick={() => navigate("/company/recruitment")}
          className="bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
        />
        <AppButton
          label="Profil Entreprise"
          type="secondary"
          size="md"
          outlined
          onClick={() => navigate("/company/profile")}
          className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text"
        />
      </div>
    </div>
  );
}