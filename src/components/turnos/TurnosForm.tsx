
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarPlus, Save, X } from "lucide-react";

import {
    turnoSchema,
    type TurnoFormData,
} from "@/schemas/turno.schema";

import {
    useCreateTurno,
    useDisponibilidad,
} from "@/hooks/useTurnos";

import { getMedicos } from "@/api/medicos.api";
import { getPacientes } from "@/api/pacientes.api";
import { getEspecialidades } from "@/api/especialidades.api";

import type { Paciente } from "@/types/paciente";
import type { Medico } from "@/types/medico";
import type { Especialidad } from "@/types/especialidad";
import type { HorarioDisponible } from "@/types/turno";

import { TurnoFormSections } from "@/components/turnos/TurnoFormSections";

interface TurnosFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const defaultValues: TurnoFormData = {
    paciente: "",
    especialidad: "",
    medico: "",
    fechaTurno: "",
    observaciones: "",
};

export default function TurnosForm({
    onSuccess,
    onCancel,
}: TurnosFormProps) {
    const createMutation = useCreateTurno();

    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);

    // La fecha del calendario se mantiene separada de fechaTurno.
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [horarioSeleccionado, setHorarioSeleccionado] = useState("");

    const [cargandoDatos, setCargandoDatos] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TurnoFormData>({
        resolver: zodResolver(turnoSchema),
        defaultValues,
    });

    // ============================================
    // OBSERVAR CAMPOS DEL FORMULARIO
    // ============================================

    const especialidadId = useWatch({
        control,
        name: "especialidad",
    });

    const medicoId = useWatch({
        control,
        name: "medico",
    });

    // ============================================
    // CARGAR DATOS INICIALES
    // ============================================

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargandoDatos(true);

                const [
                    pacientesResponse,
                    especialidadesResponse,
                    medicosResponse,
                ] = await Promise.all([
                    getPacientes(),
                    getEspecialidades(),
                    getMedicos(),
                ]);

                setPacientes(pacientesResponse.data);
                setEspecialidades(especialidadesResponse.data);
                setMedicos(medicosResponse.data);
            } catch (error) {
                console.error("Error al cargar datos del formulario:", error);

                toast.error("No se pudieron cargar los datos", {
                    description: "Verificá la conexión con el servidor.",
                });
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarDatos();
    }, []);

    // ============================================
    // FILTRAR MÉDICOS POR ESPECIALIDAD
    // ============================================

    const medicosFiltrados = useMemo(() => {
        if (!especialidadId) {
            return [];
        }

        return medicos.filter(
            (medico) =>
                medico.activo &&
                medico.especialidad?.id === especialidadId
        );
    }, [medicos, especialidadId]);

    // ============================================
    // MANEJAR CAMBIOS DE SELECCIÓN
    // ============================================

    const limpiarFechaYHorario = () => {
        setFechaSeleccionada("");
        setHorarioSeleccionado("");

        setValue("fechaTurno", "", {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleCambiarEspecialidad = () => {
        setValue("medico", "", {
            shouldValidate: true,
            shouldDirty: true,
        });

        limpiarFechaYHorario();
    };

    const handleCambiarMedico = () => {
        limpiarFechaYHorario();
    };

    const handleCambiarFecha = (fecha: string) => {
        setFechaSeleccionada(fecha);
        setHorarioSeleccionado("");

        // Al cambiar el día, el horario anterior deja de ser válido.
        setValue("fechaTurno", "", {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // ============================================
    // CONSULTAR DISPONIBILIDAD
    // ============================================

    const disponibilidadQuery = useDisponibilidad(
        medicoId,
        fechaSeleccionada
    );

    const horariosDisponibles: HorarioDisponible[] =
        disponibilidadQuery.data?.data.horarios ?? [];

    // ============================================
    // SELECCIONAR HORARIO
    // ============================================

    const handleSeleccionarHorario = (
        horario: HorarioDisponible
    ) => {
        if (!fechaSeleccionada) {
            return;
        }

        const fechaHora = `${fechaSeleccionada}T${horario.horaLocal}`;

        setHorarioSeleccionado(horario.inicio);

        setValue("fechaTurno", fechaHora, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // ============================================
    // MANEJAR ENVÍO DEL FORMULARIO
    // ============================================

    const onSubmit: SubmitHandler<TurnoFormData> = async (data) => {
        try {
            await createMutation.mutateAsync({
                paciente: data.paciente,
                especialidad: data.especialidad,
                medico: data.medico,
                fechaTurno: data.fechaTurno,
                observaciones: data.observaciones?.trim() || undefined,
            });

            toast.success("Turno registrado correctamente", {
                description: "El turno fue reservado exitosamente.",
            });

            reset(defaultValues);
            setFechaSeleccionada("");
            setHorarioSeleccionado("");

            onSuccess?.();
        } catch (error: unknown) {
            console.error("Error al registrar turno:", error);

            let errorMessage =
                "Ocurrió un error al comunicarse con el servidor.";

            // Primero priorizamos los mensajes enviados por la API.
            if (typeof error === "object" && error !== null && "response" in error) {
                const apiError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: string;
                            data?: string[] | string;
                        };
                    };
                };

                const responseData = apiError.response?.data;

                if (responseData?.data) {
                    errorMessage = Array.isArray(responseData.data)
                        ? responseData.data.join(", ")
                        : responseData.data;
                } else {
                    errorMessage =
                        responseData?.message ||
                        responseData?.error ||
                        errorMessage;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("No se pudo registrar el turno", {
                description: errorMessage,
            });
        }
    };

    const isSaving = createMutation.isPending;

    // ============================================
    // RENDER
    // ============================================

    if (cargandoDatos) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-sm text-slate-500">
                    Cargando información...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <TurnoFormSections
                register={register}
                errors={errors}
                pacientes={pacientes}
                especialidades={especialidades}
                medicos={medicosFiltrados}
                fechaSeleccionada={fechaSeleccionada}
                onCambiarEspecialidad={handleCambiarEspecialidad}
                onCambiarMedico={handleCambiarMedico}
                onCambiarFecha={handleCambiarFecha}
                horariosDisponibles={horariosDisponibles}
                cargandoDisponibilidad={disponibilidadQuery.isFetching}
                errorDisponibilidad={disponibilidadQuery.isError}
                horarioSeleccionado={horarioSeleccionado}
                onSeleccionarHorario={handleSeleccionarHorario}
            />

            {/* BOTONES DE ACCIÓN */}

            <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-200 pt-6 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSaving || !horarioSeleccionado}
                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Save size={18} />
                            Registrando...
                        </>
                    ) : (
                        <>
                            <CalendarPlus size={18} />
                            Registrar turno
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
