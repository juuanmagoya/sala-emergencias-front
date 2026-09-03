import {
    CalendarDays,
    FileText,
    Hash,
    Stethoscope,
} from "lucide-react";

import type { Especialidad } from "@/types/especialidad";

interface EspecialidadInfoCardProps {
    especialidad: Especialidad;
}

function formatDate(date?: string) {
    if (!date) return "No disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "No disponible";
    }

    return new Intl.DateTimeFormat("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);
}

export default function EspecialidadInfoCard({
    especialidad,
}: EspecialidadInfoCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                        <Stethoscope size={27} />
                    </div>

                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                            Especialidad médica
                        </p>

                        <h2 className="text-xl font-bold text-slate-900">
                            {especialidad.nombre}
                        </h2>

                        {especialidad.codigo && (
                            <span className="mt-2 inline-flex rounded-lg bg-white px-3 py-1 text-xs font-semibold tracking-wide text-purple-700 shadow-sm">
                                {especialidad.codigo}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Información */}
            <div className="grid gap-6 p-6 md:grid-cols-2">
                {/* Código */}
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                        <Hash
                            size={18}
                            className="text-purple-600"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Código
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                            {especialidad.codigo ||
                                "Sin código"}
                        </p>
                    </div>
                </div>

                {/* Descripción */}
                <div className="flex gap-3 md:col-span-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <FileText
                            size={18}
                            className="text-blue-600"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Descripción
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                            {especialidad.descripcion ||
                                "No hay una descripción registrada."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Fechas */}
            {(especialidad.createdAt ||
                especialidad.updatedAt) && (
                <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {especialidad.createdAt && (
                            <div className="flex items-center gap-3">
                                <CalendarDays
                                    size={17}
                                    className="text-slate-400"
                                />

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Creada
                                    </p>

                                    <p className="text-xs font-medium text-slate-600">
                                        {formatDate(
                                            especialidad.createdAt
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {especialidad.updatedAt && (
                            <div className="flex items-center gap-3">
                                <CalendarDays
                                    size={17}
                                    className="text-slate-400"
                                />

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Última actualización
                                    </p>

                                    <p className="text-xs font-medium text-slate-600">
                                        {formatDate(
                                            especialidad.updatedAt
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}