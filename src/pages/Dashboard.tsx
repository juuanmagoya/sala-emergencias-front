
import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Stethoscope,
    Users,
    Activity,
    CheckCircle2,
    XCircle,
    RefreshCw,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { usePacientes } from "@/hooks/usePacientes";
import { useMedicos } from "@/hooks/useMedicos";
import { useTurnos } from "@/hooks/useTurnos";

// ============================================================
// CONFIGURACIÓN
// ============================================================

const ZONA_HORARIA = "America/Argentina/Buenos_Aires";

function obtenerFechaArgentina(fecha: Date = new Date()): string {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: ZONA_HORARIA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(fecha);

    const obtener = (tipo: string) =>
        partes.find((parte) => parte.type === tipo)?.value ?? "";

    return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
}

function formatearHora(fecha: string): string {
    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) {
        return "--:--";
    }

    return new Intl.DateTimeFormat("es-AR", {
        timeZone: ZONA_HORARIA,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function formatearFechaActual(): string {
    return new Intl.DateTimeFormat("es-AR", {
        timeZone: ZONA_HORARIA,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());
}

// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
    const {
        data: pacientes,
        isLoading: cargandoPacientes,
        isError: errorPacientes,
        refetch: recargarPacientes,
    } = usePacientes();

    const {
        data: medicos,
        isLoading: cargandoMedicos,
        isError: errorMedicos,
        refetch: recargarMedicos,
    } = useMedicos();

    const {
        data: turnos,
        isLoading: cargandoTurnos,
        isError: errorTurnos,
        refetch: recargarTurnos,
    } = useTurnos();

    // --------------------------------------------------------
    // DATOS REALES
    // --------------------------------------------------------

    const fechaHoy = obtenerFechaArgentina();

    const listaMedicos = medicos?.data ?? [];
    const listaTurnos = turnos?.data ?? [];

    const medicosActivos = listaMedicos.filter(
        (medico) => medico.activo
    ).length;

    // --------------------------------------------------------
    // TURNOS DEL DÍA
    // --------------------------------------------------------

    const turnosHoy = listaTurnos
        .filter((turno) => {
            if (!turno.fechaTurno) return false;

            const fecha = new Date(turno.fechaTurno);

            if (Number.isNaN(fecha.getTime())) return false;

            return obtenerFechaArgentina(fecha) === fechaHoy;
        })
        .sort(
            (a, b) =>
                new Date(a.fechaTurno).getTime() -
                new Date(b.fechaTurno).getTime()
        );

    // --------------------------------------------------------
    // ESTADÍSTICAS
    // --------------------------------------------------------

    const turnosPendientes = turnosHoy.filter(
        (turno) => turno.estado === "pendiente"
    ).length;

    const turnosAtendidos = turnosHoy.filter(
        (turno) => turno.estado === "atendido"
    ).length;

    const turnosCancelados = turnosHoy.filter(
        (turno) => turno.estado === "cancelado"
    ).length;

    const turnosProgramados =
        turnosHoy.length - turnosCancelados;

    const porcentajeAtencion =
        turnosProgramados > 0
            ? Math.round(
                (turnosAtendidos / turnosProgramados) * 100
            )
            : 0;

    // --------------------------------------------------------
    // ESTADOS GENERALES
    // --------------------------------------------------------

    const cargando =
        cargandoPacientes ||
        cargandoMedicos ||
        cargandoTurnos;

    const hayErrores =
        errorPacientes ||
        errorMedicos ||
        errorTurnos;

    const recargarTodo = () => {
        recargarPacientes();
        recargarMedicos();
        recargarTurnos();
    };

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
        <div className="space-y-8">

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>
                    <p className="text-sm font-medium capitalize text-cyan-600">
                        {formatearFechaActual()}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Panel de control
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Resumen general de la operación de hoy.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={recargarTodo}
                    disabled={cargando}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={cargando ? "animate-spin" : ""}
                    />
                    Actualizar información
                </button>

            </div>

            {/* ERROR */}

            {hayErrores && (
                <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            No se pudo obtener toda la información.
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                            Algunos indicadores podrían estar incompletos.
                            Intentá actualizar los datos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={recargarTodo}
                        className="shrink-0 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* INDICADORES */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Pacientes"
                    value={
                        cargandoPacientes
                            ? "..."
                            : errorPacientes
                                ? "--"
                                : String(pacientes?.total ?? 0)
                    }
                    description="Registrados en el sistema"
                    icon={Users}
                    color="cyan"
                />

                <StatCard
                    title="Médicos activos"
                    value={
                        cargandoMedicos
                            ? "..."
                            : errorMedicos
                                ? "--"
                                : String(medicosActivos)
                    }
                    description="Profesionales disponibles"
                    icon={Stethoscope}
                    color="blue"
                />

                <StatCard
                    title="Turnos de hoy"
                    value={
                        cargandoTurnos
                            ? "..."
                            : errorTurnos
                                ? "--"
                                : String(turnosHoy.length)
                    }
                    description="Turnos registrados para hoy"
                    icon={CalendarDays}
                    color="violet"
                />

                <StatCard
                    title="Pendientes"
                    value={
                        cargandoTurnos
                            ? "..."
                            : errorTurnos
                                ? "--"
                                : String(turnosPendientes)
                    }
                    description="Esperando atención"
                    icon={Clock3}
                    color="amber"
                />

            </div>

            {/* CONTENIDO PRINCIPAL */}

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

                {/* TURNOS DE HOY */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Turnos de hoy
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Consultas programadas para la jornada
                            </p>
                        </div>

                        <span className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                            {errorTurnos
                                ? "--"
                                : `${turnosHoy.length} turnos`}
                        </span>

                    </div>

                    {cargandoTurnos ? (

                        <div className="space-y-4 p-6">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex animate-pulse items-center gap-4"
                                >
                                    <div className="h-10 w-14 rounded-lg bg-slate-100" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-1/3 rounded bg-slate-100" />
                                        <div className="h-3 w-2/3 rounded bg-slate-100" />
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : errorTurnos ? (

                        <EmptyState
                            message="No pudimos cargar los turnos."
                        />

                    ) : turnosHoy.length === 0 ? (

                        <EmptyState
                            message="No hay turnos registrados para hoy."
                        />

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {turnosHoy.slice(0, 5).map((turno) => (
                                <Appointment
                                    key={turno.id}
                                    time={formatearHora(turno.fechaTurno)}
                                    patient={
                                        `${turno.paciente?.nombre ?? "Paciente"}`
                                    }
                                    doctor={
                                        turno.medico
                                            ? `Dr./Dra. ${turno.medico.nombre} ${turno.medico.apellido}`
                                            : "Médico no disponible"
                                    }
                                    specialty={
                                        typeof turno.especialidad === "object"
                                            ? turno.especialidad?.nombre ?? "Sin especialidad"
                                            : "Sin especialidad"
                                    }
                                    status={turno.estado}
                                />
                            ))}

                        </div>
                    )}

                    {!cargandoTurnos &&
                        !errorTurnos &&
                        turnosHoy.length > 5 && (
                            <div className="border-t border-slate-100 px-6 py-4 text-center">
                                <p className="text-xs text-slate-500">
                                    Se muestran los primeros 5 turnos de {turnosHoy.length} registrados.
                                </p>
                            </div>
                        )}

                </div>

                {/* ESTADO DEL SERVICIO */}

                <div className="space-y-6">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Resumen de atención
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Estado de los turnos de hoy
                                </p>
                            </div>

                            <Activity
                                size={20}
                                className="text-cyan-500"
                            />

                        </div>

                        {cargandoTurnos ? (

                            <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-100" />

                        ) : errorTurnos ? (

                            <EmptyState message="No hay información disponible." />

                        ) : (

                            <>
                                <div className="mt-6 space-y-4">

                                    <SummaryItem
                                        label="Pendientes"
                                        value={turnosPendientes}
                                        icon={Clock3}
                                        color="amber"
                                    />

                                    <SummaryItem
                                        label="Atendidos"
                                        value={turnosAtendidos}
                                        icon={CheckCircle2}
                                        color="emerald"
                                    />

                                    <SummaryItem
                                        label="Cancelados"
                                        value={turnosCancelados}
                                        icon={XCircle}
                                        color="red"
                                    />

                                </div>

                                <div className="mt-7 border-t border-slate-100 pt-5">

                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-600">
                                            Porcentaje de atención
                                        </span>

                                        <span className="text-sm font-bold text-slate-900">
                                            {porcentajeAtencion}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                            style={{
                                                width: `${porcentajeAtencion}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-2 text-[11px] text-slate-400">
                                        {turnosAtendidos} de {turnosProgramados} turnos no cancelados atendidos.
                                    </p>

                                </div>
                            </>
                        )}

                    </div>

                    {/* RESUMEN DE MÉDICOS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <Stethoscope size={19} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Equipo médico
                                </h3>

                                <p className="text-xs text-slate-400">
                                    Estado de los profesionales
                                </p>
                            </div>
                        </div>

                        {cargandoMedicos ? (

                            <div className="mt-5 h-12 animate-pulse rounded-lg bg-slate-100" />

                        ) : errorMedicos ? (

                            <p className="mt-5 text-xs text-red-500">
                                No se pudo cargar la información.
                            </p>

                        ) : (

                            <div className="mt-5 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {medicosActivos}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Médicos activos
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-semibold text-slate-700">
                                        {listaMedicos.length - medicosActivos}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Inactivos
                                    </p>
                                </div>
                            </div>

                        )}

                    </div>

                </div>

            </div>

            {/* PIE DEL DASHBOARD */}

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                    Sala de Emergencias Municipal Goya
                </p>

                <p className="text-xs text-slate-400">
                    Información correspondiente a {fechaHoy}
                </p>
            </div>

        </div>
    );
}

// ============================================================
// TARJETA DE ESTADÍSTICA
// ============================================================

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    color: "cyan" | "blue" | "violet" | "amber";
}

const statColors = {
    cyan: "bg-cyan-50 text-cyan-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50">

            <div className="flex items-start justify-between">

                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${statColors[color]}`}>
                    <Icon size={19} />
                </div>

                <ArrowUpRight
                    size={16}
                    className="text-slate-300 transition group-hover:text-cyan-500"
                />

            </div>

            <div className="mt-5">

                <p className="text-xs font-medium text-slate-400">
                    {title}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    {value}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                    {description}
                </p>

            </div>

        </div>
    );
}

// ============================================================
// TURNO
// ============================================================

interface AppointmentProps {
    time: string;
    patient: string;
    doctor: string;
    specialty: string;
    status: "pendiente" | "atendido" | "cancelado";
}

function Appointment({
    time,
    patient,
    doctor,
    specialty,
    status,
}: AppointmentProps) {
    const estilos = {
        pendiente: "bg-amber-50 text-amber-600",
        atendido: "bg-emerald-50 text-emerald-600",
        cancelado: "bg-red-50 text-red-600",
    };

    const etiquetas = {
        pendiente: "Pendiente",
        atendido: "Atendido",
        cancelado: "Cancelado",
    };

    return (
        <div className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50">

            <div className="w-14 shrink-0">
                <p className="text-sm font-semibold text-slate-900">
                    {time}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                    Hoy
                </p>
            </div>

            <div className="h-9 w-px bg-slate-200" />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                    {patient}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                    {doctor} · {specialty}
                </p>
            </div>

            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${estilos[status]}`}>
                {etiquetas[status]}
            </span>

        </div>
    );
}

// ============================================================
// RESUMEN DE ESTADOS
// ============================================================

interface SummaryItemProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: "amber" | "emerald" | "red";
}

const summaryColors = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
};

function SummaryItem({
    label,
    value,
    icon: Icon,
    color,
}: SummaryItemProps) {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${summaryColors[color]}`}>
                    <Icon size={17} />
                </div>

                <span className="text-sm font-medium text-slate-600">
                    {label}
                </span>

            </div>

            <span className="text-sm font-bold text-slate-900">
                {value}
            </span>

        </div>
    );
}

// ============================================================
// ESTADO VACÍO
// ============================================================

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center px-6 py-8 text-center">

            <CalendarDays
                size={28}
                className="text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
                {message}
            </p>

        </div>
    );
}
