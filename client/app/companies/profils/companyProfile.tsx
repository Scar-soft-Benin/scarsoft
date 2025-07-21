// ~/dashboard/company/CompanyProfile.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "~/context/messageContext";
import CompanyForm from "~/companies/CompanyForm";
// import { getCompanyById, updateCompany } from "~/store/sagas/companySaga";
import type { RootState } from "~/store";
import AppButton from "~/dashboard/components/appButton";
// import AppButton from "~/components/appButton";

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const { addMessage } = useMessage();
  const company = useSelector((state: RootState) => state.company.currentCompany); // Supposons un state pour l'entreprise connectée
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   dispatch(getCompanyById({ id: "current" })); // Remplacer par l'ID de l'entreprise connectée
  // }, [dispatch]);

  const onSave = () => {
    setIsEditing(false);
    addMessage("Profil mis à jour avec succès", "success");
  };

  return (
    <div className="company-profile p-6">
      <h2 className="text-2xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
        Profil de l'Entreprise
      </h2>
      {isEditing ? (
        <CompanyForm
          onSave={onSave}
          onCancel={() => setIsEditing(false)}
          initialEmail={company?.email}
        />
      ) : (
        <div className="bg-white dark:bg-neutral-dark-surface p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold">{company?.name}</h3>
          <p><strong>Email :</strong> {company?.email}</p>
          <p><strong>Téléphone :</strong> {company?.phone}</p>
          <p><strong>Adresse :</strong> {company?.address}</p>
          <p><strong>Site web :</strong> {company?.website || "Non spécifié"}</p>
          <p><strong>Contact :</strong> {company?.contact_person}</p>
          <p><strong>Notes :</strong> {company?.notes || "Aucune note"}</p>
          <AppButton
            label="Modifier"
            type="primary"
            size="md"
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-teal-800 dark:bg-teal-400 text-white dark:text-neutral-dark-text"
          />
        </div>
      )}
    </div>
  );
}