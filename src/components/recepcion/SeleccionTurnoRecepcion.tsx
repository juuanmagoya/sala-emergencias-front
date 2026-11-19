import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type { ChangeEvent, ReactNode } from "react";

import axios from "axios";

import {
    AlertCircle,
    CalendarCheck,
    Check,
    Clock3,
    LoaderCircle,
    LockKeyhole,
    RotateCcw,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatFechaLargaArgentina } from "@/components/shared/formatDate";

import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useMedicos } from "@/hooks/useMedicos";
import { useDisponibilidad } from "@/hooks/useTurnos";

import { cn } from "@/lib/utils";

import type { Especialidad } from "@/types/especialidad";
import type { Medico } from "@/types/medico";
import type { HorarioDisponible } from "@/types/turno";

// ============================================================
// TIPOS
// ============================================================

export interface HorarioRecepcionSeleccionado {
    especialidad: string;
    especialidadNombre: string;
    medico: string;
    medicoNombre: string;
    fechaTurno: string;
    fechaFin: string;
    horaLocal: string;
}

export interface SeleccionTurnoRecepcionProps {
    onHorarioSeleccionado: (
        seleccion: HorarioRecepcionSeleccionado
    ) => void;
    onCambiarSeleccion?: () => void;
    bloqueada?: boolean;
    horarioInvalidado?: boolean;
}

type EstadoPaso = "completado" | "activo" | "bloqueado";

// ============================================================
// CONSTANTES
// ============================================================

const ZONA_HORARIA_ARGENTINA =
    "America/Argentina/Buenos_Aires";

const ESTILOS_CAMPO =
    "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const ESTILOS_PASO: Record<EstadoPaso, string> = {
    completado: "border-emerald-200 bg-white",
    activo:
        "border-blue-200 bg-white shadow-sm shadow-blue-500/5",
    bloqueado: "border-slate-200 bg-slate-50/70",
};

const ESTILOS_INDICADOR: Record<EstadoPaso, string> = {
    completado: "bg-emerald-600 text-white",
    activo: "bg-blue-600 text-white",
    bloqueado: "bg-slate-200 text-slate-500",
};

const ETIQUETAS_ESTADO: Record<EstadoPaso, string> = {
    completado: "Completado",
    activo: "En curso",
    bloqueado: "Pendiente",
};

const ESTILOS_ETIQUETA: Record<EstadoPaso, string> = {
    completado: "bg-emerald-50 text-emerald-700",
    activo: "bg-blue-50 text-blue-700",
    bloqueado: "bg-slate-100 text-slate-500",
};

// ============================================================
// FECHAS
// ============================================================

/**
 * Devuelve la fecha actual de Argentina en formato YYYY-MM-DD.
 *
 * No se usa toISOString() porque depende de UTC y puede devolver
 * el día anterior o siguiente según la hora.
 */
function obtenerFechaHoyArgentina(): string {
    const partes = new Intl.DateTimeFormat("en-US", {
        timeZone: ZONA_HORARIA_ARGENTINA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const anio =
        partes.find((parte) => parte.type === "year")
            ?.value ?? "";

    const mes =
        partes.find((parte) => parte.type === "month")
            ?.value ?? "";

    const dia =
        partes.find((parte) => parte.type === "day")
            ?.value ?? "";

    if (!anio || !mes || !dia) {
        return "";
    }

    return `${anio}-${mes}-${dia}`;
}

/**
 * Formatea una fecha YYYY-MM-DD sin correrla de día por zona
 * horaria. Se usa el mediodía UTC y el helper compartido.
 */
function formatearFechaSeleccionada(
    fecha: string
): string {
    if (!fecha) {
        return "";
    }

    return formatFechaLargaArgentina(
        `${fecha}T12:00:00Z`
    );
}

// ============================================================
// ERRORES
// ============================================================

function obtenerMensajeErrorRecepcion(
    error: unknown,
    recurso: string
): string {
    if (!axios.isAxiosError(error)) {
        return `No pudimos cargar ${recurso}. Intentá nuevamente.`;
    }

    if (!error.response) {
        return `No pudimos comunicarnos con el servidor para cargar ${recurso}. Revisá la conexión e intentá nuevamente.`;
    }

    switch (error.response.status) {
        case 401:
            return "Tu sesión expiró. Iniciá sesión nuevamente.";

        case 403:
            return `No tenés autorización para consultar ${recurso}.`;

        case 500:
            return "Ocurrió un error en el servidor. Intentá nuevamente en unos minutos.";

        default:
            return `No pudimos cargar ${recurso}. Intentá nuevamente.`;
    }
}

// ============================================================
// PASOS
// ============================================================

interface PasoSeleccionProps {
    numero: number;
    titulo: string;
    descripcion: string;
    estado: EstadoPaso;
    children: ReactNode;
}

function PasoSeleccion({
    numero,
    titulo,
    descripcion,
    estado,
    children,
}: PasoSeleccionProps) {
    return (
        <section
            aria-disabled={estado === "bloqueado"}
            className={cn(
                "rounded-2xl border p-5 transition-colors sm:p-6",
                ESTILOS_PASO[estado]
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
                    {estado === "completado" ? (
                        <Check size={18} />
                    ) : estado === "bloqueado" ? (
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
                                ESTILOS_ETIQUETA[estado]
                            )}
                        >
                            {ETIQUETAS_ESTADO[estado]}
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
                    estado === "bloqueado" && "opacity-70"
                )}
            >
                {children}
            </div>
        </section>
    );
}

// ============================================================
// ESTADOS DE CONSULTA
// ============================================================

interface EstadoCargaRecepcionProps {
    mensaje: string;
}

function EstadoCargaRecepcion({
    mensaje,
}: EstadoCargaRecepcionProps) {
    return (
        <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500"
        >
            <LoaderCircle
                size={18}
                className="shrink-0 animate-spin text-blue-600"
            />

            <span>{mensaje}</span>
        </div>
    );
}

interface EstadoErrorRecepcionProps {
    mensaje: string;
    reintentando: boolean;
    onReintentar: () => void;
}

function EstadoErrorRecepcion({
    mensaje,
    reintentando,
    onReintentar,
}: EstadoErrorRecepcionProps) {
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
                        No pudimos cargar la información
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                        {mensaje}
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReintentar}
                        disabled={reintentando}
                        className="mt-3 h-9 rounded-lg border-red-200 bg-white px-3 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface EstadoVacioRecepcionProps {
    mensaje: string;
}

function EstadoVacioRecepcion({
    mensaje,
}: EstadoVacioRecepcionProps) {
    return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-sm leading-6 text-slate-500">
            {mensaje}
        </div>
    );
}

interface EstadoPendienteRecepcionProps {
    mensaje: string;
}

function EstadoPendienteRecepcion({
    mensaje,
}: EstadoPendienteRecepcionProps) {
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
// SELECTOR DE MÉDICOS
// ============================================================

interface SelectorMedicosProps {
    especialidadId: string;
    especialidadNombre: string;
    medicoSeleccionadoId: string;
    onSeleccionar: (medico: Medico | null) => void;
}

function SelectorMedicos({
    especialidadId,
    especialidadNombre,
    medicoSeleccionadoId,
    onSeleccionar,
}: SelectorMedicosProps) {
    const medicosQuery = useMedicos({
        especialidad: especialidadId,
        activo: true,
    });

    const medicos = (medicosQuery.data?.data ?? []).filter(
        (medico) => medico.activo
    );

    const medicoSeleccionado =
        medicos.find(
            (medico) => medico.id === medicoSeleccionadoId
        ) ?? null;

    const handleChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        const id = event.target.value;

        onSeleccionar(
            medicos.find((medico) => medico.id === id) ??
                null
        );
    };

    if (medicosQuery.isPending) {
        return (
            <EstadoCargaRecepcion mensaje="Cargando médicos de la especialidad..." />
        );
    }

    if (medicosQuery.isError) {
        return (
            <EstadoErrorRecepcion
                mensaje={obtenerMensajeErrorRecepcion(
                    medicosQuery.error,
                    "los médicos"
                )}
                reintentando={medicosQuery.isFetching}
                onReintentar={() => {
                    void medicosQuery.refetch();
                }}
            />
        );
    }

    if (medicos.length === 0) {
        return (
            <EstadoVacioRecepcion mensaje="No hay médicos activos para esta especialidad." />
        );
    }

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <label
                    htmlFor="medico-recepcion"
                    className="text-sm font-medium text-slate-700"
                >
                    Médico
                </label>

                <select
                    id="medico-recepcion"
                    value={medicoSeleccionadoId}
                    onChange={handleChange}
                    className={ESTILOS_CAMPO}
                >
                    <option value="">
                        Seleccioná un médico
                    </option>

                    {medicos.map((medico) => (
                        <option
                            key={medico.id}
                            value={medico.id}
                        >
                            {medico.apellido}, {medico.nombre}
                            {` — Mat. ${medico.matricula}`}
                        </option>
                    ))}
                </select>
            </div>

            {medicoSeleccionado && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                    <div className="flex items-start gap-2">
                        <UserRound
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                {medicoSeleccionado.apellido},{" "}
                                {medicoSeleccionado.nombre}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Matrícula{" "}
                                {medicoSeleccionado.matricula} ·{" "}
                                {especialidadNombre}
                            </p>

                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                <Clock3 size={13} />
                                Turnos de{" "}
                                {
                                    medicoSeleccionado.duracionTurno
                                }{" "}
                                minutos
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function SeleccionTurnoRecepcion({
    onHorarioSeleccionado,
    onCambiarSeleccion,
    bloqueada = false,
    horarioInvalidado = false,
}: SeleccionTurnoRecepcionProps) {
    const [especialidadSeleccionada, setEspecialidadSeleccionada] =
        useState<Especialidad | null>(null);

    const [medicoSeleccionado, setMedicoSeleccionado] =
        useState<Medico | null>(null);

    const [fechaSeleccionada, setFechaSeleccionada] =
        useState("");

    const [horarioSeleccionado, setHorarioSeleccionado] =
        useState<HorarioDisponible | null>(null);

    const [errorFecha, setErrorFecha] = useState("");

    const horarioInvalidadoRef = useRef<string | null>(
        null
    );

    const hoy = obtenerFechaHoyArgentina();

    // ========================================================
    // CONSULTAS
    // ========================================================

    const especialidadesQuery = useEspecialidades({
        activo: true,
    });

    const especialidades = (
        especialidadesQuery.data?.data ?? []
    ).filter((especialidad) => especialidad.activo);

    const disponibilidadQuery = useDisponibilidad(
        medicoSeleccionado?.id ?? "",
        fechaSeleccionada,
        {
            staleTime: 0,
            especialidadId:
                especialidadSeleccionada?.id ?? "",
        }
    );

    const horarios = useMemo(
        () =>
            disponibilidadQuery.data?.data.horarios ??
            [],
        [disponibilidadQuery.data]
    );

    // Solo se considera válido un horario que pertenezca a la
    // consulta actual. Si la disponibilidad cambia, la selección
    // deja de mostrarse como vigente.
    const horarioVigente =
        !horarioInvalidado &&
        horarioSeleccionado &&
        horarios.some(
            (horario) =>
                horario.inicio === horarioSeleccionado.inicio
        )
            ? horarioSeleccionado
            : null;

    const medicoNombreCompleto = medicoSeleccionado
        ? `${medicoSeleccionado.apellido}, ${medicoSeleccionado.nombre}`
        : "";

    // Si una consulta posterior deja de devolver el horario
    // elegido, se avisa a la página para que invalide su
    // selección. El horario tampoco se muestra como vigente.
    useEffect(() => {
        if (
            !horarioSeleccionado ||
            disponibilidadQuery.isPending ||
            disponibilidadQuery.isError ||
            horarios.some(
                (horario) =>
                    horario.inicio ===
                    horarioSeleccionado.inicio
            ) ||
            horarioInvalidadoRef.current ===
                horarioSeleccionado.inicio
        ) {
            return;
        }

        horarioInvalidadoRef.current =
            horarioSeleccionado.inicio;

        onCambiarSeleccion?.();
    }, [
        disponibilidadQuery.isError,
        disponibilidadQuery.isPending,
        horarioSeleccionado,
        horarios,
        onCambiarSeleccion,
    ]);

    // ========================================================
    // SELECCIONES
    // ========================================================

    const handleEspecialidadChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        const id = event.target.value;

        const especialidad =
            especialidades.find(
                (item) => item.id === id
            ) ?? null;

        if (
            (especialidad?.id ?? "") ===
            (especialidadSeleccionada?.id ?? "")
        ) {
            return;
        }

        if (horarioSeleccionado) {
            onCambiarSeleccion?.();
        }

        setEspecialidadSeleccionada(especialidad);
        setMedicoSeleccionado(null);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setErrorFecha("");
    };

    const handleSeleccionarMedico = (
        medico: Medico | null
    ) => {
        if (
            (medico?.id ?? "") ===
            (medicoSeleccionado?.id ?? "")
        ) {
            return;
        }

        if (horarioSeleccionado) {
            onCambiarSeleccion?.();
        }

        setMedicoSeleccionado(medico);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setErrorFecha("");
    };

    const handleFechaChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const fecha = event.target.value;

        if (fecha === fechaSeleccionada) {
            return;
        }

        if (horarioSeleccionado) {
            onCambiarSeleccion?.();
        }

        setHorarioSeleccionado(null);
        setErrorFecha("");

        if (!fecha) {
            setFechaSeleccionada("");
            return;
        }

        if (fecha < hoy) {
            setFechaSeleccionada("");
            setErrorFecha(
                "Seleccioná una fecha de hoy en adelante."
            );
            return;
        }

        setFechaSeleccionada(fecha);
    };

    const handleSeleccionarHorario = (
        horario: HorarioDisponible
    ) => {
        if (
            !especialidadSeleccionada ||
            !medicoSeleccionado ||
            !fechaSeleccionada
        ) {
            return;
        }

        if (
            !horarioInvalidado &&
            horarioSeleccionado?.inicio === horario.inicio
        ) {
            return;
        }

        horarioInvalidadoRef.current = null;
        setHorarioSeleccionado(horario);

        onHorarioSeleccionado({
            especialidad: especialidadSeleccionada.id,
            especialidadNombre:
                especialidadSeleccionada.nombre,
            medico: medicoSeleccionado.id,
            medicoNombre: medicoNombreCompleto,
            // Se conserva el valor original del slot.
            fechaTurno: horario.inicio,
            fechaFin: horario.fin,
            horaLocal: horario.horaLocal,
        });
    };

    const handleLimpiarSeleccion = () => {
        setEspecialidadSeleccionada(null);
        setMedicoSeleccionado(null);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setErrorFecha("");
        onCambiarSeleccion?.();
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <fieldset
            disabled={bloqueada}
            aria-busy={bloqueada}
            className="m-0 min-w-0 space-y-4 border-0 p-0"
        >
            {/* PASO 1: ESPECIALIDAD */}

            <PasoSeleccion
                numero={1}
                titulo="Especialidad"
                descripcion="Elegí el área médica para el turno."
                estado={
                    especialidadSeleccionada
                        ? "completado"
                        : "activo"
                }
            >
                {especialidadesQuery.isPending && (
                    <EstadoCargaRecepcion mensaje="Cargando especialidades..." />
                )}

                {especialidadesQuery.isError && (
                    <EstadoErrorRecepcion
                        mensaje={obtenerMensajeErrorRecepcion(
                            especialidadesQuery.error,
                            "las especialidades"
                        )}
                        reintentando={
                            especialidadesQuery.isFetching
                        }
                        onReintentar={() => {
                            void especialidadesQuery.refetch();
                        }}
                    />
                )}

                {!especialidadesQuery.isPending &&
                    !especialidadesQuery.isError &&
                    especialidades.length === 0 && (
                        <EstadoVacioRecepcion mensaje="No hay especialidades activas disponibles." />
                    )}

                {!especialidadesQuery.isPending &&
                    !especialidadesQuery.isError &&
                    especialidades.length > 0 && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label
                                    htmlFor="especialidad-recepcion"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Especialidad
                                </label>

                                <select
                                    id="especialidad-recepcion"
                                    value={
                                        especialidadSeleccionada?.id ??
                                        ""
                                    }
                                    onChange={
                                        handleEspecialidadChange
                                    }
                                    className={ESTILOS_CAMPO}
                                >
                                    <option value="">
                                        Seleccioná una especialidad
                                    </option>

                                    {especialidades.map(
                                        (especialidad) => (
                                            <option
                                                key={
                                                    especialidad.id
                                                }
                                                value={
                                                    especialidad.id
                                                }
                                            >
                                                {
                                                    especialidad.nombre
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {especialidadSeleccionada?.descripcion && (
                                <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-700">
                                    {
                                        especialidadSeleccionada.descripcion
                                    }
                                </p>
                            )}
                        </div>
                    )}
            </PasoSeleccion>

            {/* PASO 2: MÉDICO */}

            <PasoSeleccion
                numero={2}
                titulo="Médico"
                descripcion="Seleccioná un profesional activo de la especialidad."
                estado={
                    !especialidadSeleccionada
                        ? "bloqueado"
                        : medicoSeleccionado
                          ? "completado"
                          : "activo"
                }
            >
                {!especialidadSeleccionada ? (
                    <EstadoPendienteRecepcion mensaje="Seleccioná una especialidad para ver los médicos disponibles." />
                ) : (
                    <SelectorMedicos
                        especialidadId={
                            especialidadSeleccionada.id
                        }
                        especialidadNombre={
                            especialidadSeleccionada.nombre
                        }
                        medicoSeleccionadoId={
                            medicoSeleccionado?.id ?? ""
                        }
                        onSeleccionar={
                            handleSeleccionarMedico
                        }
                    />
                )}
            </PasoSeleccion>

            {/* PASO 3: FECHA */}

            <PasoSeleccion
                numero={3}
                titulo="Fecha"
                descripcion="Elegí el día para consultar la disponibilidad."
                estado={
                    !medicoSeleccionado
                        ? "bloqueado"
                        : fechaSeleccionada
                          ? "completado"
                          : "activo"
                }
            >
                {!medicoSeleccionado ? (
                    <EstadoPendienteRecepcion mensaje="Seleccioná un médico para elegir la fecha." />
                ) : (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label
                                htmlFor="fecha-recepcion"
                                className="text-sm font-medium text-slate-700"
                            >
                                Fecha del turno
                            </label>

                            <input
                                id="fecha-recepcion"
                                type="date"
                                min={hoy}
                                value={fechaSeleccionada}
                                onChange={handleFechaChange}
                                aria-invalid={Boolean(
                                    errorFecha
                                )}
                                className={ESTILOS_CAMPO}
                            />

                            {errorFecha ? (
                                <p className="text-xs font-medium text-red-600">
                                    {errorFecha}
                                </p>
                            ) : (
                                <p className="text-xs leading-5 text-slate-500">
                                    Solo se permiten fechas desde
                                    hoy,{" "}
                                    {formatearFechaSeleccionada(
                                        hoy
                                    )}
                                    . La fecha se calcula con la
                                    hora de Argentina.
                                </p>
                            )}
                        </div>

                        {fechaSeleccionada && (
                            <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-700">
                                Fecha seleccionada:{" "}
                                {formatearFechaSeleccionada(
                                    fechaSeleccionada
                                )}
                            </p>
                        )}
                    </div>
                )}
            </PasoSeleccion>

            {/* PASO 4: DISPONIBILIDAD Y HORARIO */}

            <PasoSeleccion
                numero={4}
                titulo="Horario disponible"
                descripcion="Elegí uno de los horarios libres para el día seleccionado."
                estado={
                    !medicoSeleccionado || !fechaSeleccionada
                        ? "bloqueado"
                        : horarioVigente
                          ? "completado"
                          : "activo"
                }
            >
                {!medicoSeleccionado || !fechaSeleccionada ? (
                    <EstadoPendienteRecepcion mensaje="Seleccioná un médico y una fecha para consultar los horarios." />
                ) : disponibilidadQuery.isPending ? (
                    <EstadoCargaRecepcion mensaje="Consultando disponibilidad..." />
                ) : disponibilidadQuery.isError ? (
                    <EstadoErrorRecepcion
                        mensaje={obtenerMensajeErrorRecepcion(
                            disponibilidadQuery.error,
                            "la disponibilidad"
                        )}
                        reintentando={
                            disponibilidadQuery.isFetching
                        }
                        onReintentar={() => {
                            void disponibilidadQuery.refetch();
                        }}
                    />
                ) : horarios.length === 0 ? (
                    <EstadoVacioRecepcion
                        mensaje={`No hay horarios disponibles para ${formatearFechaSeleccionada(
                            fechaSeleccionada
                        )}. Probá con otra fecha.`}
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {horarios.map((horario) => {
                                const seleccionado =
                                    horarioVigente?.inicio ===
                                    horario.inicio;

                                return (
                                    <button
                                        key={horario.inicio}
                                        type="button"
                                        aria-pressed={
                                            seleccionado
                                        }
                                        aria-label={`Seleccionar horario ${horario.horaLocal}`}
                                        onClick={() =>
                                            handleSeleccionarHorario(
                                                horario
                                            )
                                        }
                                        className={cn(
                                            "inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
                                            seleccionado
                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                        )}
                                    >
                                        <Clock3 size={14} />

                                        {horario.horaLocal}
                                    </button>
                                );
                            })}
                        </div>

                        {!horarioVigente && (
                            <p className="text-xs leading-5 text-slate-500">
                                Seleccioná un horario para
                                completar la selección del turno.
                            </p>
                        )}

                        {horarioVigente && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                            <CalendarCheck
                                                size={19}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                Horario
                                                seleccionado
                                            </p>

                                            <p className="mt-1 font-semibold text-slate-900">
                                                {formatearFechaSeleccionada(
                                                    fechaSeleccionada
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm leading-5 text-slate-600">
                                                {
                                                    horarioVigente.horaLocal
                                                }{" "}
                                                hs ·{" "}
                                                {
                                                    especialidadSeleccionada?.nombre
                                                }{" "}
                                                ·{" "}
                                                {
                                                    medicoNombreCompleto
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={
                                            handleLimpiarSeleccion
                                        }
                                        className="h-9 rounded-lg border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Limpiar selección
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </PasoSeleccion>
        </fieldset>
    );
}
