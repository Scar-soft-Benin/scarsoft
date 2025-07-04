// pages/Entreprises.tsx
import { useEffect, useState } from "react";
import Table, { type Column } from "../components/Table";
import { useNavigate } from "react-router";
import AppBaseButton from "~/components/appBaseButton";
import { FaBuilding } from "react-icons/fa";

interface Company {
    id: string;
    name: string;
    email: string;
    logo?: string;
    numberOfOffers: number;
}

export default function Entreprises() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        // Données fictives pour test
        setCompanies([
            {
                id: "1",
                name: "Scar-Soft",
                email: "contact@scar-soft.net",
                logo: "/images/scarsoft-logo.png",
                numberOfOffers: 5,
            },
            {
                id: "2",
                name: "WebFlex",
                email: "jobs@webflex.io",
                logo: "/images/webflex.png",
                numberOfOffers: 2,
            },
            {
                id: "3",
                name: "CodinoTech",
                email: "hr@codinotech.dev",
                numberOfOffers: 1,
            },
        ]);
    }, []);

    const columns: Column<Company>[] = [
        {
            header: "Nom",
            field: "name",
            render: (company) => (
                <div className="flex items-center gap-3">
                    {company.logo ? (
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                            {company.name[0]}
                        </div>
                    )}
                    <span className="font-medium text-gray-800">{company.name}</span>
                </div>
            ),
        },
        {
            header: "Email",
            field: "email",
        },
        {
            header: "Offres publiées",
            field: "numberOfOffers",
        },
        {
            header: "Action",
            field: "action",
            render: (row) => (
                <AppBaseButton
                    text="Voir les offres"
                    icon={<FaBuilding />}
                    type="first"
                    bgColor="bg-transparent"
                    textColor="text-green-600"
                    className="p-1 text-sm"
                    onClick={() => navigate(`/dashboard/company/${row.id}/jobs`)}
                //   onClick={() => console.log("Voir les offres de", row.name)}
                />
            ),
        },
    ];

    return (
        <div className=" ">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Liste des entreprises</h1>

            <Table
                data={companies}
                columns={columns}
                title="Entreprises avec offres publiées"
            // detailPath="/entreprises"
            />
        </div>
    );
}
