import {
    Ban,
    CheckCircle,
    Edit,
    MoreHorizontal,
    Stethoscope,
    Trash2,
} from "lucide-react";

import type { Especialidad } from "@/types/especialidad";

interface EspecialidadTableProps {
    especialidades: Especialidad[];
    onEdit?: (especialidad: Especialidad) => void;
    onToggleStatus?: (especialidad: Especialidad) => void;
    onDeletePermanent?: (especialidad: Especialidad) => void;
}

export default function EspecialidadTable({
    especialidades,
    onEdit,
    onToggleStatus,
    onDeletePermanent,
}: EspecialidadTableProps) {
    if (especialidades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <Stethoscope
                        size={28}
                        className="text-blue-600"
                    />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                    No hay especialidades
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                    Todavía no hay especialidades registradas
                    en el sistema.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-200">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {/* Especialidad */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Especialidad
                            </th>

                            {/* Código */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Código
                            </th>

                            {/* Descripción */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Descripción
                            </th>

                            {/* Estado */}
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Estado
                            </th>

                            {/* Acciones */}
                            <th className="w-40 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {especialidades.map(
                            (especialidad) => {
                                const isActive =
                                    especialidad.activo ===
                                    true;

                                return (
                                    <tr
                                        key={
                                            especialidad.id
                                        }
                                        className="group transition-colors hover:bg-slate-50/70"
                                    >
                                        {/* ========================= */}
                                        {/* NOMBRE */}
                                        {/* ========================= */}

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                        isActive
                                                            ? "bg-blue-50"
                                                            : "bg-slate-100"
                                                    }`}
                                                >
                                                    <Stethoscope
                                                        size={
                                                            19
                                                        }
                                                        className={
                                                            isActive
                                                                ? "text-blue-600"
                                                                : "text-slate-400"
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p
                                                        className={`truncate text-sm font-semibold ${
                                                            isActive
                                                                ? "text-slate-900"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        {
                                                            especialidad.nombre
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        ID:{" "}
                                                        {
                                                            especialidad.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ========================= */}
                                        {/* CÓDIGO */}
                                        {/* ========================= */}

                                        <td className="px-6 py-4">
                                            {especialidad.codigo ? (
                                                <span
                                                    className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide ${
                                                        isActive
                                                            ? "bg-purple-50 text-purple-700"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >
                                                    {
                                                        especialidad.codigo
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                    Sin
                                                    código
                                                </span>
                                            )}
                                        </td>

                                        {/* ========================= */}
                                        {/* DESCRIPCIÓN */}
                                        {/* ========================= */}

                                        <td className="max-w-md px-6 py-4">
                                            {especialidad.descripcion ? (
                                                <p
                                                    className={`line-clamp-2 text-sm ${
                                                        isActive
                                                            ? "text-slate-600"
                                                            : "text-slate-400"
                                                    }`}
                                                    title={
                                                        especialidad.descripcion
                                                    }
                                                >
                                                    {
                                                        especialidad.descripcion
                                                    }
                                                </p>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                    Sin
                                                    descripción
                                                </span>
                                            )}
                                        </td>

                                        {/* ========================= */}
                                        {/* ESTADO */}
                                        {/* ========================= */}

                                        <td className="px-6 py-4 text-center">
                                            {isActive ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Activa
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                    Inactiva
                                                </span>
                                            )}
                                        </td>

                                        {/* ========================= */}
                                        {/* ACCIONES */}
                                        {/* ========================= */}

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                {/* Editar */}
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit(
                                                                especialidad
                                                            )
                                                        }
                                                        title="Editar especialidad"
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Edit
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                )}

                                                {/* Activar / Anular */}
                                                {onToggleStatus && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onToggleStatus(
                                                                especialidad
                                                            )
                                                        }
                                                        title={
                                                            isActive
                                                                ? "Anular especialidad"
                                                                : "Activar especialidad"
                                                        }
                                                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors ${
                                                            isActive
                                                                ? "hover:bg-amber-50 hover:text-amber-600"
                                                                : "hover:bg-emerald-50 hover:text-emerald-600"
                                                        }`}
                                                    >
                                                        {isActive ? (
                                                            <Ban
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        ) : (
                                                            <CheckCircle
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                )}

                                                {/* Eliminar permanentemente */}
                                                {onDeletePermanent && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDeletePermanent(
                                                                especialidad
                                                            )
                                                        }
                                                        title="Eliminar permanentemente"
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                )}

                                                {!onEdit &&
                                                    !onToggleStatus &&
                                                    !onDeletePermanent && (
                                                        <MoreHorizontal
                                                            size={
                                                                18
                                                            }
                                                            className="text-slate-400"
                                                        />
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3">
                <p className="text-xs text-slate-500">
                    {especialidades.length === 1
                        ? "1 especialidad registrada"
                        : `${especialidades.length} especialidades registradas`}
                </p>
            </div>
        </div>
    );
}