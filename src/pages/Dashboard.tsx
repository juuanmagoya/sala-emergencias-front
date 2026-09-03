import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    MoreHorizontal,
    Stethoscope,
    Users,
    Activity,
} from "lucide-react";


import { usePacientes } from "@/hooks/usePacientes";

export default function Dashboard() {
    const { data: pacientes, isLoading } = usePacientes();

    return (


            <div className="space-y-8">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>
                        <p className="text-sm font-medium text-cyan-600">
                            Resumen general
                        </p>

                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            Panel de control
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Información general de la operación de hoy.
                        </p>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
                        <CalendarDays size={17} />
                        Ver agenda
                    </button>

                </div>


                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Pacientes"
                        value={
                            isLoading
                                ? "..."
                                : String(pacientes?.total ?? 0)
                        }
                        description="Registrados en el sistema"
                        icon={Users}
                        trend="+8.2%"
                    />

                    <StatCard
                        title="Médicos"
                        value="24"
                        description="Profesionales activos"
                        icon={Stethoscope}
                        trend="+2 hoy"
                    />

                    <StatCard
                        title="Turnos de hoy"
                        value="36"
                        description="Consultas programadas"
                        icon={CalendarDays}
                        trend="8 pendientes"
                    />

                    <StatCard
                        title="Tiempo de espera"
                        value="14 min"
                        description="Promedio actual"
                        icon={Clock3}
                        trend="-12%"
                    />

                </div>


                {/* Main grid */}
                <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

                    {/* Turnos */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Turnos de hoy
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Próximas consultas programadas
                                </p>
                            </div>

                            <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700">
                                Ver todos
                            </button>

                        </div>

                        <div className="divide-y divide-slate-100">

                            <Appointment
                                time="09:00"
                                patient="Juan Pérez"
                                doctor="Dr. Carlos Gómez"
                                specialty="Clínica médica"
                                status="Pendiente"
                            />

                            <Appointment
                                time="09:30"
                                patient="Ana Martínez"
                                doctor="Dra. Laura Fernández"
                                specialty="Cardiología"
                                status="Atendido"
                            />

                            <Appointment
                                time="10:00"
                                patient="Pedro López"
                                doctor="Dr. Carlos Gómez"
                                specialty="Clínica médica"
                                status="Pendiente"
                            />

                            <Appointment
                                time="10:30"
                                patient="María Rodríguez"
                                doctor="Dra. Sofía Torres"
                                specialty="Pediatría"
                                status="Pendiente"
                            />

                        </div>

                    </div>


                    {/* Estado */}
                    <div className="space-y-6">

                        <div className="rounded-2xl border border-slate-200 bg-white p-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Estado del servicio
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Estado operativo actual
                                    </p>
                                </div>

                                <Activity
                                    size={20}
                                    className="text-cyan-500"
                                />

                            </div>

                            <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">

                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

                                <div>
                                    <p className="text-sm font-semibold text-emerald-800">
                                        Operativo
                                    </p>

                                    <p className="text-xs text-emerald-600">
                                        Todos los servicios funcionando correctamente
                                    </p>
                                </div>

                            </div>

                            <div className="mt-5 space-y-4">

                                <ProgressItem
                                    label="Consultorios ocupados"
                                    value="7 / 12"
                                    percentage={58}
                                />

                                <ProgressItem
                                    label="Turnos atendidos"
                                    value="18 / 36"
                                    percentage={50}
                                />

                            </div>

                        </div>


                        {/* Acciones */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6">

                            <h3 className="font-semibold text-slate-900">
                                Acciones rápidas
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Accesos frecuentes
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-3">

                                <QuickAction
                                    icon={Users}
                                    label="Paciente"
                                />

                                <QuickAction
                                    icon={CalendarDays}
                                    label="Turno"
                                />

                                <QuickAction
                                    icon={Stethoscope}
                                    label="Médico"
                                />

                                <QuickAction
                                    icon={Activity}
                                    label="Historia"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Activity */}
                <div className="rounded-2xl border border-slate-200 bg-white">

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Actividad reciente
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                                Últimos movimientos registrados
                            </p>
                        </div>

                        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                            <MoreHorizontal size={18} />
                        </button>

                    </div>

                    <div className="divide-y divide-slate-100">

                        <ActivityItem
                            title="Nuevo paciente registrado"
                            description="Juan Pérez fue agregado al sistema"
                            time="Hace 8 min"
                        />

                        <ActivityItem
                            title="Turno creado"
                            description="Turno asignado a María Rodríguez"
                            time="Hace 21 min"
                        />

                        <ActivityItem
                            title="Consulta finalizada"
                            description="Dr. Carlos Gómez finalizó una consulta"
                            time="Hace 34 min"
                        />

                    </div>

                </div>

            </div>


    );
}


/* -------------------------------- */
/* Components                       */
/* -------------------------------- */

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    trend: string;
    icon: typeof Users;
}

function StatCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
}: StatCardProps) {

    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50">

            <div className="flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-cyan-50 group-hover:text-cyan-600">
                    <Icon size={19} />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    {trend}
                    <ArrowUpRight size={13} />
                </div>

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


interface AppointmentProps {
    time: string;
    patient: string;
    doctor: string;
    specialty: string;
    status: "Pendiente" | "Atendido";
}

function Appointment({
    time,
    patient,
    doctor,
    specialty,
    status,
}: AppointmentProps) {

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

            <span
                className={
                    status === "Atendido"
                        ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600"
                        : "rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-600"
                }
            >
                {status}
            </span>

        </div>
    );
}


interface ProgressItemProps {
    label: string;
    value: string;
    percentage: number;
}

function ProgressItem({
    label,
    value,
    percentage,
}: ProgressItemProps) {

    return (
        <div>

            <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-medium text-slate-600">
                    {label}
                </span>

                <span className="text-xs font-semibold text-slate-800">
                    {value}
                </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                <div
                    className="h-full rounded-full bg-cyan-500 transition-all"
                    style={{ width: `${percentage}%` }}
                />

            </div>

        </div>
    );
}


interface QuickActionProps {
    icon: typeof Users;
    label: string;
}

function QuickAction({
    icon: Icon,
    label,
}: QuickActionProps) {

    return (
        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-4 text-slate-500 transition hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-600">

            <Icon size={19} />

            <span className="text-xs font-medium">
                {label}
            </span>

        </button>
    );
}


interface ActivityItemProps {
    title: string;
    description: string;
    time: string;
}

function ActivityItem({
    title,
    description,
    time,
}: ActivityItemProps) {

    return (
        <div className="flex items-center gap-4 px-6 py-4">

            <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />

            <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-slate-800">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                </p>

            </div>

            <span className="text-[10px] text-slate-400">
                {time}
            </span>

        </div>
    );
}