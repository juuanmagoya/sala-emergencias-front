
import {
    CalendarDays,
    Clock,
    FileText,
    Stethoscope,
    UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Turno } from "@/types/turno";

// ============================================
// COMPONENTE DE INFORMACIÓN
// ============================================

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
}

export function InfoCard({ icon, label, value }: InfoCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-800">
                {value}
            </p>
        </div>
    );
}


interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function SectionHeader({
    icon,
    title,
    description,
}: SectionHeaderProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="text-xs text-slate-500">
                    {description}
                </p>
            </div>
        </div>
    );
}


// ============================================
// ESTADO DEL TURNO
// ============================================

function EstadoBadge({ estado }: { estado: Turno["estado"] }) {
    const estilos = {
        pendiente: "bg-amber-100 text-amber-700",
        atendido: "bg-emerald-100 text-emerald-700",
        cancelado: "bg-red-100 text-red-700",
    };

    const etiquetas = {
        pendiente: "Pendiente",
        atendido: "Atendido",
        cancelado: "Cancelado",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
        >
            {etiquetas[estado]}
        </span>
    );
}

// ============================================
// FORMATEAR FECHA Y HORA
// ============================================

function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

function formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface TurnoInfoCardsProps {
    turno: Turno;
}

export function TurnoInfoCards({ turno }: TurnoInfoCardsProps) {
    const nombrePaciente = turno.paciente.nombre;

    const nombreMedico = `Dr. ${turno.medico.nombre} ${turno.medico.apellido}`;

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Información del turno
                    </h3>
                    <p className="text-sm text-slate-500">
                        Detalles de la reserva médica.
                    </p>
                </div>

                <EstadoBadge estado={turno.estado} />
            </div>

            {/* Información principal */}
            <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                    icon={<UserRound size={16} />}
                    label="Paciente"
                    value={nombrePaciente}
                />

                <InfoCard
                    icon={<Stethoscope size={16} />}
                    label="Médico"
                    value={nombreMedico}
                />

                <InfoCard
                    icon={<Stethoscope size={16} />}
                    label="Especialidad"
                    value={turno.especialidad.nombre}
                />

                <InfoCard
                    icon={<CalendarDays size={16} />}
                    label="Fecha"
                    value={formatearFecha(turno.fechaTurno)}
                />

                <InfoCard
                    icon={<Clock size={16} />}
                    label="Horario"
                    value={`${formatearHora(turno.fechaTurno)} - ${formatearHora(turno.fechaFin)}`}
                />
            </div>

            {/* Observaciones */}
            {turno.observaciones && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                        <FileText size={16} />
                        <span className="text-xs font-medium uppercase tracking-wide">
                            Observaciones
                        </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-700">
                        {turno.observaciones}
                    </p>
                </div>
            )}
        </div>
    );
}
