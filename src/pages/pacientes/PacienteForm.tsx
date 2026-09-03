import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

import {
    pacienteSchema,
    type PacienteFormData,
} from "@/schemas/paciente.schema";

import {
    useCreatePaciente,
    useUpdatePaciente,
} from "@/hooks/usePacientes";

import type { Paciente } from "@/types/paciente";

import {
    InformacionPersonalSection,
    DireccionSection,
    ContactoSection,
    ObraSocialSection,
} from "@/components/pacientes/PacienteFormSections";

interface PacienteFormProps {
    paciente?: Paciente;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// ============================================
// VALORES POR DEFECTO
// ============================================

const defaultValues: PacienteFormData = {
    nombre: "",
    dni: "",
    email: "",
    direccion: {
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        barrio: "",
    },
    telefono: {
        tipo: "CELULAR",
        codigoArea: "",
        numero: "",
    },
    obraSocial: {
        nombre: "NINGUNA",
        numeroAfiliado: "",
    },
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PacienteForm({
    paciente,
    onSuccess,
    onCancel,
}: PacienteFormProps) {
    const createMutation = useCreatePaciente();
    const updateMutation = useUpdatePaciente();

    const isEditing = Boolean(paciente);
    const isSaving = createMutation.isPending || updateMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PacienteFormData>({
        resolver: zodResolver(pacienteSchema),
        defaultValues,
    });

    // ============================================
    // CARGAR DATOS DEL PACIENTE AL EDITAR
    // ============================================

    useEffect(() => {
        if (!paciente) {
            reset(defaultValues);
            return;
        }

        reset({
            nombre: paciente.nombre,
            dni: paciente.dni,
            email: paciente.email,
            direccion: {
                calle: paciente.direccion.calle,
                numero: paciente.direccion.numero,
                piso: paciente.direccion.piso ?? "",
                departamento: paciente.direccion.departamento ?? "",
                barrio: paciente.direccion.barrio ?? "",
            },
            telefono: {
                tipo: paciente.telefono.tipo ?? "CELULAR",
                codigoArea: paciente.telefono.codigoArea,
                numero: paciente.telefono.numero,
            },
            obraSocial: {
                nombre: paciente.obraSocial.nombre,
                numeroAfiliado: paciente.obraSocial.numeroAfiliado ?? "",
            },
        });
    }, [paciente, reset]);

    // ============================================
    // MANEJAR ENVÍO DEL FORMULARIO
    // ============================================

    const onSubmit: SubmitHandler<PacienteFormData> = async (data) => {
        try {
            // Normalizar datos antes de enviar al backend
            const dataToSend = {
                nombre: data.nombre.toUpperCase().trim(),
                dni: data.dni.trim(),
                email: data.email.toLowerCase().trim(),
                direccion: {
                    calle: data.direccion.calle.trim(),
                    numero: data.direccion.numero.trim(),
                    piso: data.direccion.piso.trim(),
                    departamento: data.direccion.departamento.trim(),
                    barrio: data.direccion.barrio.trim(),
                },
                telefono: {
                    tipo: data.telefono.tipo,
                    codigoArea: data.telefono.codigoArea.trim(),
                    numero: data.telefono.numero.trim(),
                },
                obraSocial: {
                    nombre: data.obraSocial.nombre,
                    numeroAfiliado: data.obraSocial.numeroAfiliado.trim(),
                },
            };

            console.log("📤 Datos normalizados para enviar:", dataToSend);

            if (isEditing && paciente) {
                await updateMutation.mutateAsync({
                    id: paciente.id,
                    paciente: dataToSend,
                });

                toast.success("Paciente actualizado correctamente", {
                    description: `${data.nombre} fue actualizado correctamente.`,
                });
            } else {
                await createMutation.mutateAsync(dataToSend);

                toast.success("Paciente creado correctamente", {
                    description: `${data.nombre} fue registrado en el sistema.`,
                });
            }

            onSuccess?.();
        } catch (error: unknown) {
            console.error("Error al guardar paciente:", error);

            // Extraer mensaje de error del backend
            let errorMessage = "Ocurrió un error al comunicarse con el servidor.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "object" && error !== null) {
                const apiError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: string;
                            data?: string[] | string;
                        };
                    };
                };

                // Si hay errores de validación del backend
                if (apiError.response?.data?.data) {
                    const validationErrors = apiError.response.data.data;
                    errorMessage = Array.isArray(validationErrors)
                        ? validationErrors.join(", ")
                        : validationErrors;
                } else {
                    errorMessage = apiError.response?.data?.message ||
                        apiError.response?.data?.error ||
                        errorMessage;
                }
            }

            toast.error(
                isEditing
                    ? "No se pudo actualizar el paciente"
                    : "No se pudo crear el paciente",
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <InformacionPersonalSection 
                register={register} 
                errors={errors} 
            />
            
            <DireccionSection 
                register={register} 
                errors={errors} 
            />
            
            <ContactoSection 
                register={register} 
                errors={errors} 
            />
            
            <ObraSocialSection 
                register={register} 
                errors={errors} 
            />

            {/* ============================================ */}
            {/* BOTONES DE ACCIÓN */}
            {/* ============================================ */}

            <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-200 pt-6 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSaving
                        ? "Guardando..."
                        : isEditing
                            ? "Guardar cambios"
                            : "Crear paciente"}
                </button>
            </div>
        </form>
    );
}