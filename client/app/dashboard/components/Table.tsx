// components/Table.tsx
import { useEffect, useRef, useState, type JSX } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router";

export interface Column<T> {
    header: string;
    field: keyof T | string;
    render?: (row: T) => JSX.Element;
    filterable?: boolean; // New: Enable filtering for this column
    sortable?: boolean; // Optional: For future sorting support
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    title: string;
    detailPath?: string;
    globalFilterFields?: (keyof T)[]; // Fields for global filtering
}

export default function Table<T extends { id: string }>({
    data,
    columns,
    title,
    detailPath,
    globalFilterFields
}: TableProps<T>) {
    const tableRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [globalFilter, setGlobalFilter] = useState<string>("");

    useEffect(() => {
        if (tableRef.current) {
            const rows = tableRef.current.querySelectorAll("tr");
            if (rows.length > 0) {
                gsap.fromTo(
                    rows,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power3.out"
                    }
                );
            }
        }
    }, [data]);

    const handleRowClick = (row: T) => {
        if (detailPath) {
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

    const filteredData = data.filter((row) => {
        // Apply global filter
        const matchesGlobal =
            !globalFilter || !globalFilterFields
                ? true
                : globalFilterFields.some((field) =>
                      String(row[field])
                          .toLowerCase()
                          .includes(globalFilter.toLowerCase())
                  );

        // Apply column filters
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
            <div className="mb-4">
                <input
                    type="search"
                    value={globalFilter}
                    onChange={handleGlobalFilterChange}
                    placeholder="Rechercher..."
                    className="w-full sm:w-64 p-2 border border-neutral-light-border dark:border-neutral-dark-border rounded-md text-neutral-light-text dark:text-neutral-dark-text bg-neutral-light-surface dark:bg-neutral-dark-surface focus:ring-primary focus:border-primary"
                />
            </div>
            <div
                ref={tableRef}
                className="bg-neutral-light-surface dark:bg-neutral-dark-surface rounded-lg shadow-md"
            >
                <table className="w-full">
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
                            filteredData.map((row) => (
                                <tr
                                    key={row.id}
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
                                                : (row[
                                                      column.field as keyof T
                                                  ] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
