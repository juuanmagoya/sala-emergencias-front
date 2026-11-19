import { useState } from "react";

import axios from "axios";

import {
    AlertCircle,
    ArrowRight,
    CircleCheck,
    IdCard,
    LoaderCircle,
    RotateCcw,
    Search,
    UserPlus,
    UserX,
    Users,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
    FormInput,
    FormSection,
} from "@/components/pacientes/PacienteFormSections";

import { useBuscarPacientePorDni } from "@/hooks/usePacientes";

import {
    busquedaDniSchema,
    type BusquedaDniFormData,
} from "@/schemas/recepcion.schema";

import type { Paciente } from "@/types/paciente";

// ============================================================
// TIPOS
// ============================================================

export interface BusquedaPacienteCardProps {
    dniInicial?: string;
    onPacienteEncontrado: (paciente: Paciente) => void;
    onPacienteNoEncontrado: (dni: string) => void;
    onResolverAmbiguo?: (pacientes: Paciente[]) => void;
}

// ============================================================
// ERRORES
// ============================================================

function obtenerMensajeErrorBusqueda(
    error: unknown
): string {
    if (!axios.isAxiosError(error)) {
        return "Ocurrió un error inesperado. Intentá nuevamente.";
    }

    if (!error.response) {
        return "No pudimos comunicarnos con el servidor. Revisá la conexión e intentá nuevamente.";
    }

    switch (error.response.status) {
        case 401:
            return "Tu sesión expiró. Iniciá sesión nuevamente.";

        case 403:
            return "No tenés autorización para buscar pacientes.";

        case 500:
            return "Ocurrió un error en el servidor. Intentá nuevamente en unos minutos.";

        default:
            return "No pudimos completar la búsqueda. Intentá nuevamente.";
    }
}

// ============================================================
// COMPONENTE
// ============================================================

export default function BusquedaPacienteCard({
    dniInicial = "",
    onPacienteEncontrado,
    onPacienteNoEncontrado,
    onResolverAmbiguo,
}: BusquedaPacienteCardProps) {
    const [dniBuscado, setDniBuscado] = useState("");

    const {
        register,
        handleSubmit,
        control,
        setValue,
        setFocus,
        formState: { errors },
    } = useForm<BusquedaDniFormData>({
        resolver: zodResolver(busquedaDniSchema),
        defaultValues: {
            dni: dniInicial,
        },
    });

    const dniInput =
        useWatch({ control, name: "dni" }) ?? "";

    const busqueda = useBuscarPacientePorDni(dniBuscado);

    const pacientes = busqueda.data?.data ?? [];

    const dniCoincide =
        dniBuscado !== "" &&
        dniInput.trim() === dniBuscado;

    const busquedaEnCurso = busqueda.isFetching;

    const handleBuscar = (
        data: BusquedaDniFormData
    ) => {
        const dni = data.dni.trim();

        if (!dni || busqueda.isFetching) {
            return;
        }

        if (dni === dniBuscado) {
            void busqueda.refetch();

            return;
        }

        setDniBuscado(dni);
    };

    const handleReintentar = () => {
        if (busqueda.isFetching) {
            return;
        }

        void busqueda.refetch();
    };

    const handleVolverABuscar = () => {
        setDniBuscado("");
        setValue("dni", "");
        setFocus("dni");
    };

    const handleSeleccionarPaciente = (
        paciente: Paciente
    ) => {
        onPacienteEncontrado(paciente);
    };

    const handleRegistrarPaciente = () => {
        if (!dniBuscado) {
            return;
        }

        onPacienteNoEncontrado(dniBuscado);
    };

    const handleResolverAmbiguo = () => {
        onResolverAmbiguo?.(pacientes);
    };

    return (
        <FormSection
            icon={Search}
            title="Identificación del paciente"
            description="Ingresá el DNI para buscar al paciente o registrar uno nuevo."
            color="blue"
        >
            <form
                onSubmit={handleSubmit(handleBuscar)}
                noValidate
                className="space-y-4"
            >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <FormInput
                        id="dni-recepcion"
                        label="DNI"
                        required
                        error={errors.dni}
                        color="blue"
                        register={register("dni")}
                        placeholder="Ej. 30111222"
                        inputMode="numeric"
                        maxLength={8}
                        autoComplete="off"
                    />

                    <Button
                        type="submit"
                        disabled={busquedaEnCurso}
                        className="h-12 w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                    >
                        {busquedaEnCurso ? (
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <Search size={18} />
                        )}

                        {busquedaEnCurso
                            ? "Buscando..."
                            : "Buscar paciente"}
                    </Button>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                    La búsqueda se realiza por DNI exacto de 7 u 8
                    dígitos.
                </p>
            </form>

            {/* ================================================= */}
            {/* ESTADO INICIAL */}
            {/* ================================================= */}

            {!dniCoincide && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-500">
                    <IdCard
                        size={17}
                        className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <p>
                        {dniBuscado || dniInput.trim()
                            ? "Presioná “Buscar paciente” para consultar el DNI ingresado."
                            : "Ingresá un DNI y presioná “Buscar paciente” para comenzar."}
                    </p>
                </div>
            )}

            {/* ================================================= */}
            {/* BUSCANDO */}
            {/* ================================================= */}

            {dniCoincide && busqueda.isFetching && (
                <div
                    role="status"
                    className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500"
                >
                    <LoaderCircle
                        size={18}
                        className="shrink-0 animate-spin text-blue-600"
                    />

                    <span>Buscando paciente por DNI...</span>
                </div>
            )}

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {dniCoincide &&
                !busqueda.isFetching &&
                busqueda.isError && (
                    <div
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0 text-red-500"
                            />

                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    No pudimos completar la búsqueda
                                </p>

                                <p className="mt-1 text-sm leading-5 text-red-700">
                                    {obtenerMensajeErrorBusqueda(
                                        busqueda.error
                                    )}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-red-600">
                                    No pudimos confirmar si el
                                    paciente existe. No continúes
                                    como si fuera un paciente nuevo.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleVolverABuscar}
                                className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cambiar DNI
                            </Button>

                            <Button
                                type="button"
                                onClick={handleReintentar}
                                disabled={busqueda.isFetching}
                                className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RotateCcw
                                    size={15}
                                    className={
                                        busqueda.isFetching
                                            ? "animate-spin"
                                            : undefined
                                    }
                                />

                                {busqueda.isFetching
                                    ? "Reintentando..."
                                    : "Reintentar"}
                            </Button>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* PACIENTE ENCONTRADO */}
            {/* ================================================= */}

            {dniCoincide &&
                !busqueda.isFetching &&
                busqueda.isSuccess &&
                pacientes.length === 1 && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                    <CircleCheck size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                        Paciente encontrado
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {pacientes[0].nombre?.trim() ||
                                            "Sin nombre registrado"}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        DNI{" "}
                                        {pacientes[0].dni?.trim() ||
                                            dniBuscado}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={() =>
                                    handleSeleccionarPaciente(
                                        pacientes[0]
                                    )
                                }
                                className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Continuar
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* PACIENTE NO ENCONTRADO */}
            {/* ================================================= */}

            {dniCoincide &&
                !busqueda.isFetching &&
                busqueda.isSuccess &&
                pacientes.length === 0 && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                                <UserX size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-amber-900">
                                    No encontramos un paciente con
                                    ese DNI
                                </p>

                                <p className="mt-1 text-sm leading-5 text-amber-800">
                                    El DNI {dniBuscado} no está
                                    registrado. Podés cargar los
                                    datos mínimos para continuar.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleVolverABuscar}
                                className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Volver a buscar
                            </Button>

                            <Button
                                type="button"
                                onClick={handleRegistrarPaciente}
                                className="h-10 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700"
                            >
                                <UserPlus size={16} />
                                Registrar paciente nuevo
                            </Button>
                        </div>
                    </div>
                )}

            {/* ================================================= */}
            {/* RESULTADO AMBIGUO */}
            {/* ================================================= */}

            {dniCoincide &&
                !busqueda.isFetching &&
                busqueda.isSuccess &&
                pacientes.length > 1 && (
                    <div
                        role="alert"
                        className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
                                <Users size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-amber-900">
                                    Encontramos más de un paciente
                                    con ese DNI
                                </p>

                                <p className="mt-1 text-sm leading-5 text-amber-800">
                                    No se puede continuar
                                    automáticamente. Revisá las
                                    fichas antes de asignar un
                                    turno.
                                </p>
                            </div>
                        </div>

                        <ul className="mt-3 space-y-2">
                            {pacientes.map((paciente) => (
                                <li
                                    key={paciente.id}
                                    className="rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-sm text-slate-700"
                                >
                                    <span className="font-medium">
                                        {paciente.nombre?.trim() ||
                                            "Sin nombre registrado"}
                                    </span>

                                    <span className="ml-2 text-slate-500">
                                        DNI{" "}
                                        {paciente.dni?.trim() ||
                                            "No registrado"}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleVolverABuscar}
                                className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Volver a buscar
                            </Button>

                            {onResolverAmbiguo && (
                                <Button
                                    type="button"
                                    onClick={handleResolverAmbiguo}
                                    className="h-10 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700"
                                >
                                    Revisar en Pacientes
                                </Button>
                            )}
                        </div>
                    </div>
                )}
        </FormSection>
    );
}
