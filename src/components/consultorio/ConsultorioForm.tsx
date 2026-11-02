import { useEffect } from "react";
import {
    useForm,
    useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Save,
    X,
} from "lucide-react";

import {
    consultorioSchema,
    type ConsultorioFormData,
} from "@/schemas/consultorio.schema";

import {
    useCreateConsultorio,
    useUpdateConsultorio,
} from "@/hooks/useConsultorios";

import { useEspecialidades } from "@/hooks/useEspecialidades";

import type { Consultorio } from "@/types/consultorio";

import {
    InformacionConsultorioSection,
    EspecialidadesConsultorioSection,
    EquipamientoConsultorioSection,
} from "@/components/consultorio/ConsultorioFormSections";

// ============================================
// PROPS
// ============================================

interface ConsultorioFormProps {
    consultorio?: Consultorio | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// ============================================
// VALORES POR DEFECTO
// ============================================

const defaultValues: ConsultorioFormData = {
    nombre: "",
    numero: "",
    piso: "",
    ala: "CENTRAL",
    especialidades: [],
    equipamiento: [],
    capacidad: 1,
};

// ============================================
// COMPONENTE
// ============================================

export default function ConsultorioForm({
    consultorio,
    onSuccess,
    onCancel,
}: ConsultorioFormProps) {
    const createMutation = useCreateConsultorio();
    const updateMutation = useUpdateConsultorio();

    const {
        data: especialidadesData,
        isLoading: isLoadingEspecialidades,
    } = useEspecialidades();

    const isEditing = Boolean(consultorio);

    const isSaving =
        createMutation.isPending ||
        updateMutation.isPending;

    const especialidades =
        especialidadesData?.data ?? [];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<ConsultorioFormData>({
        resolver: zodResolver(consultorioSchema),
        defaultValues,
    });

    const equipamientoSeleccionado =
        useWatch({
            control,
            name: "equipamiento",
        });

    const especialidadesSeleccionadas =
        useWatch({
            control,
            name: "especialidades",
        });

    // ============================================
    // CARGAR DATOS EN EDICIÓN
    // ============================================

    useEffect(() => {
        if (!consultorio) {
            reset(defaultValues);
            return;
        }

        reset({
            nombre: consultorio.nombre,
            numero: consultorio.numero,
            piso: consultorio.piso,
            ala: consultorio.ala,
            especialidades:
                consultorio.especialidades.map(
                    (especialidad) =>
                        especialidad.id
                ),
            equipamiento:
                consultorio.equipamiento,
            capacidad: consultorio.capacidad,
        });
    }, [consultorio, reset]);

    // ============================================
    // TOGGLE ESPECIALIDAD
    // ============================================

    const toggleEspecialidad = (id: string) => {
        const actual =
            especialidadesSeleccionadas ?? [];

        if (actual.includes(id)) {
            setValue(
                "especialidades",
                actual.filter(
                    (especialidadId) =>
                        especialidadId !== id
                ),
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

            return;
        }

        setValue(
            "especialidades",
            [...actual, id],
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    // ============================================
    // TOGGLE EQUIPAMIENTO
    // ============================================

    const toggleEquipamiento = (
        value: ConsultorioFormData["equipamiento"][number]
    ) => {
        const actual =
            equipamientoSeleccionado ?? [];

        if (actual.includes(value)) {
            setValue(
                "equipamiento",
                actual.filter(
                    (item) => item !== value
                ),
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

            return;
        }

        setValue(
            "equipamiento",
            [...actual, value],
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    // ============================================
    // SUBMIT
    // ============================================

    const onSubmit = async (
        data: ConsultorioFormData
    ) => {
        try {
            const dataToSend = {
                nombre: data.nombre
                    .toUpperCase()
                    .trim(),

                numero: data.numero.trim(),

                piso: data.piso.trim(),

                ala: data.ala,

                especialidades:
                    data.especialidades ?? [],

                equipamiento:
                    data.equipamiento ?? [],

                capacidad: data.capacidad,
            };

            if (isEditing && consultorio) {
                await updateMutation.mutateAsync({
                    id: consultorio.id,
                    consultorio: dataToSend,
                });

                toast.success(
                    "Consultorio actualizado correctamente",
                    {
                        description: `${data.nombre} fue actualizado correctamente.`,
                    }
                );
            } else {
                await createMutation.mutateAsync(
                    dataToSend
                );

                toast.success(
                    "Consultorio creado correctamente",
                    {
                        description: `${data.nombre} fue registrado en el sistema.`,
                    }
                );
            }

            onSuccess?.();
        } catch (error: unknown) {
            console.error(
                "Error al guardar consultorio:",
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
                const apiError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: string;
                        };
                    };
                };

                errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.error ||
                    errorMessage;
            }

            toast.error(
                isEditing
                    ? "No se pudo actualizar el consultorio"
                    : "No se pudo crear el consultorio",
                {
                    description: errorMessage,
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
            className="space-y-10"
        >
            {/* Información */}
            <InformacionConsultorioSection
                register={register}
                errors={errors}
            />

            {/* Especialidades */}
            <EspecialidadesConsultorioSection
                register={register}
                errors={errors}
                especialidades={especialidades}
                especialidadesSeleccionadas={
                    especialidadesSeleccionadas ?? []
                }
                toggleEspecialidad={
                    toggleEspecialidad
                }
            />

            {/* Equipamiento */}
            <EquipamientoConsultorioSection
                register={register}
                errors={errors}
                equipamientoSeleccionado={
                    equipamientoSeleccionado ?? []
                }
                toggleEquipamiento={
                    toggleEquipamiento
                }
            />

            {/* ========================================
                ACCIONES
            ======================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={
                        isSaving ||
                        isLoadingEspecialidades
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />

                    {isSaving
                        ? "Guardando..."
                        : isEditing
                            ? "Guardar cambios"
                            : "Crear consultorio"}
                </button>
            </div>
        </form>
    );
}
