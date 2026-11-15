import {
    CalendarDays,
    Pill,
    Stethoscope,
    UserRound,
} from "lucide-react";

import { formatDateTime } from "@/components/shared/formatDate";

import type { MiHistoriaClinica } from "@/types/historia-clinica";

interface HistoriaClinicaCardProps {
    historia: MiHistoriaClinica;
}

function obtenerNombreMedico(
    medico: MiHistoriaClinica["medico"]
): string {
    if (!medico) {
        return "Médico no disponible";
    }

    return (
        [medico.nombre, medico.apellido]
            .filter(Boolean)
            .join(" ") || "Médico no disponible"
    );
}

export default function HistoriaClinicaCard({
    historia,
}: HistoriaClinicaCardProps) {
    const medico = historia.medico;
    const observaciones = historia.observaciones?.trim();
    const medicamentos = historia.recetario ?? [];

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {/* FECHA Y MÉDICO */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <CalendarDays size={18} />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Fecha de atención
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                            {formatDateTime(
                                historia.fechaAtencion
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <UserRound size={18} />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Médico responsable
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {obtenerNombreMedico(medico)}
                        </p>

                        {medico?.matricula && (
                            <p className="text-xs text-slate-500">
                                Matrícula {medico.matricula}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* OBSERVACIONES */}
            {observaciones && (
                <div className="mt-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Stethoscope
                            size={16}
                            className="text-slate-400"
                        />
                        Observaciones
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                        {observaciones}
                    </p>
                </div>
            )}

            {/* RECETARIO */}
            {medicamentos.length > 0 && (
                <div className="mt-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Pill
                            size={16}
                            className="text-slate-400"
                        />
                        Recetario
                    </h3>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {medicamentos.map(
                            (medicamento, indice) => (
                                <div
                                    key={`${historia.id}-${indice}`}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >
                                    <p className="break-words font-medium text-slate-900">
                                        {medicamento.nombre}
                                    </p>

                                    <p className="mt-0.5 break-words text-sm text-slate-600">
                                        {medicamento.dosis} ·{" "}
                                        {medicamento.frecuencia}
                                    </p>

                                    {(medicamento.duracion ||
                                        medicamento.indicaciones) && (
                                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                                            {medicamento.duracion && (
                                                <p className="break-words">
                                                    Duración:{" "}
                                                    {
                                                        medicamento.duracion
                                                    }
                                                </p>
                                            )}

                                            {medicamento.indicaciones && (
                                                <p className="break-words">
                                                    Indicaciones:{" "}
                                                    {
                                                        medicamento.indicaciones
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}
