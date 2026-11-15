import { useEffect, useState } from "react";
import {
    useForm,
    useWatch,
    type SubmitHandler,
    type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, UserPlus, X } from "lucide-react";

import {
    crearUsuarioSchema,
    actualizarUsuarioSchema,
    type CrearUsuarioSchema,
} from "@/schemas/usuario.schema";

import {
    useCreateUsuario,
    useUpdateUsuario,
} from "@/hooks/useUsuarios";

import { getMedicos } from "@/api/medicos.api";

import type { Medico } from "@/types/medico";
import type {
    Usuario,
    CrearUsuarioData,
    ActualizarUsuarioData,
} from "@/types/usuario";

import UsuarioFormSection from "@/components/usuarios/UsuarioFormSections";

// ============================================
// PROPS
// ============================================

interface UsuarioFormProps {
    usuario?: Usuario;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// ============================================
// VALORES INICIALES
// ============================================

const defaultValues: CrearUsuarioSchema = {
    nombre: "",
    email: "",
    password: "",
    rol: "recepcionista",
    medico: null,
};

// ============================================
// OBTENER ID DEL MÉDICO
// ============================================

function obtenerMedicoId(medico: Usuario["medico"]): string | null {
    if (!medico) return null;

    if (typeof medico === "string") return medico;

    return medico._id;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function UsuarioForm({
    usuario,
    onSuccess,
    onCancel,
}: UsuarioFormProps) {
    const esEdicion = Boolean(usuario);

    const createMutation = useCreateUsuario();
    const updateMutation = useUpdateUsuario();

    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    // ============================================
    // CONFIGURACIÓN DEL FORMULARIO
    // ============================================

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CrearUsuarioSchema>({
        resolver: zodResolver(
            esEdicion ? actualizarUsuarioSchema : crearUsuarioSchema
        ) as Resolver<CrearUsuarioSchema>,

        defaultValues: usuario
            ? {
                  nombre: usuario.nombre,
                  email: usuario.email,
                  password: "",
                  rol: usuario.rol === "admin"
                      ? "recepcionista"
                      : usuario.rol,
                  medico: obtenerMedicoId(usuario.medico),
              }
            : defaultValues,
    });

    // ============================================
    // OBSERVAR ROL SELECCIONADO
    // ============================================

    const rolSeleccionado = useWatch({
        control,
        name: "rol",
    });

    // ============================================
    // CARGAR MÉDICOS
    // ============================================

    useEffect(() => {
        const cargarMedicos = async () => {
            try {
                setCargandoDatos(true);

                const response = await getMedicos();

                setMedicos(response.data.filter((medico) => medico.activo));
            } catch (error) {
                console.error("Error al cargar médicos:", error);

                toast.error("No se pudieron cargar los médicos", {
                    description: "Verificá la conexión con el servidor.",
                });
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarMedicos();
    }, []);

    // ============================================
    // LIMPIAR MÉDICO AL CAMBIAR DE ROL
    // ============================================

    useEffect(() => {
        if (rolSeleccionado === "recepcionista") {
            setValue("medico", null, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [rolSeleccionado, setValue]);

    // ============================================
    // MANEJAR ENVÍO DEL FORMULARIO
    // ============================================

    const onSubmit: SubmitHandler<CrearUsuarioSchema> = async (data) => {
        try {
            if (esEdicion && usuario) {
                const datosActualizacion: ActualizarUsuarioData = {
                    nombre: data.nombre,
                    email: data.email,
                    rol: data.rol,
                    medico: data.rol === "medico" ? data.medico : null,
                };

                // La contraseña solo se envía si se ingresó una nueva.
                if (data.password?.trim()) {
                    datosActualizacion.password = data.password;
                }

                await updateMutation.mutateAsync({
                    id: usuario._id,
                    usuario: datosActualizacion,
                });

                toast.success("Usuario actualizado correctamente", {
                    description: "Los datos de la cuenta fueron actualizados.",
                });
            } else {
                const nuevoUsuario: CrearUsuarioData = {
                    nombre: data.nombre,
                    email: data.email,
                    password: data.password,
                    rol: data.rol,
                    medico: data.rol === "medico" ? data.medico : null,
                };

                await createMutation.mutateAsync(nuevoUsuario);

                toast.success("Usuario registrado correctamente", {
                    description: "La cuenta fue creada exitosamente.",
                });
            }

            reset(defaultValues);
            onSuccess?.();
        } catch (error: unknown) {
            console.error("Error al guardar usuario:", error);

            let errorMessage =
                "Ocurrió un error al comunicarse con el servidor.";

            // Priorizar los mensajes enviados por la API.
            if (
                typeof error === "object" &&
                error !== null &&
                "response" in error
            ) {
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

            toast.error(
                esEdicion
                    ? "No se pudo actualizar el usuario"
                    : "No se pudo registrar el usuario",
                {
                    description: errorMessage,
                }
            );
        }
    };

    const isSaving =
        createMutation.isPending || updateMutation.isPending;

    // ============================================
    // RENDERIZADO
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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            <UsuarioFormSection
                register={register}
                errors={errors}
                medicos={medicos}
                mostrarPassword={!esEdicion}
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
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Save size={18} />
                            {esEdicion ? "Actualizando..." : "Registrando..."}
                        </>
                    ) : (
                        <>
                            {esEdicion ? (
                                <Save size={18} />
                            ) : (
                                <UserPlus size={18} />
                            )}

                            {esEdicion
                                ? "Guardar cambios"
                                : "Registrar usuario"}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}