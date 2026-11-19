import { useRef, useState } from "react";

import axios from "axios";
import { toast } from "sonner";

import {
    AlertCircle,
    CalendarCheck,
    CircleCheck,
    ClipboardCheck,
    FileText,
    HeartPulse,
    IdCard,
    LoaderCircle,
    Pencil,
    Phone,
    Search,
    UserPlus,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { InfoCard } from "@/components/pacientes/PacienteInfoCards";
import { formatFechaLargaArgentina } from "@/components/shared/formatDate";

import BusquedaPacienteCard from "@/components/recepcion/BusquedaPacienteCard";
import ConfirmacionRecepcion from "@/components/recepcion/ConfirmacionRecepcion";
import PacienteIdentificadoCard from "@/components/recepcion/PacienteIdentificadoCard";
import PacienteRecepcionForm from "@/components/recepcion/PacienteRecepcionForm";
import SeleccionTurnoRecepcion, {
    type HorarioRecepcionSeleccionado,
} from "@/components/recepcion/SeleccionTurnoRecepcion";

import { useRegistrarIngresoRecepcion } from "@/hooks/useRecepcion";
import { useCreateTurno } from "@/hooks/useTurnos";

import type { Paciente } from "@/types/paciente";
import type {
    CrearIngresoRecepcionData,
    PacienteMinimoData,
    TurnoRecepcionConfirmado,
} from "@/types/recepcion";
import type { CrearTurnoData } from "@/types/turno";

// ============================================================
// TIPOS
// ============================================================

type ModoPaciente =
    | "busqueda"
    | "identificado"
    | "nuevo-formulario"
    | "nuevo-listo";

interface ResumenPacienteNuevoProps {
    datos: PacienteMinimoData;
    onEditar: () => void;
    deshabilitado: boolean;
}

interface ResumenRecepcionProps {
    pacienteExistente: Paciente | null;
    pacienteNuevo: PacienteMinimoData | null;
    seleccion: HorarioRecepcionSeleccionado;
    observaciones: string;
    onObservacionesChange: (valor: string) => void;
    registrando: boolean;
    errorDniDuplicado: boolean;
    onBuscarDni: () => void;
    onRegistrar: () => void;
}

interface FilaResumenProps {
    etiqueta: string;
    valor: string;
}

interface MensajeErrorRegistro {
    titulo: string;
    descripcion: string;
    dniDuplicado: boolean;
    horarioConflicto: boolean;
}

// ============================================================
// ERRORES
// ============================================================

function esRegistro(
    valor: unknown
): valor is Record<string, unknown> {
    return (
        typeof valor === "object" &&
        valor !== null &&
        !Array.isArray(valor)
    );
}

function obtenerMensajeBackend(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return "";
    }

    const data: unknown = error.response?.data;

    if (!esRegistro(data)) {
        return "";
    }

    const mensaje = data.message;

    return typeof mensaje === "string"
        ? mensaje.trim()
        : "";
}

function obtenerMensajeErrorRegistro(
    error: unknown
): MensajeErrorRegistro {
    if (!axios.isAxiosError(error)) {
        return {
            titulo: "No pudimos registrar el ingreso",
            descripcion:
                "Ocurrió un error inesperado. Intentá nuevamente.",
            dniDuplicado: false,
            horarioConflicto: false,
        };
    }

    if (!error.response) {
        return {
            titulo:
                "No pudimos comunicarnos con el servidor",
            descripcion:
                "Revisá la conexión e intentá nuevamente.",
            dniDuplicado: false,
            horarioConflicto: false,
        };
    }

    const status = error.response.status;
    const mensajeBackend = obtenerMensajeBackend(error);
    const mensajeNormalizado =
        mensajeBackend.toLowerCase();

    const esDniDuplicado =
        status === 400 &&
        (mensajeNormalizado.includes(
            "dni ya está registrado"
        ) ||
            mensajeNormalizado.includes(
                "ya existe un paciente"
            ));

    if (esDniDuplicado) {
        return {
            titulo: "El paciente ya está registrado",
            descripcion:
                "Ya existe un paciente con ese DNI. Volvé a buscarlo para registrar el turno desde su ficha.",
            dniDuplicado: true,
            horarioConflicto: false,
        };
    }

    if (status === 409) {
        return {
            titulo: "El horario ya no está disponible",
            descripcion:
                mensajeBackend ||
                "La disponibilidad cambió. Elegí otro horario.",
            dniDuplicado: false,
            horarioConflicto: true,
        };
    }

    switch (status) {
        case 400:
            return {
                titulo: "No pudimos registrar el ingreso",
                descripcion:
                    mensajeBackend ||
                    "Revisá los datos del paciente y de la selección.",
                dniDuplicado: false,
                horarioConflicto: false,
            };

        case 401:
            return {
                titulo: "Tu sesión expiró",
                descripcion:
                    "Iniciá sesión nuevamente para continuar.",
                dniDuplicado: false,
                horarioConflicto: false,
            };

        case 403:
            return {
                titulo:
                    "No tenés autorización para registrar ingresos",
                descripcion:
                    "Comunicate con la sala si el problema continúa.",
                dniDuplicado: false,
                horarioConflicto: false,
            };

        case 404:
            return {
                titulo:
                    "Los datos de la recepción ya no están disponibles",
                descripcion:
                    mensajeBackend ||
                    "Volvé a seleccionar el paciente y el turno.",
                dniDuplicado: false,
                horarioConflicto: false,
            };

        case 500:
            return {
                titulo: "No pudimos registrar el ingreso",
                descripcion:
                    "Ocurrió un error en el servidor. Intentá nuevamente en unos minutos.",
                dniDuplicado: false,
                horarioConflicto: false,
            };

        default:
            return {
                titulo: "No pudimos registrar el ingreso",
                descripcion:
                    mensajeBackend ||
                    "Intentá nuevamente en unos minutos.",
                dniDuplicado: false,
                horarioConflicto: false,
            };
    }
}

// ============================================================
// RESUMEN DEL PACIENTE NUEVO
// ============================================================

function ResumenPacienteNuevo({
    datos,
    onEditar,
    deshabilitado,
}: ResumenPacienteNuevoProps) {
    const telefono = `${datos.telefono.codigoArea} ${datos.telefono.numero}`.trim();

    return (
        <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-lg">
            <div className="flex flex-col gap-4 border-b border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                        <UserPlus size={21} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Paciente nuevo
                        </p>

                        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                            {datos.nombre}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                            Datos mínimos cargados
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onEditar}
                    disabled={deshabilitado}
                    className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Pencil size={16} />
                    Editar datos
                </Button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
                <InfoCard
                    icon={<IdCard size={16} />}
                    label="DNI"
                    value={datos.dni}
                />

                <InfoCard
                    icon={<Phone size={16} />}
                    label="Teléfono"
                    value={telefono || "No registrado"}
                />
            </div>
        </section>
    );
}

// ============================================================
// FILA DEL RESUMEN
// ============================================================

function FilaResumen({
    etiqueta,
    valor,
}: FilaResumenProps) {
    return (
        <div className="flex items-start justify-between gap-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {etiqueta}
            </dt>

            <dd className="text-right text-sm font-medium text-slate-800">
                {valor}
            </dd>
        </div>
    );
}

// ============================================================
// RESUMEN PREVIO AL REGISTRO
// ============================================================

function ResumenRecepcion({
    pacienteExistente,
    pacienteNuevo,
    seleccion,
    observaciones,
    onObservacionesChange,
    registrando,
    errorDniDuplicado,
    onBuscarDni,
    onRegistrar,
}: ResumenRecepcionProps) {
    const nombre =
        pacienteExistente?.nombre?.trim() ||
        pacienteNuevo?.nombre ||
        "No registrado";

    const dni =
        pacienteExistente?.dni?.trim() ||
        pacienteNuevo?.dni ||
        "No registrado";

    const telefono = pacienteNuevo
        ? `${pacienteNuevo.telefono.codigoArea} ${pacienteNuevo.telefono.numero}`.trim()
        : "";

    return (
        <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
            <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                        <ClipboardCheck size={21} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Resumen de recepción
                        </p>

                        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                            Selección completa
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                            Revisá los datos antes de registrar el turno.
                        </p>
                    </div>
                </div>
            </div>

            <dl className="divide-y divide-slate-100 px-5">
                <FilaResumen
                    etiqueta="Paciente"
                    valor={nombre}
                />

                <FilaResumen etiqueta="DNI" valor={dni} />

                {pacienteNuevo && (
                    <FilaResumen
                        etiqueta="Teléfono"
                        valor={telefono || "No registrado"}
                    />
                )}

                <FilaResumen
                    etiqueta="Especialidad"
                    valor={seleccion.especialidadNombre}
                />

                <FilaResumen
                    etiqueta="Médico"
                    valor={seleccion.medicoNombre}
                />

                <FilaResumen
                    etiqueta="Fecha"
                    valor={formatFechaLargaArgentina(
                        seleccion.fechaTurno
                    )}
                />

                <FilaResumen
                    etiqueta="Horario"
                    valor={seleccion.horaLocal}
                />
            </dl>

            <div className="space-y-4 border-t border-slate-100 bg-slate-50/70 p-5">
                {errorDniDuplicado && (
                    <div
                        role="alert"
                        className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                    >
                        <div className="flex items-start gap-2">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <div>
                                <p className="text-sm font-semibold text-amber-900">
                                    El DNI ya está registrado
                                </p>

                                <p className="mt-1 text-sm leading-5 text-amber-800">
                                    Buscá el DNI para identificar
                                    al paciente existente y
                                    registrar el turno desde su
                                    ficha.
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onBuscarDni}
                                    disabled={registrando}
                                    className="mt-3 h-9 rounded-lg border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Search size={14} />
                                    Buscar DNI
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="observaciones-recepcion"
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        <FileText size={14} />
                        Observaciones
                    </label>

                    <textarea
                        id="observaciones-recepcion"
                        value={observaciones}
                        onChange={(event) =>
                            onObservacionesChange(
                                event.target.value
                            )
                        }
                        disabled={registrando}
                        maxLength={500}
                        rows={3}
                        placeholder="Información adicional para el turno (opcional)"
                        className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    />

                    <p className="mt-1 text-right text-xs text-slate-400">
                        {observaciones.length}/500 caracteres
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={onRegistrar}
                    disabled={registrando}
                    className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {registrando ? (
                        <LoaderCircle
                            size={17}
                            className="animate-spin"
                        />
                    ) : (
                        <ClipboardCheck size={17} />
                    )}

                    {registrando
                        ? "Registrando ingreso..."
                        : "Registrar ingreso"}
                </Button>
            </div>
        </section>
    );
}

// ============================================================
// PÁGINA
// ============================================================

export default function RecepcionPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const crearTurnoMutation = useCreateTurno();
    const registrarIngresoMutation =
        useRegistrarIngresoRecepcion();

    const envioEnCursoRef = useRef(false);

    const [modoPaciente, setModoPaciente] =
        useState<ModoPaciente>("busqueda");

    const [dniBuscado, setDniBuscado] = useState("");

    const [pacienteSeleccionado, setPacienteSeleccionado] =
        useState<Paciente | null>(null);

    const [datosPacienteNuevo, setDatosPacienteNuevo] =
        useState<PacienteMinimoData | null>(null);

    const [horarioSeleccionado, setHorarioSeleccionado] =
        useState<HorarioRecepcionSeleccionado | null>(null);

    const [observaciones, setObservaciones] = useState("");

    const [errorDniDuplicado, setErrorDniDuplicado] =
        useState(false);

    const [horarioInvalidado, setHorarioInvalidado] =
        useState(false);

    const [resultadoRecepcion, setResultadoRecepcion] =
        useState<TurnoRecepcionConfirmado | null>(null);

    const registrando =
        crearTurnoMutation.isPending ||
        registrarIngresoMutation.isPending;

    const pacienteListo =
        (modoPaciente === "identificado" &&
            pacienteSeleccionado !== null) ||
        (modoPaciente === "nuevo-listo" &&
            datosPacienteNuevo !== null);

    const resumenCompleto =
        pacienteListo && horarioSeleccionado !== null;

    const handlePacienteEncontrado = (
        paciente: Paciente
    ) => {
        if (envioEnCursoRef.current) {
            return;
        }

        setPacienteSeleccionado(paciente);
        setDniBuscado(paciente.dni?.trim() ?? "");
        setDatosPacienteNuevo(null);
        setHorarioSeleccionado(null);
        setObservaciones("");
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setResultadoRecepcion(null);
        setModoPaciente("identificado");
    };

    const handlePacienteNoEncontrado = (dni: string) => {
        if (envioEnCursoRef.current) {
            return;
        }

        setPacienteSeleccionado(null);
        setDniBuscado(dni);
        setDatosPacienteNuevo(null);
        setHorarioSeleccionado(null);
        setObservaciones("");
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setResultadoRecepcion(null);
        setModoPaciente("nuevo-formulario");
    };

    const handleDatosPacienteNuevo = (
        datos: PacienteMinimoData
    ) => {
        if (envioEnCursoRef.current) {
            return;
        }

        setPacienteSeleccionado(null);
        setDatosPacienteNuevo(datos);
        setHorarioSeleccionado(null);
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setResultadoRecepcion(null);
        setModoPaciente("nuevo-listo");
    };

    const handleEditarPacienteNuevo = () => {
        if (envioEnCursoRef.current) {
            return;
        }

        setHorarioSeleccionado(null);
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setModoPaciente("nuevo-formulario");
    };

    const handleCancelarPacienteNuevo = () => {
        if (envioEnCursoRef.current) {
            return;
        }

        setHorarioSeleccionado(null);
        setHorarioInvalidado(false);

        if (datosPacienteNuevo) {
            setModoPaciente("nuevo-listo");
            return;
        }

        setDniBuscado("");
        setModoPaciente("busqueda");
    };

    const handleCambiarPaciente = () => {
        if (envioEnCursoRef.current) {
            return;
        }

        setPacienteSeleccionado(null);
        setDatosPacienteNuevo(null);
        setHorarioSeleccionado(null);
        setObservaciones("");
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setResultadoRecepcion(null);
        setModoPaciente("busqueda");

        crearTurnoMutation.reset();
        registrarIngresoMutation.reset();
    };

    const handleResolverAmbiguo = () => {
        navigate("/pacientes");
    };

    const handleHorarioSeleccionado = (
        seleccion: HorarioRecepcionSeleccionado
    ) => {
        setHorarioSeleccionado(seleccion);
        setHorarioInvalidado(false);
    };

    const handleCambiarSeleccion = () => {
        setHorarioSeleccionado(null);
        setHorarioInvalidado(false);
    };

    const handleRegistrarIngreso = async () => {
        if (
            !pacienteListo ||
            !horarioSeleccionado ||
            envioEnCursoRef.current ||
            registrando
        ) {
            return;
        }

        const observacionesLimpias =
            observaciones.trim();

        if (observacionesLimpias.length > 500) {
            toast.error(
                "Las observaciones son demasiado largas",
                {
                    description:
                        "El máximo permitido es de 500 caracteres.",
                }
            );

            return;
        }

        envioEnCursoRef.current = true;

        let registroExitoso = false;

        try {
            if (pacienteSeleccionado) {
                const datosTurno: CrearTurnoData = {
                    paciente: pacienteSeleccionado.id,
                    especialidad:
                        horarioSeleccionado.especialidad,
                    medico: horarioSeleccionado.medico,
                    // Se conserva exactamente el inicio
                    // devuelto por disponibilidad.
                    fechaTurno:
                        horarioSeleccionado.fechaTurno,
                    ...(observacionesLimpias
                        ? {
                              observaciones:
                                  observacionesLimpias,
                          }
                        : {}),
                };

                const respuesta =
                    await crearTurnoMutation.mutateAsync(
                        datosTurno
                    );

                setResultadoRecepcion(respuesta.data);
            } else if (datosPacienteNuevo) {
                const datosIngreso: CrearIngresoRecepcionData =
                    {
                        datosPaciente: {
                            nombre: datosPacienteNuevo.nombre
                                .trim()
                                .toUpperCase(),
                            dni: datosPacienteNuevo.dni.trim(),
                            telefono: {
                                codigoArea:
                                    datosPacienteNuevo.telefono.codigoArea.trim(),
                                numero:
                                    datosPacienteNuevo.telefono.numero.trim(),
                                ...(datosPacienteNuevo
                                    .telefono.tipo
                                    ? {
                                          tipo: datosPacienteNuevo
                                              .telefono.tipo,
                                      }
                                    : {}),
                            },
                        },
                        especialidad:
                            horarioSeleccionado.especialidad,
                        medico: horarioSeleccionado.medico,
                        // El backend calcula fechaFin.
                        fechaTurno:
                            horarioSeleccionado.fechaTurno,
                        ...(observacionesLimpias
                            ? {
                                  observaciones:
                                      observacionesLimpias,
                              }
                            : {}),
                    };

                const respuesta =
                    await registrarIngresoMutation.mutateAsync(
                        datosIngreso
                    );

                setResultadoRecepcion(respuesta.data);
            } else {
                return;
            }

            registroExitoso = true;

            toast.success(
                "Ingreso registrado correctamente"
            );
        } catch (error: unknown) {
            const mensaje =
                obtenerMensajeErrorRegistro(error);

            if (mensaje.horarioConflicto) {
                setHorarioSeleccionado(null);
                setHorarioInvalidado(true);

                void queryClient.invalidateQueries({
                    queryKey: [
                        "turnos",
                        "disponibilidad",
                    ],
                });

                toast.warning(mensaje.titulo, {
                    description: mensaje.descripcion,
                });

                return;
            }

            if (mensaje.dniDuplicado) {
                setErrorDniDuplicado(true);
            }

            toast.error(mensaje.titulo, {
                description: mensaje.descripcion,
            });
        } finally {
            if (!registroExitoso) {
                envioEnCursoRef.current = false;
            }
        }
    };

    const handleNuevaRecepcion = () => {
        setModoPaciente("busqueda");
        setDniBuscado("");
        setPacienteSeleccionado(null);
        setDatosPacienteNuevo(null);
        setHorarioSeleccionado(null);
        setObservaciones("");
        setErrorDniDuplicado(false);
        setHorarioInvalidado(false);
        setResultadoRecepcion(null);

        crearTurnoMutation.reset();
        registrarIngresoMutation.reset();

        envioEnCursoRef.current = false;
    };

    if (resultadoRecepcion) {
        return (
            <ConfirmacionRecepcion
                turno={resultadoRecepcion}
                onNuevaRecepcion={handleNuevaRecepcion}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <HeartPulse size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Recepción
                        </h1>

                        <p className="text-sm text-slate-500">
                            Identificación de pacientes y asignación
                            de turnos
                        </p>
                    </div>
                </div>

                {resumenCompleto && (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        <CircleCheck size={14} />
                        Selección completa
                    </span>
                )}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                {/* ============================================= */}
                {/* FLUJO PRINCIPAL */}
                {/* ============================================= */}

                <div className="space-y-4">
                    {modoPaciente === "busqueda" && (
                        <BusquedaPacienteCard
                            dniInicial={dniBuscado}
                            onPacienteEncontrado={
                                handlePacienteEncontrado
                            }
                            onPacienteNoEncontrado={
                                handlePacienteNoEncontrado
                            }
                            onResolverAmbiguo={
                                handleResolverAmbiguo
                            }
                        />
                    )}

                    {modoPaciente === "identificado" &&
                        pacienteSeleccionado && (
                            <PacienteIdentificadoCard
                                paciente={
                                    pacienteSeleccionado
                                }
                                onCambiarPaciente={
                                    handleCambiarPaciente
                                }
                                deshabilitado={registrando}
                            />
                        )}

                    {modoPaciente ===
                        "nuevo-formulario" && (
                        <PacienteRecepcionForm
                            dni={dniBuscado}
                            datosIniciales={
                                datosPacienteNuevo
                            }
                            textoCancelar={
                                datosPacienteNuevo
                                    ? "Volver al resumen"
                                    : undefined
                            }
                            onDatosListos={
                                handleDatosPacienteNuevo
                            }
                            onCancelar={
                                handleCancelarPacienteNuevo
                            }
                        />
                    )}

                    {modoPaciente === "nuevo-listo" &&
                        datosPacienteNuevo && (
                            <ResumenPacienteNuevo
                                datos={datosPacienteNuevo}
                                onEditar={
                                    handleEditarPacienteNuevo
                                }
                                deshabilitado={registrando}
                            />
                        )}

                    {pacienteListo && (
                        <SeleccionTurnoRecepcion
                            onHorarioSeleccionado={
                                handleHorarioSeleccionado
                            }
                            onCambiarSeleccion={
                                handleCambiarSeleccion
                            }
                            bloqueada={registrando}
                            horarioInvalidado={
                                horarioInvalidado
                            }
                        />
                    )}
                </div>

                {/* ============================================= */}
                {/* RESUMEN LATERAL */}
                {/* ============================================= */}

                <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
                    {resumenCompleto &&
                    horarioSeleccionado ? (
                        <ResumenRecepcion
                            pacienteExistente={
                                pacienteSeleccionado
                            }
                            pacienteNuevo={
                                datosPacienteNuevo
                            }
                            seleccion={horarioSeleccionado}
                            observaciones={observaciones}
                            onObservacionesChange={
                                setObservaciones
                            }
                            registrando={registrando}
                            errorDniDuplicado={
                                errorDniDuplicado
                            }
                            onBuscarDni={
                                handleCambiarPaciente
                            }
                            onRegistrar={
                                handleRegistrarIngreso
                            }
                        />
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <CalendarCheck size={21} />
                            </div>

                            <h2 className="mt-4 text-base font-semibold tracking-tight text-slate-800">
                                Resumen de recepción
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Identificá al paciente y seleccioná
                                especialidad, médico, fecha y
                                horario para completar la recepción.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
