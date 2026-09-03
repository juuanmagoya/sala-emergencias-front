import type { ReactNode } from "react";

import {
    AtSign,
    CalendarClock,
    Clock3,
    GraduationCap,
    Hospital,
    IdCard,
    Mail,
    Phone,
    Stethoscope,
    UserRound,
} from "lucide-react";

import type { Medico } from "@/types/medico";

// ============================================
// INFO CARD
// ============================================

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
}

export function InfoCard({
    icon,
    label,
    value,
}: InfoCardProps) {
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

// ============================================
// SECTION HEADER
// ============================================

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
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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
// INFORMACIÓN PERSONAL
// ============================================

interface MedicoInfoCardProps {
    medico: Medico;
}

export default function MedicoInfoCard({
    medico,
}: MedicoInfoCardProps) {
    const nombreCompleto = `${medico.nombre} ${medico.apellido}`;

    const telefono = medico.telefono
        ? `(${medico.telefono.codigoArea}) ${medico.telefono.numero}`
        : "Sin teléfono";

    const horario =
        medico.horarioAtencion?.dia &&
        medico.horarioAtencion.horaInicio &&
        medico.horarioAtencion.horaFin
            ? `${medico.horarioAtencion.dia} de ${medico.horarioAtencion.horaInicio} a ${medico.horarioAtencion.horaFin}`
            : "Sin horario configurado";

    const consultorios =
        medico.consultorios?.length > 0
            ? medico.consultorios
                  .map(
                      (consultorio) =>
                          consultorio.nombre ??
                          consultorio.numero ??
                          "Consultorio"
                  )
                  .join(", ")
            : "Sin consultorios asignados";

    return (
        <div className="space-y-6">
            {/* ======================================== */}
            {/* CABECERA */}
            {/* ======================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg">
                            {`${medico.nombre.charAt(0)}${medico.apellido.charAt(0)}`.toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {nombreCompleto}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {medico.especialidad?.nombre ??
                                    "Sin especialidad"}
                            </p>
                        </div>
                    </div>

                    {/* ESTADO */}
                    <div>
                        {medico.activo ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Médico activo
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                                Médico inactivo
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ======================================== */}
            {/* DATOS PROFESIONALES */}
            {/* ======================================== */}

            <section className="space-y-4">
                <SectionHeader
                    icon={<GraduationCap size={17} />}
                    title="Información profesional"
                    description="Datos profesionales y matrícula."
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <InfoCard
                        icon={<IdCard size={16} />}
                        label="Matrícula"
                        value={medico.matricula}
                    />

                    <InfoCard
                        icon={<Stethoscope size={16} />}
                        label="Especialidad"
                        value={
                            medico.especialidad?.nombre ??
                            "Sin especialidad"
                        }
                    />

                    {medico.especialidad?.codigo && (
                        <InfoCard
                            icon={<AtSign size={16} />}
                            label="Código"
                            value={
                                medico.especialidad.codigo
                            }
                        />
                    )}

                    <InfoCard
                        icon={<UserRound size={16} />}
                        label="Nombre completo"
                        value={nombreCompleto}
                    />
                </div>
            </section>

            {/* ======================================== */}
            {/* CONTACTO */}
            {/* ======================================== */}

            <section className="space-y-4">
                <SectionHeader
                    icon={<Phone size={17} />}
                    title="Información de contacto"
                    description="Datos de contacto del médico."
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <InfoCard
                        icon={<Mail size={16} />}
                        label="Email"
                        value={medico.email}
                    />

                    <InfoCard
                        icon={<Phone size={16} />}
                        label="Teléfono"
                        value={telefono}
                    />
                </div>
            </section>

            {/* ======================================== */}
            {/* ATENCIÓN */}
            {/* ======================================== */}

            <section className="space-y-4">
                <SectionHeader
                    icon={<CalendarClock size={17} />}
                    title="Atención"
                    description="Horario y consultorios asignados."
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <InfoCard
                        icon={<Clock3 size={16} />}
                        label="Horario de atención"
                        value={horario}
                    />

                    <InfoCard
                        icon={<Hospital size={16} />}
                        label="Consultorios"
                        value={consultorios}
                    />
                </div>
            </section>
        </div>
    );
}