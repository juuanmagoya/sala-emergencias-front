import type { ReactNode } from "react";

import {
    AlertCircle,
    Check,
    Clock3,
    ClipboardList,
    LoaderCircle,
    LockKeyhole,
    RotateCcw,
    Stethoscope,
    UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { EspecialidadDisponible } from "@/types/especialidad";
import type { MedicoDisponible } from "@/types/medico";
import type { HorarioDisponible } from "@/types/turno";

// ============================================================
// SECCIONES
// ============================================================

export type EstadoSeccion =
    | "completada"
    | "disponible"
    | "bloqueada";

interface SeccionReservaProps {
    numero: number;
    titulo: string;
    descripcion: string;
    estado: EstadoSeccion;
    etiqueta?: string;
    children: ReactNode;
}

const ESTILOS_SECCION: Record<EstadoSeccion, string> = {
    completada: "border-emerald-200 bg-white",
    disponible:
        "border-cyan-200 bg-white shadow-sm shadow-cyan-500/5",
    bloqueada: "border-slate-200 bg-slate-50/70",
};

const ESTILOS_INDICADOR: Record<EstadoSeccion, string> = {
    completada: "bg-emerald-500 text-white",
    disponible: "bg-cyan-500 text-white",
    bloqueada: "bg-slate-200 text-slate-500",
};

const ETIQUETAS_ESTADO: Record<EstadoSeccion, string> = {
    completada: "Completado",
    disponible: "Disponible",
    bloqueada: "Pendiente",
};

const ESTILOS_ETIQUETA: Record<EstadoSeccion, string> = {
    completada: "bg-emerald-50 text-emerald-700",
    disponible: "bg-cyan-50 text-cyan-700",
    bloqueada: "bg-slate-100 text-slate-500",
};

export function SeccionReserva({
    numero,
    titulo,
    descripcion,
    estado,
    etiqueta,
    children,
}: SeccionReservaProps) {
    const etiquetaFinal =
        etiqueta ?? ETIQUETAS_ESTADO[estado];

    return (
        <section
            className={cn(
                "rounded-2xl border p-5 transition-colors sm:p-6",
                ESTILOS_SECCION[estado]
            )}
        >
            <div className="flex items-start gap-3">
                <div
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold",
                        ESTILOS_INDICADOR[estado]
                    )}
                    aria-hidden="true"
                >
                    {estado === "completada" ? (
                        <Check size={18} />
                    ) : estado === "bloqueada" ? (
                        <LockKeyhole size={17} />
                    ) : (
                        numero
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold tracking-tight text-slate-900">
                            {titulo}
                        </h2>

                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                etiqueta
                                    ? "bg-slate-100 text-slate-500"
                                    : ESTILOS_ETIQUETA[estado]
                            )}
                        >
                            {etiquetaFinal}
                        </span>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                        {descripcion}
                    </p>
                </div>
            </div>

            <div
                className={cn(
                    "mt-4",
                    estado === "bloqueada" && "opacity-70"
                )}
            >
                {children}
            </div>
        </section>
    );
}

// ============================================================
// ESTADOS
// ============================================================

interface EstadoCargaProps {
    mensaje: string;
}

export function EstadoCarga({
    mensaje,
}: EstadoCargaProps) {
    return (
        <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500"
        >
            <LoaderCircle
                size={18}
                className="shrink-0 animate-spin text-cyan-600"
            />

            <span>{mensaje}</span>
        </div>
    );
}

interface EstadoErrorProps {
    mensaje: string;
    reintentando: boolean;
    onReintentar: () => void;
}

export function EstadoError({
    mensaje,
    reintentando,
    onReintentar,
}: EstadoErrorProps) {
    return (
        <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
            <div className="flex items-start gap-2">
                <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                />

                <div>
                    <p className="text-sm font-medium text-red-800">
                        {mensaje}
                    </p>

                    <button
                        type="button"
                        onClick={onReintentar}
                        disabled={reintentando}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RotateCcw
                            size={13}
                            className={
                                reintentando
                                    ? "animate-spin"
                                    : undefined
                            }
                        />

                        {reintentando
                            ? "Reintentando..."
                            : "Reintentar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface EstadoVacioProps {
    mensaje: string;
}

export function EstadoVacio({
    mensaje,
}: EstadoVacioProps) {
    return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-sm leading-6 text-slate-500">
            {mensaje}
        </div>
    );
}

interface EstadoPendienteProps {
    mensaje: string;
}

export function EstadoPendiente({
    mensaje,
}: EstadoPendienteProps) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm leading-6 text-slate-500">
            <LockKeyhole
                size={16}
                className="shrink-0 text-slate-400"
            />

            <span>{mensaje}</span>
        </div>
    );
}

// ============================================================
// OPCIONES DE SELECCIÓN
// ============================================================

interface OpcionEspecialidadProps {
    especialidad: EspecialidadDisponible;
    seleccionada: boolean;
    onSeleccionar: (
        especialidad: EspecialidadDisponible
    ) => void;
}

export function OpcionEspecialidad({
    especialidad,
    seleccionada,
    onSeleccionar,
}: OpcionEspecialidadProps) {
    return (
        <button
            type="button"
            aria-pressed={seleccionada}
            onClick={() => onSeleccionar(especialidad)}
            className={cn(
                "group flex w-full flex-col rounded-xl border-2 p-4 text-left transition-all",
                seleccionada
                    ? "border-cyan-500 bg-cyan-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40"
            )}
        >
            <div className="flex w-full items-start justify-between gap-3">
                <span
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                        seleccionada
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700"
                    )}
                >
                    <Stethoscope size={17} />
                </span>

                <span
                    className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        seleccionada
                            ? "border-cyan-600 bg-cyan-600 text-white"
                            : "border-slate-300 bg-white text-transparent"
                    )}
                    aria-hidden="true"
                >
                    <Check size={13} />
                </span>
            </div>

            <span className="mt-3 break-words font-semibold text-slate-900">
                {especialidad.nombre}
            </span>

            {especialidad.descripcion && (
                <span className="mt-1 line-clamp-2 break-words text-sm leading-5 text-slate-500">
                    {especialidad.descripcion}
                </span>
            )}
        </button>
    );
}

interface OpcionMedicoProps {
    medico: MedicoDisponible;
    seleccionado: boolean;
    onSeleccionar: (medico: MedicoDisponible) => void;
}

export function OpcionMedico({
    medico,
    seleccionado,
    onSeleccionar,
}: OpcionMedicoProps) {
    return (
        <button
            type="button"
            aria-pressed={seleccionado}
            onClick={() => onSeleccionar(medico)}
            className={cn(
                "flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                seleccionado
                    ? "border-cyan-500 bg-cyan-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40"
            )}
        >
            <span
                className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    seleccionado
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-slate-100 text-slate-500"
                )}
            >
                <UserRound size={18} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block break-words font-semibold text-slate-900">
                    {medico.nombre} {medico.apellido}
                </span>

                <span className="mt-0.5 block text-xs text-slate-500">
                    Matrícula {medico.matricula}
                </span>

                <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 size={13} />
                    Turnos de {medico.duracionTurno} minutos
                </span>
            </span>

            <span
                className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    seleccionado
                        ? "border-cyan-600 bg-cyan-600 text-white"
                        : "border-slate-300 bg-white text-transparent"
                )}
                aria-hidden="true"
            >
                <Check size={13} />
            </span>
        </button>
    );
}

interface OpcionHorarioProps {
    horario: HorarioDisponible;
    seleccionado: boolean;
    onSeleccionar: (horario: HorarioDisponible) => void;
}

export function OpcionHorario({
    horario,
    seleccionado,
    onSeleccionar,
}: OpcionHorarioProps) {
    return (
        <button
            type="button"
            aria-pressed={seleccionado}
            aria-label={`Seleccionar horario ${horario.horaLocal}`}
            onClick={() => onSeleccionar(horario)}
            className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all",
                seleccionado
                    ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
            )}
        >
            <Clock3 size={14} />

            {horario.horaLocal}
        </button>
    );
}

// ============================================================
// RESUMEN
// ============================================================

interface ResumenReservaProps {
    especialidad?: string;
    medico?: string;
    fecha?: string;
    horario?: string;
    observaciones?: string;
    puedeConfirmar: boolean;
    confirmando: boolean;
    onConfirmar: () => void;
}

interface FilaResumenProps {
    etiqueta: string;
    valor?: string;
}

function FilaResumen({
    etiqueta,
    valor,
}: FilaResumenProps) {
    return (
        <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {etiqueta}
            </dt>

            <dd
                className={cn(
                    "mt-1 text-sm leading-5",
                    valor
                        ? "font-medium text-slate-800"
                        : "text-slate-400"
                )}
            >
                {valor || "Sin seleccionar"}
            </dd>
        </div>
    );
}

export function ResumenReserva({
    especialidad,
    medico,
    fecha,
    horario,
    observaciones,
    puedeConfirmar,
    confirmando,
    onConfirmar,
}: ResumenReservaProps) {
    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <ClipboardList size={19} />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Resumen de tu reserva
                    </h2>

                    <p className="text-xs text-slate-500">
                        Revisá tu selección antes de confirmar.
                    </p>
                </div>
            </div>

            <dl className="mt-5 space-y-4">
                <FilaResumen
                    etiqueta="Especialidad"
                    valor={especialidad}
                />

                <FilaResumen
                    etiqueta="Médico"
                    valor={medico}
                />

                <FilaResumen
                    etiqueta="Fecha"
                    valor={fecha}
                />

                <FilaResumen
                    etiqueta="Horario"
                    valor={horario}
                />
            </dl>

            {observaciones && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Observaciones
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600">
                        {observaciones}
                    </p>
                </div>
            )}

            <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onConfirmar}
                    disabled={!puedeConfirmar || confirmando}
                    aria-busy={confirmando}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {confirmando ? (
                        <LoaderCircle
                            size={16}
                            className="animate-spin"
                        />
                    ) : puedeConfirmar ? (
                        <Check size={16} />
                    ) : (
                        <LockKeyhole size={16} />
                    )}

                    {confirmando
                        ? "Confirmando turno..."
                        : "Confirmar turno"}
                </button>

                <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                    {confirmando
                        ? "Estamos registrando tu reserva."
                        : puedeConfirmar
                          ? "Revisá que los datos sean correctos antes de confirmar."
                          : "Completá especialidad, médico, fecha y horario."}
                </p>
            </div>
        </aside>
    );
}
