import { useAuth } from "~/context/authContext";
import { useEffect, useState, type JSX } from "react";
import { FaBriefcase, FaUsers, FaBuilding, FaEnvelope } from "react-icons/fa";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import { useNavigate } from "react-router";

interface StatCardProps {
  icon: JSX.Element;
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}

const StatCard = ({ icon, label, value, color, onClick }: StatCardProps) => (
  <div
    className={`flex flex-col items-start p-5 rounded-xl shadow bg-white border-l-8 ${color} cursor-pointer hover:shadow-lg transition`}
    onClick={onClick}
  >
    <div className="text-gray-500 text-sm mb-1">{label}</div>
    <div className="flex items-center gap-4">
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
  </div>
);


export default function Overview() {
  const { user } = useAuth();


  const navigate = useNavigate();
  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    companies: 0,
    messages: 0,
  });

  useEffect(() => {
    // Simule des données récupérées via API
    setStats({
      jobs: 18,
      candidates: 46,
      companies: 7,
      messages: 12,
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Offres d'emploi"
          value={stats.jobs}
          icon={<FaBriefcase />}
          color="border-green-500"
          onClick={() => navigate("/dashboard/jobs")}
        />
        <StatCard
          label="Candidatures"
          value={stats.candidates}
          icon={<FaUsers />}
          color="border-blue-500"
          onClick={() => navigate("/dashboard/recruitments")}
        />
        <StatCard
          label="Entreprises"
          value={stats.companies}
          icon={<FaBuilding />}
          color="border-yellow-500"
          onClick={() => navigate("/dashboard/companies")}
        />
        <StatCard
          label="Messages"
          value={stats.messages}
          icon={<FaEnvelope />}
          color="border-red-500"
          onClick={() => navigate("/dashboard/contacts")}
        />
      </div>

      <AppBaseCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bienvenue 👋</h2>
        <p className="text-gray-600">
          Ce tableau de bord vous permet de gérer vos offres, suivre les candidatures,
          communiquer avec les entreprises et garder un œil sur toutes les activités.
        </p>
      </AppBaseCard>
    </div>
  );
}
