import { Link } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    CalendarPlus,
    CircleCheck,
    Clock3,
    ClipboardList,
    Stethoscope,
    UserRound,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { EstadoTurno, MiTurno } from "@/types/turno";

const ZONA_HORARIA_ARGENTINA =
    "America/Argentina/Buenos_Aires";

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

interface ReservaTurnoExitosaProps {
    turno: MiTurno;
    onReservarOtro: () => void;
}

interface DatoTurnoProps {
    icono: LucideIcon;
    etiqueta: string;
    valor: string;
    detalle?: string;
}

function capitalizar(texto: string): string {
    if (!texto) {
        return texto;
    }

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearFechaArgentina(valor: string): string {
    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
        return "No disponible";
    }

    const texto = new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).format(fecha);

    return capitalizar(texto);
}

function formatearHoraArgentina(valor: string): string {
    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
        return "No disponible";
    }

    return new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).format(fecha);
}

function DatoTurno({
    icono: Icono,
    etiqueta,
    valor,
    detalle,
}: DatoTurnoProps) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                <Icono size={17} />
            </span>

            <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {etiqueta}
                </dt>

                <dd className="mt-0.5 break-words text-sm font-medium leading-5 text-slate-800">
                    {valor}
                </dd>

                {detalle && (
                    <dd className="mt-0.5 break-words text-xs text-slate-500">
                        {detalle}
                    </dd>
                )}
            </div>
        </div>
    );
}

export default function ReservaTurnoExitosa({
    turno,
    onReservarOtro,
}: ReservaTurnoExitosaProps) {
    const fecha = formatearFechaArgentina(turno.fechaTurno);
    const horaInicio = formatearHoraArgentina(
        turno.fechaTurno
    );
    const horaFin = formatearHoraArgentina(turno.fechaFin);

    const observaciones =
        turno.observaciones?.trim() ?? "";

    return (
        <div className="space-y-6">
            {/* Reserva registrada */}
            <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-400 p-6 text-white shadow-xl shadow-emerald-500/20 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-teal-200/20 blur-2xl"
                />

                <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm">
                        <CircleCheck size={30} />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-50">
                            Reserva registrada
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            Tu turno quedó registrado
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
                            Guardamos tu reserva correctamente.
                            Revisá los detalles antes de
                            retirarte.
                        </p>
                    </div>
                </div>
            </section>

            {/* Detalle de la reserva */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                            <ClipboardList size={19} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Detalle del turno
                            </h2>

                            <p className="text-xs text-slate-500">
                                Información devuelta por el
                                servidor.
                            </p>
                        </div>
                    </div>

                    <span
                        aria-label={`Estado del turno: ${ETIQUETAS_ESTADO[turno.estado]}`}
                        className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                            ESTILOS_ESTADO[turno.estado]
                        )}
                    >
                        {ETIQUETAS_ESTADO[turno.estado]}
                    </span>
                </div>

                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <DatoTurno
                        icono={Stethoscope}
                        etiqueta="Especialidad"
                        valor={turno.especialidad.nombre}
                    />

                    <DatoTurno
                        icono={UserRound}
                        etiqueta="Médico"
                        valor={`${turno.medico.nombre} ${turno.medico.apellido}`}
                        detalle={`Matrícula ${turno.medico.matricula}`}
                    />

                    <DatoTurno
                        icono={CalendarDays}
                        etiqueta="Fecha"
                        valor={fecha}
                    />

                    <DatoTurno
                        icono={Clock3}
                        etiqueta="Horario"
                        valor={`${horaInicio} a ${horaFin}`}
                    />
                </dl>

                {observaciones && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Observaciones
                        </p>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                            {observaciones}
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <Link
                        to="/portal"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={16} />
                        Volver al portal
                    </Link>

                    <button
                        type="button"
                        onClick={onReservarOtro}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                        <CalendarPlus size={16} />
                        Reservar otro turno
                    </button>
                </div>
            </section>
        </div>
    );
}
