import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { toast } from "sonner";

import {
    AlertCircle,
    CalendarPlus,
} from "lucide-react";

import ReservaTurnoExitosa from "@/components/portal/ReservaTurnoExitosa";

import {
    EstadoCarga,
    EstadoError,
    EstadoPendiente,
    EstadoVacio,
    OpcionEspecialidad,
    OpcionHorario,
    OpcionMedico,
    ResumenReserva,
    SeccionReserva,
    type EstadoSeccion,
} from "@/components/portal/ReservaTurnoUI";

import { useEspecialidadesDisponibles } from "@/hooks/useEspecialidades";
import { useMedicosDisponibles } from "@/hooks/useMedicos";
import {
    useCrearMiTurno,
    useDisponibilidad,
} from "@/hooks/useTurnos";

import type { EspecialidadDisponible } from "@/types/especialidad";
import type { MedicoDisponible } from "@/types/medico";
import type {
    CrearMiTurnoData,
    HorarioDisponible,
    MiTurno,
} from "@/types/turno";

const ZONA_HORARIA_ARGENTINA =
    "America/Argentina/Buenos_Aires";

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
 * Formatea una fecha YYYY-MM-DD sin convertirla a otro día por
 * zona horaria. Se usa UTC al mediodía para preservar el calendario.
 */
function formatearFechaSeleccionada(
    fecha: string
): string {
    if (!fecha) {
        return "";
    }

    const [anio, mes, dia] = fecha
        .split("-")
        .map(Number);

    if (!anio || !mes || !dia) {
        return "";
    }

    const fechaUtc = new Date(
        Date.UTC(anio, mes - 1, dia, 12)
    );

    if (Number.isNaN(fechaUtc.getTime())) {
        return "";
    }

    const texto = new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(fechaUtc);

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ============================================================
// ERRORES
// ============================================================

interface MensajeErrorReserva {
    titulo: string;
    descripcion: string;
}

function obtenerMensajeErrorReserva(
    error: unknown
): MensajeErrorReserva {
    if (!axios.isAxiosError(error)) {
        return {
            titulo: "No pudimos confirmar la reserva",
            descripcion:
                "Intentá nuevamente en unos minutos.",
        };
    }

    if (!error.response) {
        return {
            titulo: "No pudimos comunicarnos con el servidor",
            descripcion:
                "Revisá tu conexión e intentá nuevamente.",
        };
    }

    switch (error.response.status) {
        case 400:
            return {
                titulo: "No pudimos confirmar la reserva",
                descripcion:
                    "Revisá los datos seleccionados e intentá nuevamente.",
            };

        case 401:
            return {
                titulo: "Tu sesión expiró",
                descripcion:
                    "Iniciá sesión nuevamente para continuar.",
            };

        case 403:
            return {
                titulo: "No tenés autorización para reservar este turno",
                descripcion:
                    "Comunicate con la sala si el problema continúa.",
            };

        case 404:
            return {
                titulo: "La información de la reserva ya no está disponible",
                descripcion:
                    "Volvé a seleccionar la especialidad y el médico.",
            };

        case 500:
            return {
                titulo: "No pudimos confirmar la reserva",
                descripcion:
                    "Ocurrió un error en el servidor. Intentá nuevamente en unos minutos.",
            };

        default:
            return {
                titulo: "No pudimos confirmar la reserva",
                descripcion:
                    "Intentá nuevamente en unos minutos.",
            };
    }
}

// ============================================================
// PÁGINA
// ============================================================

export default function ReservarTurnoPage() {
    const [especialidadSeleccionada, setEspecialidadSeleccionada] =
        useState<EspecialidadDisponible | null>(null);

    const [medicoSeleccionado, setMedicoSeleccionado] =
        useState<MedicoDisponible | null>(null);

    const [fechaSeleccionada, setFechaSeleccionada] =
        useState("");

    const [horarioSeleccionado, setHorarioSeleccionado] =
        useState<HorarioDisponible | null>(null);

    const [observaciones, setObservaciones] = useState("");

    const [errorFecha, setErrorFecha] = useState("");

    const [turnoConfirmado, setTurnoConfirmado] =
        useState<MiTurno | null>(null);

    // Evita que dos clics muy rápidos disparen dos creaciones antes
    // de que React vuelva a renderizar con isPending en true.
    const envioEnCursoRef = useRef(false);

    const hoy = obtenerFechaHoyArgentina();

    useEffect(() => {
        if (turnoConfirmado) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [turnoConfirmado]);

    // ========================================================
    // CONSULTAS
    // ========================================================

    const especialidadesQuery =
        useEspecialidadesDisponibles();

    const medicosQuery = useMedicosDisponibles(
        especialidadSeleccionada?.id ?? ""
    );

    const disponibilidadQuery = useDisponibilidad(
        medicoSeleccionado?.id ?? "",
        fechaSeleccionada,
        {
            especialidadId:
                especialidadSeleccionada?.id ?? "",
        }
    );

    const crearTurnoMutation = useCrearMiTurno();

    const especialidades =
        especialidadesQuery.data?.data ?? [];

    const medicos = medicosQuery.data?.data ?? [];

    const horarios =
        disponibilidadQuery.data?.data.horarios ?? [];

    const puedeConfirmar =
        Boolean(especialidadSeleccionada) &&
        Boolean(medicoSeleccionado) &&
        Boolean(fechaSeleccionada) &&
        Boolean(horarioSeleccionado);

    // ========================================================
    // SELECCIONES
    // ========================================================

    const handleSeleccionarEspecialidad = (
        especialidad: EspecialidadDisponible
    ) => {
        if (
            especialidad.id ===
            especialidadSeleccionada?.id
        ) {
            return;
        }

        setEspecialidadSeleccionada(especialidad);
        setMedicoSeleccionado(null);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setErrorFecha("");
    };

    const handleSeleccionarMedico = (
        medico: MedicoDisponible
    ) => {
        if (medico.id === medicoSeleccionado?.id) {
            return;
        }

        setMedicoSeleccionado(medico);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setErrorFecha("");
    };

    const handleCambiarFecha = (fecha: string) => {
        // Al cambiar el día, el horario anterior deja de ser válido.
        setHorarioSeleccionado(null);

        if (!fecha) {
            setFechaSeleccionada("");
            setErrorFecha("");
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
        setErrorFecha("");
    };

    const handleSeleccionarHorario = (
        horario: HorarioDisponible
    ) => {
        // Se conserva el objeto completo: la confirmación envía
        // exactamente horario.inicio al backend.
        setHorarioSeleccionado(horario);
    };

    // ========================================================
    // CONFIRMACIÓN
    // ========================================================

    const handleConfirmar = async () => {
        if (
            !puedeConfirmar ||
            envioEnCursoRef.current ||
            !especialidadSeleccionada ||
            !medicoSeleccionado ||
            !horarioSeleccionado
        ) {
            return;
        }

        envioEnCursoRef.current = true;

        const observacionesLimpias = observaciones.trim();

        const datos: CrearMiTurnoData = {
            especialidad: especialidadSeleccionada.id,
            medico: medicoSeleccionado.id,
            // Se envía el inicio exacto devuelto por disponibilidad.
            fechaTurno: horarioSeleccionado.inicio,
        };

        // Las observaciones son opcionales: si están vacías o solo
        // contienen espacios, la propiedad no se envía.
        if (observacionesLimpias) {
            datos.observaciones = observacionesLimpias;
        }

        let creacionExitosa = false;

        try {
            const respuesta =
                await crearTurnoMutation.mutateAsync(datos);

            setTurnoConfirmado(respuesta.data);
            creacionExitosa = true;
        } catch (error: unknown) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 409
            ) {
                // El horario dejó de estar disponible. Se conservan
                // especialidad, médico y fecha; solo se limpia el
                // horario y se vuelve a consultar la disponibilidad.
                setHorarioSeleccionado(null);

                toast.warning(
                    "El horario ya no está disponible",
                    {
                        description:
                            "La disponibilidad cambió. Elegí otro horario.",
                    }
                );

                await disponibilidadQuery.refetch();
                return;
            }

            console.error(
                "Error al confirmar el turno:",
                error
            );

            const mensaje =
                obtenerMensajeErrorReserva(error);

            toast.error(mensaje.titulo, {
                description: mensaje.descripcion,
            });
        } finally {
            // Tras un alta exitosa el formulario se reemplaza por la
            // pantalla de éxito; el bloqueo se libera al reservar otro.
            if (!creacionExitosa) {
                envioEnCursoRef.current = false;
            }
        }
    };

    const handleReservarOtro = () => {
        setEspecialidadSeleccionada(null);
        setMedicoSeleccionado(null);
        setFechaSeleccionada("");
        setHorarioSeleccionado(null);
        setObservaciones("");
        setErrorFecha("");
        setTurnoConfirmado(null);
        crearTurnoMutation.reset();
        envioEnCursoRef.current = false;
    };

    // ========================================================
    // ESTADOS DE LAS SECCIONES
    // ========================================================

    const estadoEspecialidad: EstadoSeccion =
        especialidadSeleccionada
            ? "completada"
            : "disponible";

    const estadoMedico: EstadoSeccion =
        !especialidadSeleccionada
            ? "bloqueada"
            : medicoSeleccionado
              ? "completada"
              : "disponible";

    const estadoFecha: EstadoSeccion =
        !medicoSeleccionado
            ? "bloqueada"
            : fechaSeleccionada
              ? "completada"
              : "disponible";

    const estadoHorario: EstadoSeccion =
        !fechaSeleccionada
            ? "bloqueada"
            : horarioSeleccionado
              ? "completada"
              : "disponible";

    // ========================================================
    // RESUMEN
    // ========================================================

    const nombreEspecialidad =
        especialidadSeleccionada?.nombre;

    const nombreMedico = medicoSeleccionado
        ? `${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}`
        : undefined;

    const fechaTexto =
        formatearFechaSeleccionada(fechaSeleccionada) ||
        undefined;

    const horarioTexto = horarioSeleccionado?.horaLocal;

    const observacionesTexto = observaciones.trim();

    if (turnoConfirmado) {
        return (
            <ReservaTurnoExitosa
                turno={turnoConfirmado}
                onReservarOtro={handleReservarOtro}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* ENCABEZADO */}
            <header className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                    <CalendarPlus size={22} />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Reservar turno
                    </h1>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Elegí una especialidad, un profesional y
                        un horario disponible. Podés revisar todo
                        antes de confirmar.
                    </p>
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="space-y-4 sm:space-y-5">
                    {/* 1. ESPECIALIDAD */}
                    <SeccionReserva
                        numero={1}
                        titulo="Especialidad"
                        descripcion="Elegí el área médica para tu atención."
                        estado={estadoEspecialidad}
                    >
                        {especialidadesQuery.isLoading ? (
                            <EstadoCarga mensaje="Cargando especialidades..." />
                        ) : especialidadesQuery.isError ? (
                            <EstadoError
                                mensaje="No pudimos cargar las especialidades."
                                reintentando={
                                    especialidadesQuery.isFetching
                                }
                                onReintentar={() =>
                                    void especialidadesQuery.refetch()
                                }
                            />
                        ) : especialidades.length === 0 ? (
                            <EstadoVacio mensaje="No hay especialidades disponibles en este momento. Intentá nuevamente más tarde." />
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {especialidades.map(
                                    (especialidad) => (
                                        <OpcionEspecialidad
                                            key={especialidad.id}
                                            especialidad={especialidad}
                                            seleccionada={
                                                especialidadSeleccionada?.id ===
                                                especialidad.id
                                            }
                                            onSeleccionar={
                                                handleSeleccionarEspecialidad
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </SeccionReserva>

                    {/* 2. MÉDICO */}
                    <SeccionReserva
                        numero={2}
                        titulo="Médico"
                        descripcion="Seleccioná el profesional que te va a atender."
                        estado={estadoMedico}
                    >
                        {!especialidadSeleccionada ? (
                            <EstadoPendiente mensaje="Elegí una especialidad para ver los médicos disponibles." />
                        ) : medicosQuery.isLoading ? (
                            <EstadoCarga mensaje="Cargando médicos disponibles..." />
                        ) : medicosQuery.isError ? (
                            <EstadoError
                                mensaje="No pudimos cargar los médicos disponibles."
                                reintentando={
                                    medicosQuery.isFetching
                                }
                                onReintentar={() =>
                                    void medicosQuery.refetch()
                                }
                            />
                        ) : medicos.length === 0 ? (
                            <EstadoVacio mensaje="No hay médicos disponibles para esta especialidad." />
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {medicos.map((medico) => (
                                    <OpcionMedico
                                        key={medico.id}
                                        medico={medico}
                                        seleccionado={
                                            medicoSeleccionado?.id ===
                                            medico.id
                                        }
                                        onSeleccionar={
                                            handleSeleccionarMedico
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </SeccionReserva>

                    {/* 3. FECHA */}
                    <SeccionReserva
                        numero={3}
                        titulo="Fecha"
                        descripcion="Elegí el día de tu atención. No se permiten fechas anteriores a hoy."
                        estado={estadoFecha}
                    >
                        {!medicoSeleccionado ? (
                            <EstadoPendiente mensaje="Elegí un médico para seleccionar la fecha." />
                        ) : (
                            <div className="space-y-2">
                                <label
                                    htmlFor="fecha-turno"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Fecha de atención
                                </label>

                                <input
                                    id="fecha-turno"
                                    type="date"
                                    min={hoy}
                                    value={fechaSeleccionada}
                                    onChange={(event) =>
                                        handleCambiarFecha(
                                            event.target.value
                                        )
                                    }
                                    aria-describedby="fecha-turno-ayuda"
                                    aria-invalid={Boolean(
                                        errorFecha
                                    )}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 aria-invalid:border-red-400"
                                />

                                <p
                                    id="fecha-turno-ayuda"
                                    className="text-xs text-slate-500"
                                >
                                    La disponibilidad se consulta en
                                    hora de Argentina.
                                </p>

                                {errorFecha && (
                                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                        <AlertCircle size={13} />
                                        {errorFecha}
                                    </p>
                                )}

                                {fechaSeleccionada &&
                                    !errorFecha && (
                                        <p className="rounded-lg bg-cyan-50 px-3 py-2 text-xs text-cyan-800">
                                            Fecha elegida:{" "}
                                            <span className="font-semibold">
                                                {fechaTexto}
                                            </span>
                                        </p>
                                    )}
                            </div>
                        )}
                    </SeccionReserva>

                    {/* 4. HORARIO */}
                    <SeccionReserva
                        numero={4}
                        titulo="Horario"
                        descripcion={
                            medicoSeleccionado
                                ? `Horarios disponibles para una consulta de ${medicoSeleccionado.duracionTurno} minutos.`
                                : "Seleccioná un médico y una fecha para consultar los horarios."
                        }
                        estado={estadoHorario}
                    >
                        {!fechaSeleccionada ? (
                            <EstadoPendiente mensaje="Seleccioná una fecha para consultar los horarios disponibles." />
                        ) : disponibilidadQuery.isFetching ? (
                            <EstadoCarga mensaje="Consultando horarios disponibles..." />
                        ) : disponibilidadQuery.isError ? (
                            <EstadoError
                                mensaje="No pudimos consultar los horarios disponibles."
                                reintentando={
                                    disponibilidadQuery.isFetching
                                }
                                onReintentar={() =>
                                    void disponibilidadQuery.refetch()
                                }
                            />
                        ) : horarios.length === 0 ? (
                            <EstadoVacio mensaje="No hay horarios disponibles para esa fecha. Probá con otro día." />
                        ) : (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {horarios.map((horario) => (
                                    <OpcionHorario
                                        key={horario.inicio}
                                        horario={horario}
                                        seleccionado={
                                            horarioSeleccionado?.inicio ===
                                            horario.inicio
                                        }
                                        onSeleccionar={
                                            handleSeleccionarHorario
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </SeccionReserva>

                    {/* 5. OBSERVACIONES */}
                    <SeccionReserva
                        numero={5}
                        titulo="Observaciones"
                        descripcion="Podés agregar una nota para el profesional. Es un campo opcional."
                        estado="disponible"
                        etiqueta="Opcional"
                    >
                        <div className="space-y-2">
                            <label
                                htmlFor="observaciones-turno"
                                className="text-sm font-medium text-slate-700"
                            >
                                Observaciones
                            </label>

                            <textarea
                                id="observaciones-turno"
                                value={observaciones}
                                onChange={(event) =>
                                    setObservaciones(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                maxLength={500}
                                placeholder="Agregá una nota para el profesional (opcional)."
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />

                            <div className="flex justify-end">
                                <span
                                    className={
                                        observaciones.length > 450
                                            ? "text-xs font-medium text-amber-600"
                                            : "text-xs text-slate-400"
                                    }
                                >
                                    {observaciones.length}/500
                                </span>
                            </div>
                        </div>
                    </SeccionReserva>
                </div>

                {/* RESUMEN Y CONFIRMACIÓN */}
                <ResumenReserva
                    especialidad={nombreEspecialidad}
                    medico={nombreMedico}
                    fecha={fechaTexto}
                    horario={horarioTexto}
                    observaciones={
                        observacionesTexto || undefined
                    }
                    puedeConfirmar={puedeConfirmar}
                    confirmando={crearTurnoMutation.isPending}
                    onConfirmar={handleConfirmar}
                />
            </div>
        </div>
    );
}
