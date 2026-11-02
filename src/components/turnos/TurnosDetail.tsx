
import {
    CalendarDays,
    Clock,
    FileText,
    IdCard,
    Mail,
    Stethoscope,
    UserRound,
} from "lucide-react";

import type { Turno } from "@/types/turno";

import {
    InfoCard,
    SectionHeader,
} from "@/components/turnos/TurnoInfoCards";

import { formatDate } from "@/components/shared/formatDate";

// ============================================
// ESTADO DEL TURNO
// ============================================

function EstadoBadge({ estado }: { estado: Turno["estado"] }) {
    const estilos = {
        pendiente: "bg-amber-50 text-amber-700",
        atendido: "bg-emerald-50 text-emerald-700",
        cancelado: "bg-red-50 text-red-700",
    };

    const etiquetas = {
        pendiente: "Pendiente",
        atendido: "Atendido",
        cancelado: "Cancelado",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${estilos[estado]}`}
        >
            {etiquetas[estado]}
        </span>
    );
}

// ============================================
// FORMATEAR FECHAS
// ============================================

function formatTime(fecha: string): string {
    return new Date(fecha).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

// ============================================
// PROPS
// ============================================

interface TurnosDetailProps {
    turno: Turno;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function TurnosDetail({ turno }: TurnosDetailProps) {
    const iniciales = turno.paciente.nombre
        .split(" ")
        .slice(0, 2)
        .map((parte) => parte.charAt(0))
        .join("")
        .toUpperCase();

    const nombreMedico =
        `Dr. ${turno.medico.nombre} ${turno.medico.apellido}`;

    return (
        <div className="space-y-6">

            {/* PERFIL DEL PACIENTE */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">
                        {iniciales}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                                {turno.paciente.nombre}
                            </h2>

                            <EstadoBadge estado={turno.estado} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <IdCard className="h-4 w-4" />
                                DNI {turno.paciente.dni}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {turno.paciente.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DEL TURNO */}

            <section className="space-y-3">
                <SectionHeader
                    icon={<CalendarDays className="h-4 w-4" />}
                    title="Información del turno"
                    description="Fecha, horario y especialidad de la reserva."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Fecha"
                        value={formatDate(turno.fechaTurno)}
                    />

                    <InfoCard
                        icon={<Clock className="h-4 w-4" />}
                        label="Horario"
                        value={`${formatTime(turno.fechaTurno)} - ${formatTime(turno.fechaFin)}`}
                    />

                    <InfoCard
                        icon={<Stethoscope className="h-4 w-4" />}
                        label="Especialidad"
                        value={turno.especialidad.nombre}
                    />

                    <InfoCard
                        icon={<UserRound className="h-4 w-4" />}
                        label="Médico"
                        value={nombreMedico}
                    />
                </div>
            </section>

            {/* INFORMACIÓN DE CONTACTO */}

            <section className="space-y-3">
                <SectionHeader
                    icon={<UserRound className="h-4 w-4" />}
                    title="Datos del paciente"
                    description="Información de contacto del paciente."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<Mail className="h-4 w-4" />}
                        label="Correo electrónico"
                        value={turno.paciente.email}
                    />

                    <InfoCard
                        icon={<IdCard className="h-4 w-4" />}
                        label="DNI"
                        value={turno.paciente.dni}
                    />
                </div>
            </section>

            {/* OBSERVACIONES */}

            <section className="space-y-3">
                <SectionHeader
                    icon={<FileText className="h-4 w-4" />}
                    title="Observaciones"
                    description="Información adicional del turno."
                />

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm leading-relaxed text-slate-700">
                        {turno.observaciones || "Sin observaciones registradas."}
                    </p>
                </div>
            </section>

            {/* FECHAS DE REGISTRO */}

            <section className="border-t border-slate-100 pt-4">
                <div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2">
                    <div>
                        Registrado: {formatDate(turno.createdAt)}
                    </div>

                    <div className="sm:text-right">
                        Última actualización: {formatDate(turno.updatedAt)}
                    </div>
                </div>
            </section>
        </div>
    );
}
