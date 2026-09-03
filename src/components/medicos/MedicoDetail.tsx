import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Edit,
    Mail,
    MapPin,
    Phone,
    Stethoscope,
    UserRound,
} from "lucide-react";

import type { Medico } from "@/types/medico";

import {
    InfoCard,
    SectionHeader,
} from "@/components/medicos/MedicoInfoCard";

interface MedicoDetailProps {
    medico: Medico;
    onBack?: () => void;
    onEdit?: (medico: Medico) => void;
    showActions?: boolean;
}

const diasSemana: Record<string, string> = {
    LUNES: "Lunes",
    MARTES: "Martes",
    MIERCOLES: "Miércoles",
    JUEVES: "Jueves",
    VIERNES: "Viernes",
    SABADO: "Sábado",
};

export default function MedicoDetail({
    medico,
    onBack,
    onEdit,
    showActions = true,
}: MedicoDetailProps) {
    // ============================================
    // DATOS CALCULADOS
    // ============================================

    const nombreCompleto = `${medico.nombre} ${medico.apellido}`;

    const iniciales =
        `${medico.nombre.charAt(0)}${medico.apellido.charAt(0)}`.toUpperCase();

    const telefono = medico.telefono
        ? `(${medico.telefono.codigoArea}) ${medico.telefono.numero}`
        : "No registrado";

    const horarios = medico.horariosAtencion ?? [];

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="space-y-6">
            {/* ======================================== */}
            {/* ACCIONES */}
            {/* ======================================== */}

            {showActions && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <ArrowLeft size={17} />
                            Volver a médicos
                        </button>
                    )}

                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(medico)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                        >
                            <Edit size={17} />
                            Editar médico
                        </button>
                    )}
                </div>
            )}

            {/* ======================================== */}
            {/* PERFIL */}
            {/* ======================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-32 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600" />

                <div className="px-6 pb-6">
                    <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            {/* Avatar */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-xl">
                                {iniciales}
                            </div>

                            {/* Nombre */}
                            <div className="pb-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {nombreCompleto}
                                    </h1>

                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            medico.activo
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {medico.activo
                                            ? "Activo"
                                            : "Inactivo"}
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Stethoscope size={15} />
                                        {medico.especialidad?.nombre ??
                                            "Sin especialidad"}
                                    </span>

                                    <span className="text-slate-300">
                                        •
                                    </span>

                                    <span>
                                        Matrícula:{" "}
                                        <strong className="text-slate-700">
                                            {medico.matricula}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================================== */}
            {/* INFORMACIÓN PERSONAL */}
            {/* ======================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<UserRound size={17} />}
                    title="Información personal"
                    description="Datos principales del médico."
                />

                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <InfoCard
                        icon={<UserRound size={16} />}
                        label="Nombre completo"
                        value={nombreCompleto}
                    />

                    <InfoCard
                        icon={<Stethoscope size={16} />}
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

                    <InfoCard
                        icon={<UserRound size={16} />}
                        label="Tipo de teléfono"
                        value={
                            medico.telefono?.tipo ??
                            "No especificado"
                        }
                    />
                </div>
            </section>

            {/* ======================================== */}
            {/* ESPECIALIDAD */}
            {/* ======================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<Stethoscope size={17} />}
                    title="Especialidad"
                    description="Información de la especialidad médica."
                />

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <InfoCard
                        icon={<Stethoscope size={16} />}
                        label="Nombre"
                        value={
                            medico.especialidad?.nombre ??
                            "No especificada"
                        }
                    />

                    <InfoCard
                        icon={<Stethoscope size={16} />}
                        label="Código"
                        value={
                            medico.especialidad?.codigo ??
                            "Sin código"
                        }
                    />

                    {medico.especialidad?.descripcion && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Descripción
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                {medico.especialidad.descripcion}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ======================================== */}
            {/* HORARIOS DE ATENCIÓN */}
            {/* ======================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<Clock size={17} />}
                    title="Horarios de atención"
                    description="Días y horarios en los que atiende el médico."
                />

                {/* Duración de turno */}
                <div className="mt-5">
                    <InfoCard
                        icon={<Clock size={16} />}
                        label="Duración de cada turno"
                        value={`${medico.duracionTurno} minutos`}
                    />
                </div>

                {/* Horarios */}
                <div className="mt-5">
                    {horarios.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {horarios.map((horario, index) => (
                                <div
                                    key={`${horario.dia}-${index}`}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <CalendarDays size={18} />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {diasSemana[horario.dia] ??
                                                    horario.dia}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Día de atención
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2.5">
                                        <Clock
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        <span className="text-sm font-semibold text-slate-700">
                                            {horario.horaInicio} -{" "}
                                            {horario.horaFin}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <Clock
                                size={28}
                                className="mx-auto text-slate-400"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-700">
                                No hay horarios registrados
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Los horarios de atención aparecerán aquí.
                            </p>
                        </div>
                    )}
                </div>

                {/* Resumen */}
                {horarios.length > 0 && (
                    <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Clock size={16} />

                            <span className="text-xs font-semibold uppercase tracking-wide">
                                Resumen de atención
                            </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-blue-900">
                            {horarios.length === 1
                                ? "1 horario de atención"
                                : `${horarios.length} horarios de atención`}{" "}
                            · Turnos de {medico.duracionTurno} minutos
                        </p>
                    </div>
                )}
            </section>

            {/* ======================================== */}
            {/* CONSULTORIOS */}
            {/* ======================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionHeader
                    icon={<MapPin size={17} />}
                    title="Consultorios"
                    description="Consultorios asociados al médico."
                />

                <div className="mt-5">
                    {medico.consultorios &&
                    medico.consultorios.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {medico.consultorios.map((consultorio) => (
                                <div
                                    key={consultorio.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <MapPin size={18} />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {consultorio.nombre ??
                                                    "Consultorio"}
                                            </p>

                                            {consultorio.numero && (
                                                <p className="text-xs text-slate-500">
                                                    Consultorio{" "}
                                                    {consultorio.numero}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {consultorio.piso && (
                                        <p className="mt-3 text-sm text-slate-600">
                                            Piso: {consultorio.piso}
                                        </p>
                                    )}

                                    {consultorio.activo !== undefined && (
                                        <span
                                            className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                consultorio.activo
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {consultorio.activo
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                            <MapPin
                                size={28}
                                className="mx-auto text-slate-400"
                            />

                            <p className="mt-3 text-sm font-medium text-slate-700">
                                No tiene consultorios asignados
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Los consultorios asociados aparecerán aquí.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ======================================== */}
            {/* INFORMACIÓN DEL REGISTRO */}
            {/* ======================================== */}

            {(medico.createdAt || medico.updatedAt) && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <SectionHeader
                        icon={<CalendarDays size={17} />}
                        title="Información del registro"
                        description="Datos de creación y última actualización."
                    />

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {medico.createdAt && (
                            <InfoCard
                                icon={<CalendarDays size={16} />}
                                label="Registrado"
                                value={new Date(
                                    medico.createdAt
                                ).toLocaleString("es-AR")}
                            />
                        )}

                        {medico.updatedAt && (
                            <InfoCard
                                icon={<CalendarDays size={16} />}
                                label="Última actualización"
                                value={new Date(
                                    medico.updatedAt
                                ).toLocaleString("es-AR")}
                            />
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}