
import { useState } from "react";

import {
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useRegistroPaciente } from "@/hooks/useRegistroPaciente";

import {
    registroPacienteSchema,
    type RegistroPacienteFormData,
} from "@/schemas/registroPaciente.schema";

import {
    FormInput,
    FormSection,
} from "./RegistroPacienteFormSections";

import { RegistroPacienteIconos } from "./registroPaciente.constants";

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function RegistroPacienteForm() {
    const navigate = useNavigate();

    const registroMutation = useRegistroPaciente();

    const [errorServidor, setErrorServidor] = useState("");

    const [registroExitoso, setRegistroExitoso] = useState(false);

    const form = useForm<RegistroPacienteFormData>({
        resolver: zodResolver(registroPacienteSchema),
        defaultValues: {
            nombre: "",
            dni: "",
            email: "",
            telefono: {
                codigoArea: "",
                numero: "",
            },
        },
    });

    const cargando =
        form.formState.isSubmitting ||
        registroMutation.isPending;

    // =====================================================
    // LIMPIAR ERROR DEL SERVIDOR
    // =====================================================

    const limpiarErrorServidor = () => {
        if (errorServidor) {
            setErrorServidor("");
        }
    };

    // =====================================================
    // REGISTRAR PACIENTE
    // =====================================================

    const onSubmit = form.handleSubmit(async (datos) => {
        if (cargando) {
            return;
        }

        setErrorServidor("");

        try {
            await registroMutation.mutateAsync(datos);

            setRegistroExitoso(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    setErrorServidor(
                        "No pudimos comunicarnos con el servidor. Revisá tu conexión e intentá nuevamente."
                    );
                    return;
                }

                const status = error.response.status;
                const mensaje = error.response.data?.message;

                if (
                    typeof mensaje === "string" &&
                    mensaje.trim().length > 0 &&
                    status !== 500
                ) {
                    setErrorServidor(mensaje);
                    return;
                }

                if (status === 429) {
                    setErrorServidor(
                        "Realizaste demasiados intentos. Esperá unos minutos antes de volver a intentar."
                    );
                    return;
                }

                if (status >= 500) {
                    setErrorServidor(
                        "Ocurrió un problema en el servidor. Intentá nuevamente más tarde."
                    );
                    return;
                }
            }

            setErrorServidor(
                "No pudimos completar el registro. Intentá nuevamente."
            );
        }
    });

    // =====================================================
    // CONFIRMACIÓN DE REGISTRO
    // =====================================================

    if (registroExitoso) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                    ¡Registro completado!
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    Tu cuenta de paciente fue creada correctamente.
                    Ya podés ingresar al sistema utilizando tu DNI y
                    teléfono registrado.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
                >
                    Ir al inicio de sesión

                    <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-0.5"
                    />
                </button>
            </div>
        );
    }

    // =====================================================
    // FORMULARIO
    // =====================================================

    return (
        <form
            noValidate
            onSubmit={onSubmit}
            aria-busy={cargando}
            className="space-y-7"
        >
            {/* INFORMACIÓN PERSONAL */}

            <FormSection
                titulo="Información personal"
                descripcion="Completá tus datos de identificación."
                icono={RegistroPacienteIconos.nombre}
            >
                <FormInput
                    id="nombre"
                    label="Nombre completo"
                    type="text"
                    icono={RegistroPacienteIconos.nombre}
                    placeholder="Ej. Juan Pérez"
                    autoComplete="name"
                    maxLength={100}
                    registro={form.register("nombre", {
                        onChange: limpiarErrorServidor,
                    })}
                    error={form.formState.errors.nombre?.message}
                    disabled={cargando}
                />

                <FormInput
                    id="dni"
                    label="DNI"
                    type="text"
                    inputMode="numeric"
                    icono={RegistroPacienteIconos.dni}
                    placeholder="Ej. 30123456"
                    autoComplete="off"
                    maxLength={8}
                    registro={form.register("dni", {
                        onChange: (event) => {
                            limpiarErrorServidor();

                            event.target.value =
                                event.target.value.replace(/\D/g, "");
                        },
                    })}
                    error={form.formState.errors.dni?.message}
                    disabled={cargando}
                />
            </FormSection>

            <div className="border-t border-slate-100" />

            {/* DATOS DE CONTACTO */}

            <FormSection
                titulo="Datos de contacto"
                descripcion="Necesitamos estos datos para identificarte y enviarte códigos de verificación."
                icono={RegistroPacienteIconos.email}
            >
                <FormInput
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    icono={RegistroPacienteIconos.email}
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                    maxLength={254}
                    registro={form.register("email", {
                        onChange: limpiarErrorServidor,
                    })}
                    error={form.formState.errors.email?.message}
                    disabled={cargando}
                />

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Teléfono celular
                    </label>

                    <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
                        <FormInput
                            id="codigoArea"
                            label="Código de área"
                            type="text"
                            inputMode="numeric"
                            icono={RegistroPacienteIconos.telefono}
                            placeholder="3777"
                            autoComplete="off"
                            registro={form.register(
                                "telefono.codigoArea",
                                {
                                    onChange: (event) => {
                                        limpiarErrorServidor();

                                        event.target.value =
                                            event.target.value.replace(/\D/g, "");
                                    },
                                }
                            )}
                            error={
                                form.formState.errors.telefono
                                    ?.codigoArea?.message
                            }
                            disabled={cargando}
                        />

                        <FormInput
                            id="numero"
                            label="Número"
                            type="text"
                            inputMode="numeric"
                            icono={RegistroPacienteIconos.telefono}
                            placeholder="123456"
                            autoComplete="tel-national"
                            registro={form.register(
                                "telefono.numero",
                                {
                                    onChange: (event) => {
                                        limpiarErrorServidor();

                                        event.target.value =
                                            event.target.value.replace(/\D/g, "");
                                    },
                                }
                            )}
                            error={
                                form.formState.errors.telefono
                                    ?.numero?.message
                            }
                            disabled={cargando}
                        />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                        Ingresá el código de área y el número sin el prefijo
                        internacional.
                    </p>
                </div>
            </FormSection>

            {/* INFORMACIÓN SOBRE SEGURIDAD */}

            <div className="flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
                <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-cyan-600"
                />

                <p className="text-xs leading-5 text-slate-600">
                    Tu correo electrónico será utilizado para enviarte
                    códigos de verificación cuando inicies sesión.
                    Asegurate de ingresar uno al que tengas acceso.
                </p>
            </div>

            {/* ERROR DEL SERVIDOR */}

            {errorServidor && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {errorServidor}
                </div>
            )}

            {/* BOTÓN DE REGISTRO */}

            <button
                type="submit"
                disabled={cargando}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {cargando ? (
                    <>
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        Creando cuenta...
                    </>
                ) : (
                    <>
                        Crear cuenta

                        <ArrowRight
                            size={17}
                            className="transition group-hover:translate-x-0.5"
                        />
                    </>
                )}
            </button>

            {/* VOLVER AL LOGIN */}

            <p className="text-center text-sm text-slate-500">
                ¿Ya tenés una cuenta?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-cyan-700 transition hover:text-cyan-900"
                >
                    Iniciá sesión
                </Link>
            </p>
        </form>
    );
}
