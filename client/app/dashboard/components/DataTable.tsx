// components/DataTable.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "primereact/button";

interface Column {
  header: string;
  field: string;
  render?: (row: any) => JSX.Element; // Pour les colonnes personnalisées
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title: string;
}

export default function DataTable({ data, columns, title }: DataTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

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
            ease: "power3.out",
          }
        );
      }
    }
  }, [data]);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h2>
      <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              {columns.map((column) => (
                <th key={column.field} className="p-2 text-left text-gray-700 dark:text-gray-300">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t dark:border-gray-600">
                  {columns.map((column) => (
                    <td key={column.field} className="p-2 text-gray-700 dark:text-gray-300">
                      {column.render ? column.render(row) : row[column.field]}
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