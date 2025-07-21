// ~/components/Table.tsx
import { useEffect, useRef, useState, type JSX } from "react";
import { motion, useAnimate } from "framer-motion";
import { useNavigate } from "react-router";
import AppButton from "./appButton";

export interface Column<T> {
    header: string;
    field: keyof T | string;
    render?: (row: T) => JSX.Element;
    filterable?: boolean;
    sortable?: boolean;
}

interface TableProps<T> {
    data: T[] | undefined | null;
    columns: Column<T>[];
    title: string;
    detailPath?: string;
    globalFilterFields?: (keyof T)[];
    meta?: {
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
    };
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

export default function Table<T extends object>({
    data,
    columns,
    title,
    detailPath,
    globalFilterFields,
    meta,
    onPageChange,
    onPerPageChange
}: TableProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate();
    const [scope, animate] = useAnimate();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [globalFilter, setGlobalFilter] = useState<string>("");

    useEffect(() => {
        if (containerRef.current) {
            const rows = Array.from(
                containerRef.current.querySelectorAll("tbody tr")
            );
            rows.forEach((row, i) => {
                animate(
                    row,
                    { opacity: [0, 1], y: [20, 0] },
                    { duration: 0.5, delay: i * 0.1, ease: "easeOut" }
                );
            });
        }
    }, [data, animate]);

    const handleRowClick = (row: T) => {
        if (
            detailPath &&
            "id" in row &&
            (typeof row.id === "string" || typeof row.id === "number")
        ) {
            navigate(`${detailPath}/${row.id}`);
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleGlobalFilterChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setGlobalFilter(e.target.value);
    };
    // Ensure data is an array, fallback to empty array if undefined or null
    const validData = Array.isArray(data) ? data : [];

    const filteredData = validData.filter((row) => {
        const matchesGlobal =
            !globalFilter || !globalFilterFields
                ? true
                : globalFilterFields.some((field) =>
                      String(row[field])
                          .toLowerCase()
                          .includes(globalFilter.toLowerCase())
                  );

        const matchesFilters = Object.entries(filters).every(
            ([field, value]) => {
                if (!value) return true;
                return String(row[field as keyof T])
                    .toLowerCase()
                    .includes(value.toLowerCase());
            }
        );

        return matchesGlobal && matchesFilters;
    });

    return (
        <div className="py-6">
            <h2 className="text-xl font-bold text-neutral-light-text dark:text-neutral-dark-text mb-4">
                {title}
            </h2>
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <input
                    type="search"
                    value={globalFilter}
                    onChange={handleGlobalFilterChange}
                    placeholder="Rechercher..."
                    className="w-full sm:w-64 p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
                />
                {meta && (
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-light-text dark:text-neutral-dark-text">
                            Éléments par page:
                        </span>
                        <select
                            value={meta.per_page}
                            onChange={(e) =>
                                onPerPageChange?.(Number(e.target.value))
                            }
                            className="p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
                        >
                            {[10, 15, 25, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div
                ref={containerRef}
                className="bg-neutral-light-surface dark:bg-neutral-dark-surface rounded-lg shadow-md"
            >
                <motion.table className="w-full" ref={scope}>
                    <thead>
                        <tr className="bg-neutral-light-bg dark:bg-neutral-dark-bg">
                            {columns.map((column) => (
                                <th
                                    key={column.field as string}
                                    className="p-2 text-left text-neutral-light-text dark:text-neutral-dark-text"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-neutral-light-bg dark:bg-neutral-dark-bg">
                            {columns.map((column) => (
                                <th
                                    key={`${String(column.field)}-filter`}
                                    className="p-2"
                                >
                                    {column.filterable ? (
                                        <input
                                            type="text"
                                            value={
                                                filters[
                                                    column.field as string
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    column.field as string,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Filtrer ${column.header}`}
                                            className="w-full p-1 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
                                        />
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="p-4 text-center text-neutral-light-secondary dark:text-neutral-dark-secondary"
                                >
                                    Aucune donnée disponible
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, index) => (
                                <tr
                                    key={
                                        "id" in row &&
                                        (typeof row.id === "string" ||
                                            typeof row.id === "number")
                                            ? String(row.id)
                                            : index
                                    }
                                    className="border-t border-neutral-light-border dark:border-neutral-dark-border hover:bg-neutral-light-bg dark:hover:bg-neutral-dark-bg cursor-pointer"
                                    onClick={() => handleRowClick(row)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.field as string}
                                            className="p-2 text-neutral-light-text dark:text-neutral-dark-text"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : String(
                                                      row[
                                                          column.field as keyof T
                                                      ] ?? ""
                                                  )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </motion.table>
            </div>
            {meta && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-neutral-light-text dark:text-neutral-dark-text">
                        Affichage de {filteredData.length} sur {meta.total}{" "}
                        éléments
                    </div>
                    <div className="flex gap-2">
                        <AppButton
                            label="Précédent"
                            type="secondary"
                            size="sm"
                            disabled={meta.current_page === 1}
                            onClick={() =>
                                onPageChange?.(meta.current_page - 1)
                            }
                            className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text"
                        />
                        <span className="text-neutral-light-text dark:text-neutral-dark-text">
                            Page {meta.current_page} sur {meta.last_page}
                        </span>
                        <AppButton
                            label="Suivant"
                            type="secondary"
                            size="sm"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() =>
                                onPageChange?.(meta.current_page + 1)
                            }
                            className="bg-amber-100 dark:bg-amber-300 text-neutral-light-text dark:text-neutral-dark-text"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
