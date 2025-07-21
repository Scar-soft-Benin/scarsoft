import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { getAllJobsForCompany } from "~/store/sagas/jobSaga";
import { getAllJobApplicationsForCompany } from "~/store/sagas/jobApplySaga";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CompanyAnalytics({ companyId }: { companyId: number }) {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.job.jobs);
  const jobApplications = useSelector((state: RootState) => state.jobApply.jobApplications);

  useEffect(() => {
    dispatch(getAllJobsForCompany({ companyId }));
    dispatch(getAllJobApplicationsForCompany({ companyId }));
  }, [dispatch, companyId]);

  const applicationsByJobData = {
    labels: jobs.map(job => job.title),
    datasets: [{
      label: "Candidatures par offre",
      data: jobs.map(job => jobApplications.filter(ja => ja.job_offer_id === job.id.toString()).length),
      backgroundColor: ["#2DD4BF", "#FBBF24", "#3B82F6"],
      borderColor: ["#1E7C6A", "#D97706", "#1D4ED8"],
      borderWidth: 1
    }]
  };

  const applicationsByStatusData = {
    labels: ["En attente", "Examinée", "Acceptée", "Rejetée"],
    datasets: [{
      label: "Candidatures par statut",
      data: [
        jobApplications.filter(ja => ja.status === "pending").length,
        jobApplications.filter(ja => ja.status === "reviewed").length,
        jobApplications.filter(ja => ja.status === "accepted").length,
        jobApplications.filter(ja => ja.status === "rejected").length,
      ],
      backgroundColor: ["#FBBF24", "#3B82F6", "#10B981", "#EF4444"],
      borderColor: ["#D97706", "#1D4ED8", "#059669", "#B91C1C"],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Nombre de candidatures" }
      },
      x: {
        title: { display: true, text: "Offres" }
      }
    },
    plugins: {
      legend: { display: false },
      title: { display: true, text: "" }
    }
  };

  return (
    <div className="company-analytics p-6">
      <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
        Statistiques de l'Entreprise
      </h2>
      <p className="text-neutral-light-secondary dark:text-neutral-dark-secondary mb-6">
        Consultez les statistiques détaillées de vos offres d'emploi et candidatures.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-dark-surface p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Candidatures par Offre</h3>
          <Bar data={applicationsByJobData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Candidatures par Offre" } } }} />
        </div>
        <div className="bg-white dark:bg-neutral-dark-surface p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Candidatures par Statut</h3>
          <Bar data={applicationsByStatusData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: "Candidatures par Statut" } } }} />
        </div>
      </div>
    </div>
  );
}