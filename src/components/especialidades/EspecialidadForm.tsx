import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

import {
    especialidadSchema,
    type EspecialidadFormData,
} from "@/schemas/especialidad.schema";

import {
    useCreateEspecialidad,
    useUpdateEspecialidad,
} from "@/hooks/useEspecialidades";

import type { Especialidad } from "@/types/especialidad";

import {
    InformacionEspecialidadSection,
    DescripcionEspecialidadSection,
} from "@/components/especialidades/EspecialidadFormSections";

interface EspecialidadFormProps {
    especialidad?: Especialidad;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const defaultValues: EspecialidadFormData = {
    nombre: "",
    descripcion: "",
    codigo: "",
};

export default function EspecialidadForm({
    especialidad,
    onSuccess,
    onCancel,
}: EspecialidadFormProps) {
    const createMutation = useCreateEspecialidad();
    const updateMutation = useUpdateEspecialidad();

    const isEditing = Boolean(especialidad);

    const isSaving =
        createMutation.isPending ||
        updateMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EspecialidadFormData>({
        resolver: zodResolver(especialidadSchema),
        defaultValues,
    });

    // ============================================
    // CARGAR DATOS EN EDICIÓN
    // ============================================

    useEffect(() => {
        if (!especialidad) {
            reset(defaultValues);
            return;
        }

        reset({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion ?? "",
            codigo: especialidad.codigo ?? "",
        });
    }, [especialidad, reset]);

    // ============================================
    // SUBMIT
    // ============================================

    const onSubmit = async (
        data: EspecialidadFormData
    ) => {
        try {
            const dataToSend = {
                nombre: data.nombre
                    .toUpperCase()
                    .trim(),

                descripcion:
                    data.descripcion?.trim() || "",

                codigo:
                    data.codigo
                        ?.toUpperCase()
                        .trim() || "",
            };

            console.log(
                "📤 Datos normalizados para enviar:",
                dataToSend
            );

            if (isEditing && especialidad) {
                await updateMutation.mutateAsync({
                    id: especialidad.id,
                    especialidad: dataToSend,
                });

                toast.success(
                    "Especialidad actualizada correctamente",
                    {
                        description: `${data.nombre} fue actualizada correctamente.`,
                    }
                );
            } else {
                await createMutation.mutateAsync(
                    dataToSend
                );

                toast.success(
                    "Especialidad creada correctamente",
                    {
                        description: `${data.nombre} fue registrada en el sistema.`,
                    }
                );
            }

            onSuccess?.();
        } catch (error: unknown) {
            console.error(
                "Error al guardar especialidad:",
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
                    ? "No se pudo actualizar la especialidad"
                    : "No se pudo crear la especialidad",
                {
                    description: errorMessage,
                }
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            <InformacionEspecialidadSection
                register={register}
                errors={errors}
            />

            <DescripcionEspecialidadSection
                register={register}
                errors={errors}
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
                            : "Crear especialidad"}
                </button>
            </div>
        </form>
    );
}