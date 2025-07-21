import { useAuth } from "~/context/authContext";
import { useEffect, useState, type JSX } from "react";
import { FaBriefcase, FaUsers, FaBuilding, FaEnvelope } from "react-icons/fa";
import AppBaseCard from "~/components/appBaseCard";
import AppBaseButton from "~/components/appBaseButton";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import type { RootState } from "~/store";
import { getContactStatistics, getAllContacts } from "~/store/sagas/contactSaga";
import { getJobStatistics, getJobApplyStatistics, getCompanyStatistics } from "~/store/sagas/statisticsSaga";
import type { Contact } from "~/services/types/contact.types";

interface StatCardProps {
  icon: JSX.Element;
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}

const StatCard = ({ icon, label, value, color, onClick }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex flex-col items-start p-5 rounded-xl shadow bg-white border-l-8 ${color} cursor-pointer hover:shadow-lg transition`}
    onClick={onClick}
  >
    <div className="text-gray-500 text-sm mb-1">{label}</div>
    <div className="flex items-center gap-4">
      <motion.div
        className="text-3xl font-bold text-gray-800"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.div>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
  </motion.div>
);

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contactStats = useSelector((state: RootState) => state.contact.statistics);
  const contacts = useSelector((state: RootState) => state.contact.contacts);
  const jobStats = useSelector((state: RootState) => state.statistics?.job?.statistics || { total: 0 });
  const jobApplyStats = useSelector((state: RootState) => state.statistics?.jobApply?.statistics || { total: 0 });
  const companyStats = useSelector((state: RootState) => state.statistics?.company?.statistics || { total: 0 });

  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    companies: 0,
    messages: 0,
  });

  useEffect(() => {
    // Dispatch des actions pour récupérer les statistiques et les contacts
    dispatch(getContactStatistics());
    dispatch(getAllContacts());
    dispatch(getJobStatistics());
    dispatch(getJobApplyStatistics());
    dispatch(getCompanyStatistics());
  }, [dispatch]);

  useEffect(() => {
    // Mise à jour des stats à partir du store Redux
    setStats({
      jobs: jobStats.total || 0,
      candidates: jobApplyStats.total || 0,
      companies: companyStats.total || 0,
      messages: contactStats?.total || 0,
    });
  }, [contactStats, jobStats, jobApplyStats, companyStats]);

  // Calcul du taux de messages non lus
  const unreadMessages = Array.isArray(contacts) ? contacts.filter((contact: Contact) => contact.status === "unread").length : 0;
  const unreadPercentage = stats.messages > 0 ? Math.round((unreadMessages / stats.messages) * 100) : 0;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-gray-800"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Tableau de bord
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
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
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Widget : Taux de messages non lus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppBaseCard className="p-6">
            <motion.h2
              className="text-xl font-semibold text-gray-800 mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Messages non lus
            </motion.h2>
            <motion.div
              className="flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className={`text-4xl font-bold ${unreadMessages > 0 ? "text-red-500" : "text-green-500"}`}>
                {unreadMessages} ({unreadPercentage}%)
              </span>
            </motion.div>
            <motion.p
              className="text-gray-600 mt-2 text-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {unreadMessages > 0
                ? "Vous avez des messages non lus à traiter."
                : "Aucun message non lu pour le moment."}
            </motion.p>
            <div className="mt-4 flex justify-center">
              <AppBaseButton
                text="Voir les messages"
                type="first"
                // size="sm"
                onClick={() => navigate("/dashboard/contacts")} textColor={""} bgColor={""}              />
            </div>
          </AppBaseCard>
        </motion.div>

        {/* Widget : Derniers messages reçus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppBaseCard className="p-6">
            <motion.h2
              className="text-xl font-semibold text-gray-800 mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Derniers messages reçus
            </motion.h2>
            <div className="space-y-3">
              {Array.isArray(contacts) && contacts.length > 0 ? (
                contacts.slice(0, 3).map((contact: Contact, index: number) => (
                  <motion.div
                    key={contact.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => navigate("/dashboard/contacts")}
                  >
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">{contact.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs">{contact.subject}</p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{contact.created_at}</p>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-gray-600 dark:text-gray-400 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Aucun message reçu pour le moment.
                </motion.p>
              )}
            </div>
          </AppBaseCard>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AppBaseCard className="p-6">
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Bienvenue 👋
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ce tableau de bord vous permet de gérer vos offres, suivre les candidatures,
            communiquer avec les entreprises et garder un œil sur toutes les activités.
          </motion.p>
        </AppBaseCard>
      </motion.div>
    </motion.div>
  );
}