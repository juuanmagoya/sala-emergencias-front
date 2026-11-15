import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { Link } from "react-router-dom";

import axios from "axios";

import {
    AlertCircle,
    CalendarClock,
    CalendarDays,
    CalendarPlus,
    LoaderCircle,
    RotateCcw,
} from "lucide-react";

import TurnoHistorialCard from "@/components/portal/TurnoHistorialCard";

import { useMiHistorialTurnos } from "@/hooks/useTurnos";

import { cn } from "@/lib/utils";

import {
    clasificarTurnos,
    type CategoriaTurno,
} from "@/lib/turnosHistorial";

const CATEGORIAS: ReadonlyArray<{
    id: CategoriaTurno;
    etiqueta: string;
}> = [
    {
        id: "proximos",
        etiqueta: "Próximos",
    },
    {
        id: "anteriores",
        etiqueta: "Anteriores",
    },
    {
        id: "cancelados",
        etiqueta: "Cancelados",
    },
];

interface MensajeError {
    titulo: string;
    descripcion: string;
    esPermiso: boolean;
}

function obtenerMensajeError(error: unknown): MensajeError {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
            return {
                titulo:
                    "No tenés permisos para consultar tus turnos.",
                descripcion:
                    "Volvé al inicio de tu portal. Si el problema continúa, comunicate con la sala.",
                esPermiso: true,
            };
        }

        if (!error.response) {
            return {
                titulo:
                    "No pudimos comunicarnos con el servidor.",
                descripcion:
                    "Revisá tu conexión e intentá nuevamente.",
                esPermiso: false,
            };
        }
    }

    return {
        titulo: "No pudimos cargar tus turnos.",
        descripcion:
            "Ocurrió un error al consultar tu historial. Intentá nuevamente en unos instantes.",
        esPermiso: false,
    };
}

interface EstadoVacioProps {
    titulo: string;
    descripcion: string;
    mostrarCta?: boolean;
}

function EstadoVacio({
    titulo,
    descripcion,
    mostrarCta = false,
}: EstadoVacioProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <CalendarClock size={26} />
            </div>

            <h2 className="text-base font-semibold text-slate-800">
                {titulo}
            </h2>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                {descripcion}
            </p>

            {mostrarCta && (
                <Link
                    to="/portal/reservar-turno"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                    <CalendarPlus size={16} />
                    Reservar un turno
                </Link>
            )}
        </div>
    );
}

interface EstadoVacioCategoria {
    titulo: string;
    descripcion: string;
    mostrarCta: boolean;
}

function obtenerEstadoVacioCategoria(
    categoria: CategoriaTurno
): EstadoVacioCategoria {
    if (categoria === "proximos") {
        return {
            titulo: "No tenés próximos turnos registrados.",
            descripcion:
                "Cuando reserves un turno, vas a poder consultarlo desde acá.",
            mostrarCta: true,
        };
    }

    if (categoria === "anteriores") {
        return {
            titulo: "Todavía no tenés turnos anteriores.",
            descripcion:
                "Los turnos atendidos o con fecha pasada aparecerán en esta sección.",
            mostrarCta: false,
        };
    }

    return {
        titulo: "No tenés turnos cancelados.",
        descripcion:
            "Los turnos cancelados aparecerán en esta sección.",
        mostrarCta: false,
    };
}

interface EstadoErrorProps {
    mensaje: MensajeError;
    reintentando: boolean;
    onReintentar: () => void;
}

function EstadoError({
    mensaje,
    reintentando,
    onReintentar,
}: EstadoErrorProps) {
    return (
        <div className="flex min-h-[320px] items-center justify-center px-4">
            <div
                role="alert"
                className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
            >
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

                <h2 className="font-semibold text-red-800">
                    {mensaje.titulo}
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-700">
                    {mensaje.descripcion}
                </p>

                {mensaje.esPermiso ? (
                    <Link
                        to="/portal"
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Volver al inicio
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={onReintentar}
                        disabled={reintentando}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RotateCcw
                            size={16}
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
                )}
            </div>
        </div>
    );
}

export default function MisTurnosPage() {
    const {
        data,
        error,
        isLoading,
        isError,
        isRefetchError,
        isFetching,
        refetch,
    } = useMiHistorialTurnos();

    const [categoriaActiva, setCategoriaActiva] =
        useState<CategoriaTurno>("proximos");

    const [ahora, setAhora] = useState(() => Date.now());

    // Permite que un turno pase de Próximos a Anteriores mientras
    // la página permanece abierta.
    useEffect(() => {
        const intervalo = window.setInterval(() => {
            setAhora(Date.now());
        }, 60_000);

        return () => {
            window.clearInterval(intervalo);
        };
    }, []);

    const turnos = useMemo(
        () => data?.data ?? [],
        [data]
    );

    const clasificados = useMemo(
        () => clasificarTurnos(turnos, ahora),
        [turnos, ahora]
    );

    const total = turnos.length;
    const hayDatos = Boolean(data);
    const mensajeError = obtenerMensajeError(error);

    const mostrarCarga = isLoading && !hayDatos;
    const mostrarErrorSinDatos = isError && !hayDatos;
    const mostrarErrorConDatos =
        hayDatos && (isError || isRefetchError);
    const mostrarActualizacion =
        isFetching && !isLoading && hayDatos;

    const turnosCategoria = clasificados[categoriaActiva];

    const categorias = CATEGORIAS.map((categoria) => ({
        ...categoria,
        cantidad: clasificados[categoria.id].length,
    }));

    const estadoVacioCategoria =
        obtenerEstadoVacioCategoria(categoriaActiva);

    return (
        <div className="space-y-6">
            {/* ENCABEZADO */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                        <CalendarClock size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Mis turnos
                        </h1>

                        <p className="text-sm text-slate-500">
                            Consultá tus próximos turnos y revisá
                            tu historial de atenciones.
                        </p>
                    </div>
                </div>

                {!isLoading && total > 0 && (
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 sm:self-auto">
                        <CalendarDays size={14} />

                        {total}{" "}
                        {total === 1 ? "turno" : "turnos"}
                    </span>
                )}
            </header>

            {/* CARGANDO */}
            {mostrarCarga && (
                <div
                    role="status"
                    className="flex min-h-[320px] items-center justify-center"
                >
                    <div className="flex items-center gap-3 text-slate-500">
                        <LoaderCircle className="h-6 w-6 animate-spin" />

                        <span className="text-sm">
                            Cargando tus turnos...
                        </span>
                    </div>
                </div>
            )}

            {/* ERROR SIN DATOS */}
            {mostrarErrorSinDatos && (
                <EstadoError
                    mensaje={mensajeError}
                    reintentando={isFetching}
                    onReintentar={() => void refetch()}
                />
            )}

            {/* ERROR CON DATOS PREVIOS */}
            {mostrarErrorConDatos && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-start gap-2">
                        <AlertCircle
                            size={17}
                            className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <p className="text-sm leading-6 text-amber-800">
                            No se pudo actualizar el historial.
                            Se muestran los últimos datos
                            disponibles.
                        </p>
                    </div>

                    {!mensajeError.esPermiso && (
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            disabled={isFetching}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RotateCcw
                                size={14}
                                className={
                                    isFetching
                                        ? "animate-spin"
                                        : undefined
                                }
                            />

                            {isFetching
                                ? "Reintentando..."
                                : "Reintentar"}
                        </button>
                    )}
                </div>
            )}

            {/* ACTUALIZANDO */}
            {mostrarActualizacion && (
                <p
                    role="status"
                    className="inline-flex items-center gap-2 text-xs text-slate-500"
                >
                    <LoaderCircle
                        size={14}
                        className="animate-spin"
                    />
                    Actualizando...
                </p>
            )}

            {/* SIN TURNOS EN TOTAL */}
            {!mostrarCarga &&
                !mostrarErrorSinDatos &&
                total === 0 && (
                    <EstadoVacio
                        titulo="Todavía no tenés turnos registrados."
                        descripcion="Cuando reserves tu primer turno, vas a poder consultarlo desde acá."
                        mostrarCta
                    />
                )}

            {/* CON TURNOS */}
            {!mostrarCarga &&
                !mostrarErrorSinDatos &&
                total > 0 && (
                    <>
                        <div
                            role="group"
                            aria-label="Categorías del historial de turnos"
                            className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                        >
                            {categorias.map((categoria) => {
                                const activa =
                                    categoriaActiva === categoria.id;

                                return (
                                    <button
                                        key={categoria.id}
                                        type="button"
                                        aria-pressed={activa}
                                        onClick={() =>
                                            setCategoriaActiva(
                                                categoria.id
                                            )
                                        }
                                        className={cn(
                                            "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium transition sm:flex-row sm:gap-2 sm:px-3 sm:text-sm",
                                            activa
                                                ? "bg-cyan-600 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <span className="truncate">
                                            {categoria.etiqueta}
                                        </span>

                                        <span
                                            className={cn(
                                                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                                                activa
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-100 text-slate-600"
                                            )}
                                        >
                                            {categoria.cantidad}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {categoriaActiva === "anteriores" && (
                            <p className="text-xs leading-5 text-slate-500">
                                Incluye turnos atendidos, turnos
                                con fecha pasada y registros
                                antiguos sin estado registrado.
                            </p>
                        )}

                        {turnosCategoria.length === 0 ? (
                            <EstadoVacio
                                titulo={estadoVacioCategoria.titulo}
                                descripcion={
                                    estadoVacioCategoria.descripcion
                                }
                                mostrarCta={
                                    estadoVacioCategoria.mostrarCta
                                }
                            />
                        ) : (
                            <div className="space-y-4">
                                {turnosCategoria.map((turno) => (
                                    <TurnoHistorialCard
                                        key={turno.id}
                                        turno={turno}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
        </div>
    );
}
