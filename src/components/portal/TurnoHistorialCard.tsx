import {
    CalendarDays,
    FileText,
    Stethoscope,
    UserRound,
} from "lucide-react";

import {
    formatFechaLargaArgentina,
    formatHoraArgentina,
} from "@/components/shared/formatDate";

import { cn } from "@/lib/utils";

import {
    normalizarEstadoTurno,
    obtenerTimestamp,
} from "@/lib/turnosHistorial";

import type {
    EstadoTurno,
    MiTurnoHistorial,
} from "@/types/turno";

const ETIQUETAS_ESTADO: Record<EstadoTurno, string> = {
    pendiente: "Pendiente",
    atendido: "Atendido",
    cancelado: "Cancelado",
};

const ESTILOS_ESTADO: Record<EstadoTurno, string> = {
    pendiente: "bg-amber-50 text-amber-700 ring-amber-200",
    atendido:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelado: "bg-red-50 text-red-700 ring-red-200",
};

const ESTILO_SIN_ESTADO =
    "bg-slate-100 text-slate-600 ring-slate-200";

interface EstadoBadgeProps {
    estado: EstadoTurno | null;
}

function EstadoBadge({ estado }: EstadoBadgeProps) {
    const etiqueta = estado
        ? ETIQUETAS_ESTADO[estado]
        : "Sin estado";

    return (
        <span
            aria-label={`Estado del turno: ${etiqueta}`}
            className={cn(
                "inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                estado
                    ? ESTILOS_ESTADO[estado]
                    : ESTILO_SIN_ESTADO
            )}
        >
            {etiqueta}
        </span>
    );
}

function obtenerNombreMedico(
    medico: MiTurnoHistorial["medico"]
): string {
    if (!medico) {
        return "Médico no disponible";
    }

    return (
        [medico.nombre, medico.apellido]
            .map((parte) => parte?.trim())
            .filter(Boolean)
            .join(" ") || "Médico no disponible"
    );
}

function obtenerNombreEspecialidad(
    especialidad: MiTurnoHistorial["especialidad"]
): string {
    const nombre = especialidad?.nombre?.trim();

    return nombre || "Especialidad no disponible";
}

interface TurnoHistorialCardProps {
    turno: MiTurnoHistorial;
}

export default function TurnoHistorialCard({
    turno,
}: TurnoHistorialCardProps) {
    const estado = normalizarEstadoTurno(turno.estado);

    const timestampInicio = obtenerTimestamp(
        turno.fechaTurno
    );

    const timestampFin = obtenerTimestamp(turno.fechaFin);

    const fecha =
        timestampInicio === null
            ? "Fecha no disponible"
            : formatFechaLargaArgentina(turno.fechaTurno);

    const horaInicio =
        timestampInicio === null
            ? ""
            : formatHoraArgentina(turno.fechaTurno);

    const horaFin =
        timestampInicio !== null &&
        timestampFin !== null &&
        timestampFin >= timestampInicio
            ? formatHoraArgentina(turno.fechaFin)
            : "";

    const horario =
        timestampInicio === null
            ? "Horario no disponible"
            : horaFin
              ? `${horaInicio} a ${horaFin}`
              : horaInicio;

    const medico = turno.medico;
    const nombreMedico = obtenerNombreMedico(medico);
    const matricula = medico?.matricula?.trim();
    const especialidad = obtenerNombreEspecialidad(
        turno.especialidad
    );
    const observaciones = turno.observaciones?.trim();

    return (
        <article
            aria-label={`Turno del ${fecha}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
            {/* FECHA, HORARIO Y ESTADO */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <CalendarDays size={18} />
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Fecha del turno
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                            {fecha}
                        </p>

                        <p className="mt-0.5 text-sm text-slate-500">
                            {horario}
                        </p>
                    </div>
                </div>

                <EstadoBadge estado={estado} />
            </div>

            {/* ESPECIALIDAD Y MÉDICO */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Stethoscope size={17} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Especialidad
                        </p>

                        <p className="mt-1 break-words text-sm font-medium text-slate-900">
                            {especialidad}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <UserRound size={17} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Médico
                        </p>

                        <p className="mt-1 break-words text-sm font-medium text-slate-900">
                            {nombreMedico}
                        </p>

                        {matricula && (
                            <p className="mt-0.5 break-words text-xs text-slate-500">
                                Matrícula {matricula}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* OBSERVACIONES */}
            {observaciones && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <FileText
                            size={15}
                            className="text-slate-400"
                        />
                        Observaciones
                    </h3>

                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                        {observaciones}
                    </p>
                </div>
            )}
        </article>
    );
}
