import {
    Eye,
    Pencil,
    Stethoscope,
    Trash2,
} from "lucide-react";

import type { Consultorio } from "@/types/consultorio";

interface ConsultorioTableProps {
    consultorios: Consultorio[];
    onView: (consultorio: Consultorio) => void;
    onEdit: (consultorio: Consultorio) => void;
    onDelete: (consultorio: Consultorio) => void;
}

export default function ConsultorioTable({
    consultorios,
    onView,
    onEdit,
    onDelete,
}: ConsultorioTableProps) {
    if (consultorios.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <Stethoscope
                        size={28}
                        className="text-blue-600"
                    />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                    No hay consultorios registrados
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                    Todavía no hay consultorios disponibles
                    para mostrar.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-900px">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Consultorio
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Ubicación
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Especialidades
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Capacidad
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Equipamiento
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {consultorios.map(
                            (consultorio) => (
                                <tr
                                    key={consultorio.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    {/* Consultorio */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {
                                                    consultorio.nombre
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Consultorio{" "}
                                                {
                                                    consultorio.numero
                                                }
                                            </p>
                                        </div>
                                    </td>

                                    {/* Ubicación */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                Piso{" "}
                                                {
                                                    consultorio.piso
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Ala{" "}
                                                {
                                                    consultorio.ala
                                                }
                                            </p>
                                        </div>
                                    </td>

                                    {/* Especialidades */}
                                    <td className="px-6 py-4">
                                        {consultorio
                                            .especialidades
                                            .length ===
                                        0 ? (
                                            <span className="text-sm text-slate-400">
                                                Sin
                                                especialidades
                                            </span>
                                        ) : (
                                            <div className="flex max-w-xs flex-wrap gap-1.5">
                                                {consultorio.especialidades
                                                    .slice(
                                                        0,
                                                        3
                                                    )
                                                    .map(
                                                        (
                                                            especialidad
                                                        ) => (
                                                            <span
                                                                key={
                                                                    especialidad.id
                                                                }
                                                                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                            >
                                                                {
                                                                    especialidad.nombre
                                                                }
                                                            </span>
                                                        )
                                                    )}

                                                {consultorio
                                                    .especialidades
                                                    .length >
                                                    3 && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                        +
                                                        {consultorio
                                                            .especialidades
                                                            .length -
                                                            3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* Capacidad */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-800">
                                            {
                                                consultorio.capacidad
                                            }{" "}
                                            {consultorio.capacidad ===
                                            1
                                                ? "persona"
                                                : "personas"}
                                        </span>
                                    </td>

                                    {/* Equipamiento */}
                                    <td className="px-6 py-4">
                                        {consultorio
                                            .equipamiento
                                            .length ===
                                        0 ? (
                                            <span className="text-sm text-slate-400">
                                                Sin
                                                equipamiento
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                {
                                                    consultorio
                                                        .equipamiento
                                                        .length
                                                }{" "}
                                                {consultorio
                                                    .equipamiento
                                                    .length ===
                                                1
                                                    ? "elemento"
                                                    : "elementos"}
                                            </span>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView(
                                                        consultorio
                                                    )
                                                }
                                                title="Ver consultorio"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        consultorio
                                                    )
                                                }
                                                title="Editar consultorio"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                            >
                                                <Pencil
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        consultorio
                                                    )
                                                }
                                                title="Eliminar consultorio"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}