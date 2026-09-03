import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

import {
    medicoSchema,
    type MedicoFormData,
} from "@/schemas/medico.schema";

import {
    useCreateMedico,
    useUpdateMedico,
} from "@/hooks/useMedicos";

import { useEspecialidades } from "@/hooks/useEspecialidades";

import type { Medico } from "@/types/medico";

import {
    InformacionMedicoSection,
    EspecialidadMedicoSection,
    TelefonoMedicoSection,
    HorarioMedicoSection,
} from "@/components/medicos/MedicoFormSections";

// ============================================
// PROPS
// ============================================

interface MedicoFormProps {
    medico?: Medico;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const defaultValues: MedicoFormData = {
    nombre: "",
    apellido: "",
    matricula: "",
    especialidad: "",
    email: "",

    telefono: {
        tipo: "CELULAR",
        codigoArea: "",
        numero: "",
    },

    horariosAtencion: [
        {
            dia: "LUNES",
            horaInicio: "",
            horaFin: "",
        },
    ],

    duracionTurno: 30,
};

// ============================================
// COMPONENTE
// ============================================

export default function MedicoForm({
    medico,
    onSuccess,
    onCancel,
}: MedicoFormProps) {
    const createMutation = useCreateMedico();
    const updateMutation = useUpdateMedico();

    // ============================================
    // ESPECIALIDADES
    // ============================================

    const { data: especialidadesData } =
        useEspecialidades({
            estado: "activos",
        });

    const especialidades =
        especialidadesData?.data ?? [];

    // ============================================
    // ESTADO
    // ============================================

    const isEditing = Boolean(medico);

    const isSaving =
        createMutation.isPending ||
        updateMutation.isPending;

    // ============================================
    // FORMULARIO
    // ============================================

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<MedicoFormData>({
        resolver: zodResolver(medicoSchema),
        defaultValues,
    });

    // ============================================
    // HORARIOS DINÁMICOS
    // ============================================

    const {
        fields: horariosFields,
        append: appendHorario,
        remove: removeHorario,
    } = useFieldArray({
        control,
        name: "horariosAtencion",
    });

    // ============================================
    // CARGAR DATOS EN EDICIÓN
    // ============================================

    useEffect(() => {
        if (!medico) {
            reset(defaultValues);
            return;
        }

        reset({
            nombre: medico.nombre ?? "",

            apellido: medico.apellido ?? "",

            matricula: medico.matricula ?? "",

            especialidad:
                typeof medico.especialidad === "string"
                    ? medico.especialidad
                    : medico.especialidad?.id ?? "",

            email: medico.email ?? "",

            telefono: {
                tipo:
                    medico.telefono?.tipo ??
                    "CELULAR",

                codigoArea:
                    medico.telefono?.codigoArea ??
                    "",

                numero:
                    medico.telefono?.numero ??
                    "",
            },

            horariosAtencion:
                medico.horariosAtencion?.length
                    ? medico.horariosAtencion.map(
                          (horario) => ({
                              dia:
                                  horario.dia ??
                                  "LUNES",

                              horaInicio:
                                  horario.horaInicio ??
                                  "",

                              horaFin:
                                  horario.horaFin ??
                                  "",
                          })
                      )
                    : [
                          {
                              dia: "LUNES",
                              horaInicio: "",
                              horaFin: "",
                          },
                      ],

            duracionTurno:
                medico.duracionTurno ?? 30,
        });
    }, [medico, reset]);

    // ============================================
    // AGREGAR HORARIO
    // ============================================

    const handleAgregarHorario = () => {
        appendHorario({
            dia: "LUNES",
            horaInicio: "",
            horaFin: "",
        });
    };

    // ============================================
    // SUBMIT
    // ============================================

    const onSubmit = async (
        data: MedicoFormData
    ) => {
        try {
            const dataToSend = {
                nombre: data.nombre
                    .toUpperCase()
                    .trim(),

                apellido: data.apellido
                    .toUpperCase()
                    .trim(),

                matricula:
                    data.matricula.trim(),

                especialidad:
                    data.especialidad,

                email: data.email
                    .trim()
                    .toLowerCase(),

                telefono: {
                    tipo:
                        data.telefono.tipo,

                    codigoArea:
                        data.telefono.codigoArea.trim(),

                    numero:
                        data.telefono.numero.trim(),
                },

                horariosAtencion:
                    data.horariosAtencion.map(
                        (horario) => ({
                            dia: horario.dia,
                            horaInicio:
                                horario.horaInicio,
                            horaFin:
                                horario.horaFin,
                        })
                    ),

                duracionTurno:
                    data.duracionTurno,
            };

            console.log(
                "📤 Datos normalizados para enviar:",
                dataToSend
            );

            // ========================================
            // EDITAR
            // ========================================

            if (isEditing && medico) {
                await updateMutation.mutateAsync({
                    id: medico.id,
                    medico: dataToSend,
                });

                toast.success(
                    "Médico actualizado correctamente",
                    {
                        description:
                            `${data.nombre} ${data.apellido} fue actualizado correctamente.`,
                    }
                );
            }

            // ========================================
            // CREAR
            // ========================================

            else {
                await createMutation.mutateAsync(
                    dataToSend
                );

                toast.success(
                    "Médico creado correctamente",
                    {
                        description:
                            `${data.nombre} ${data.apellido} fue registrado en el sistema.`,
                    }
                );
            }

            onSuccess?.();

        } catch (error: unknown) {
            console.error(
                "Error al guardar médico:",
                error
            );

            let errorMessage =
                "Ocurrió un error al comunicarse con el servidor.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (
                typeof error === "object" &&
                error !== null
            ) {
                const apiError =
                    error as {
                        response?: {
                            data?: {
                                message?: string;
                                error?: string;
                                data?:
                                    | string[]
                                    | string;
                            };
                        };
                    };

                const backendData =
                    apiError.response?.data;

                if (backendData?.data) {
                    errorMessage =
                        Array.isArray(
                            backendData.data
                        )
                            ? backendData.data.join(
                                  ", "
                              )
                            : backendData.data;
                } else {
                    errorMessage =
                        backendData?.message ||
                        backendData?.error ||
                        errorMessage;
                }
            }

            toast.error(
                isEditing
                    ? "No se pudo actualizar el médico"
                    : "No se pudo crear el médico",
                {
                    description:
                        errorMessage,
                }
            );
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            {/* Información personal */}

            <InformacionMedicoSection
                register={register}
                errors={errors}
            />

            {/* Especialidad */}

            <EspecialidadMedicoSection
                register={register}
                errors={errors}
                especialidades={especialidades}
            />

            {/* Teléfono */}

            <TelefonoMedicoSection
                register={register}
                errors={errors}
            />

            {/* Horarios + duración */}

            <HorarioMedicoSection
                register={register}
                errors={errors}
                fields={horariosFields}
                onAdd={handleAgregarHorario}
                onRemove={removeHorario}
            />

            {/* Acciones */}

            <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-200 pt-6 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save size={18} />

                    {isSaving
                        ? "Guardando..."
                        : isEditing
                          ? "Guardar cambios"
                          : "Crear médico"}
                </button>
            </div>
        </form>
    );
}