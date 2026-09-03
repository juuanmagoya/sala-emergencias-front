import {
    Ban,
    CheckCircle2,
    Eye,
    Pencil,
    Trash2,
    UserRound,
} from "lucide-react";

import type { Medico } from "@/types/medico";

interface MedicoTableProps {
    medicos: Medico[];
    onView: (medico: Medico) => void;
    onEdit: (medico: Medico) => void;
    onToggleStatus: (medico: Medico) => void;
    onDeletePermanent: (medico: Medico) => void;
}

export default function MedicoTable({
    medicos,
    onView,
    onEdit,
    onToggleStatus,
    onDeletePermanent,
}: MedicoTableProps) {
    if (medicos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <UserRound
                        size={28}
                        className="text-blue-600"
                    />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                    No hay médicos
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                    Todavía no hay médicos registrados
                    en el sistema.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-250">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {/* MÉDICO */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Médico
                            </th>

                            {/* MATRÍCULA */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Matrícula
                            </th>

                            {/* ESPECIALIDAD */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Especialidad
                            </th>

                            {/* TELÉFONO */}
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Teléfono
                            </th>

                            {/* ESTADO */}
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Estado
                            </th>

                            {/* ACCIONES */}
                            <th className="w-44 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {medicos.map((medico) => {
                            const isActive =
                                medico.activo === true;

                            return (
                                <tr
                                    key={medico.id}
                                    className="group transition-colors hover:bg-slate-50/70"
                                >
                                    {/* ========================= */}
                                    {/* MÉDICO */}
                                    {/* ========================= */}

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                    isActive
                                                        ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                                                        : "bg-slate-100 text-slate-400"
                                                }`}
                                            >
                                                {`${medico.nombre?.charAt(0) ?? ""}${
                                                    medico.apellido?.charAt(
                                                        0
                                                    ) ?? ""
                                                }`.toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <p
                                                    className={`truncate text-sm font-semibold ${
                                                        isActive
                                                            ? "text-slate-900"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    {medico.nombre}{" "}
                                                    {medico.apellido}
                                                </p>

                                                <p className="truncate text-xs text-slate-400">
                                                    {medico.email ??
                                                        "Sin email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* ========================= */}
                                    {/* MATRÍCULA */}
                                    {/* ========================= */}

                                    <td className="px-6 py-4">
                                        {medico.matricula ? (
                                            <span
                                                className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide ${
                                                    isActive
                                                        ? "bg-purple-50 text-purple-700"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {
                                                    medico.matricula
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-sm text-slate-400">
                                                Sin matrícula
                                            </span>
                                        )}
                                    </td>

                                    {/* ========================= */}
                                    {/* ESPECIALIDAD */}
                                    {/* ========================= */}

                                    <td className="px-6 py-4">
                                        <div>
                                            <p
                                                className={`text-sm font-medium ${
                                                    isActive
                                                        ? "text-slate-700"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {medico.especialidad
                                                    ?.nombre ??
                                                    "Sin especialidad"}
                                            </p>

                                            {medico.especialidad
                                                ?.codigo && (
                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    Código:{" "}
                                                    {
                                                        medico
                                                            .especialidad
                                                            .codigo
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* ========================= */}
                                    {/* TELÉFONO */}
                                    {/* ========================= */}

                                    <td className="px-6 py-4">
                                        {medico.telefono ? (
                                            <span
                                                className={`text-sm ${
                                                    isActive
                                                        ? "text-slate-600"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                (
                                                {
                                                    medico
                                                        .telefono
                                                        .codigoArea
                                                }
                                                ){" "}
                                                {
                                                    medico
                                                        .telefono
                                                        .numero
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-sm text-slate-400">
                                                Sin teléfono
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
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                Inactivo
                                            </span>
                                        )}
                                    </td>

                                    {/* ========================= */}
                                    {/* ACCIONES */}
                                    {/* ========================= */}

                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            {/* VER */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView(
                                                        medico
                                                    )
                                                }
                                                title="Ver médico"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Eye
                                                    size={17}
                                                />
                                            </button>

                                            {/* EDITAR */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        medico
                                                    )
                                                }
                                                title="Editar médico"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                            >
                                                <Pencil
                                                    size={17}
                                                />
                                            </button>

                                            {/* ACTIVAR / DESACTIVAR */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onToggleStatus(
                                                        medico
                                                    )
                                                }
                                                title={
                                                    isActive
                                                        ? "Desactivar médico"
                                                        : "Activar médico"
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
                                                    <CheckCircle2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}
                                            </button>

                                            {/* ELIMINAR */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDeletePermanent(
                                                        medico
                                                    )
                                                }
                                                title="Eliminar permanentemente"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-3">
                <p className="text-xs text-slate-500">
                    {medicos.length === 1
                        ? "1 médico registrado"
                        : `${medicos.length} médicos registrados`}
                </p>
            </div>
        </div>
    );
}

/**
 * Estado vacío
 */
export function EmptyState({
    search,
    onCreate,
}: {
    search: string;
    onCreate: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <UserRound
                    size={28}
                    className="text-slate-400"
                />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
                {search
                    ? "No se encontraron médicos"
                    : "No hay médicos registrados"}
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
                {search
                    ? "Probá con otro nombre, apellido, matrícula o especialidad."
                    : "Los médicos aparecerán aquí cuando sean registrados."}
            </p>

            {!search && (
                <button
                    type="button"
                    onClick={onCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                >
                    <UserRound size={17} />
                    Registrar primer médico
                </button>
            )}
        </div>
    );
}