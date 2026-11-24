
import {
    useEffect,
    useState,
    type InputHTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
} from "react";

import { Navigate } from "react-router-dom";

import {
    useForm,
    type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Clock3,
    CreditCard,
    HeartPulse,
    KeyRound,
    Loader2,
    LockKeyhole,
    Mail,
    Phone,
    ShieldCheck,
    Stethoscope,
    UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { obtenerRutaInicio } from "@/lib/auth";
import { cn } from "@/lib/utils";

import {
    loginPacienteSchema,
    loginSchema,
    verificarOtpPacienteSchema,
    type LoginFormData,
    type LoginPacienteFormData,
    type VerificarOtpPacienteFormData,
} from "@/schemas/auth.schema";

import imagenLogin from "@/assets/login/sala-espera.jpg";

const MODALIDADES = [
    {
        id: "sala",
        label: "Sala Médica",
        icon: Stethoscope,
    },
    {
        id: "paciente",
        label: "Paciente",
        icon: UserRound,
    },
] as const;

type Modalidad = (typeof MODALIDADES)[number]["id"];

type PasoPaciente = "credenciales" | "codigo";

interface SolicitudOtp {
    expiraEn: string;
    proximoEnvioPermitido: string;
}

export default function LoginPage() {
    const {
        identidad,
        login,
        solicitarCodigoPaciente,
        verificarCodigoPaciente,
    } = useAuth();

    const [modalidad, setModalidad] =
        useState<Modalidad>("sala");

    const [errorServidor, setErrorServidor] =
        useState("");

    const [enviando, setEnviando] = useState(false);

    const [pasoPaciente, setPasoPaciente] =
        useState<PasoPaciente>("credenciales");

    const [credencialesPaciente, setCredencialesPaciente] =
        useState<LoginPacienteFormData | null>(null);

    const [solicitudOtp, setSolicitudOtp] =
        useState<SolicitudOtp | null>(null);

    // Se inicializa con un valor puro.
    // La hora se actualiza mediante el intervalo.
    const [ahora, setAhora] = useState(0);

    const formSala = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const formPaciente = useForm<LoginPacienteFormData>({
        resolver: zodResolver(loginPacienteSchema),
        defaultValues: {
            dni: "",
            telefono: "",
        },
    });

    const formOtp = useForm<VerificarOtpPacienteFormData>({
        resolver: zodResolver(verificarOtpPacienteSchema),
        defaultValues: {
            codigo: "",
        },
    });

    const cargando =
        enviando ||
        formSala.formState.isSubmitting ||
        formPaciente.formState.isSubmitting ||
        formOtp.formState.isSubmitting;

    const esSala = modalidad === "sala";

    // =====================================================
    // RELOJ PARA EXPIRACIÓN Y REENVÍO
    // =====================================================

    // El efecto se declara antes de cualquier retorno condicional.
    // No actualizamos el estado directamente al ejecutarse el efecto:
    // solamente lo hacemos desde el callback del intervalo.
    useEffect(() => {
        const intervalo = window.setInterval(() => {
            setAhora(Date.now());
        }, 1000);

        return () => {
            window.clearInterval(intervalo);
        };
    }, []);

    const segundosReenvio = solicitudOtp
        ? Math.max(
              0,
              Math.ceil(
                  (
                      new Date(
                          solicitudOtp.proximoEnvioPermitido
                      ).getTime() - ahora
                  ) / 1000
              )
          )
        : 0;

    const segundosExpiracion = solicitudOtp
        ? Math.max(
              0,
              Math.ceil(
                  (
                      new Date(
                          solicitudOtp.expiraEn
                      ).getTime() - ahora
                  ) / 1000
              )
          )
        : 0;

    const formatearTiempo = (segundos: number) => {
        const minutos = Math.floor(segundos / 60);
        const restantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(
            restantes
        ).padStart(2, "0")}`;
    };

    // =====================================================
    // REDIRECCIÓN SI YA EXISTE UNA SESIÓN
    // =====================================================

    if (identidad) {
        return (
            <Navigate
                to={obtenerRutaInicio(identidad)}
                replace
            />
        );
    }

    // =====================================================
    // MANEJO DE ERRORES
    // =====================================================

    const limpiarErrorServidor = () => {
        if (errorServidor) {
            setErrorServidor("");
        }
    };

    // =====================================================
    // CAMBIO DE MODALIDAD
    // =====================================================

    const cambiarModalidad = (nueva: Modalidad) => {
        if (nueva === modalidad || cargando) {
            return;
        }

        setModalidad(nueva);
        setErrorServidor("");

        setPasoPaciente("credenciales");
        setCredencialesPaciente(null);
        setSolicitudOtp(null);

        formSala.clearErrors();
        formPaciente.clearErrors();
        formOtp.reset();
    };

    const handleTabKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        actual: Modalidad
    ) => {
        if (
            event.key !== "ArrowLeft" &&
            event.key !== "ArrowRight" &&
            event.key !== "Home" &&
            event.key !== "End"
        ) {
            return;
        }

        event.preventDefault();

        const destino: Modalidad =
            event.key === "Home"
                ? "sala"
                : event.key === "End"
                  ? "paciente"
                  : actual === "sala"
                    ? "paciente"
                    : "sala";

        cambiarModalidad(destino);

        document
            .getElementById(`tab-${destino}`)
            ?.focus();
    };

    // =====================================================
    // LOGIN INTERNO
    // =====================================================

    const onSubmitSala = formSala.handleSubmit(
        async (datos) => {
            if (enviando) {
                return;
            }

            setEnviando(true);
            setErrorServidor("");

            try {
                await login(datos);
            } catch (error) {
                setErrorServidor(
                    obtenerMensajeError(error, "sala")
                );
            } finally {
                setEnviando(false);
            }
        }
    );

    // =====================================================
    // PASO 1: SOLICITAR OTP
    // =====================================================

    const onSubmitPaciente = formPaciente.handleSubmit(
        async (datos) => {
            if (enviando) {
                return;
            }

            setEnviando(true);
            setErrorServidor("");

            try {
                const response =
                    await solicitarCodigoPaciente(datos);

                setCredencialesPaciente(datos);
                setSolicitudOtp(response);
                setPasoPaciente("codigo");

                formOtp.reset({
                    codigo: "",
                });
            } catch (error) {
                setErrorServidor(
                    obtenerMensajeError(
                        error,
                        "paciente",
                        "solicitud"
                    )
                );
            } finally {
                setEnviando(false);
            }
        }
    );

    // =====================================================
    // PASO 2: VERIFICAR OTP
    // =====================================================

    const onSubmitOtp = formOtp.handleSubmit(
        async (datos) => {
            if (
                enviando ||
                !credencialesPaciente
            ) {
                return;
            }

            setEnviando(true);
            setErrorServidor("");

            try {
                await verificarCodigoPaciente({
                    ...credencialesPaciente,
                    codigo: datos.codigo,
                });

                // AuthContext guarda el JWT y la identidad.
                // La redirección se realiza automáticamente.
            } catch (error) {
                setErrorServidor(
                    obtenerMensajeError(
                        error,
                        "paciente",
                        "verificacion"
                    )
                );
            } finally {
                setEnviando(false);
            }
        }
    );

    // =====================================================
    // REENVIAR OTP
    // =====================================================

    const reenviarCodigo = async () => {
        if (
            enviando ||
            !credencialesPaciente ||
            segundosReenvio > 0
        ) {
            return;
        }

        setEnviando(true);
        setErrorServidor("");

        try {
            const response =
                await solicitarCodigoPaciente(
                    credencialesPaciente
                );

            setSolicitudOtp(response);
            setAhora(Date.now());

            formOtp.reset({
                codigo: "",
            });
        } catch (error) {
            setErrorServidor(
                obtenerMensajeError(
                    error,
                    "paciente",
                    "solicitud"
                )
            );
        } finally {
            setEnviando(false);
        }
    };

    // =====================================================
    // VOLVER AL PASO DE CREDENCIALES
    // =====================================================

    const volverACredenciales = () => {
        if (cargando) {
            return;
        }

        setPasoPaciente("credenciales");
        setSolicitudOtp(null);
        setCredencialesPaciente(null);
        setErrorServidor("");

        formOtp.reset();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[45%_55%]">
            {/* SECTOR VISUAL */}

            <section className="relative isolate h-56 overflow-hidden sm:h-72 lg:h-auto lg:min-h-screen">
                <img
                    src={imagenLogin}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/70 to-slate-950/60" />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-12">
                    <Marca variante="clara" />

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-cyan-100 backdrop-blur-sm">
                            <ShieldCheck size={14} />
                            Entorno seguro
                        </span>

                        <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight tracking-tight text-white lg:text-3xl">
                            Cuidar empieza por estar cerca.
                        </h2>

                        <p className="mt-3 hidden max-w-sm text-sm leading-6 text-slate-200 sm:block">
                            Accedé a la gestión de la Sala
                            Médica o consultá tu ficha como
                            paciente desde un mismo lugar.
                        </p>
                    </div>

                    <p className="hidden text-xs text-slate-300 lg:block">
                        Sala de Emergencias · Gestión sanitaria
                    </p>
                </div>
            </section>

            {/* SECTOR DEL FORMULARIO */}

            <main className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                                Acceso al sistema
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                                Bienvenido
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {esSala
                                    ? "Ingresá con tu email y contraseña para acceder al panel de gestión."
                                    : pasoPaciente === "credenciales"
                                      ? "Ingresá con el DNI y el teléfono registrados en tu ficha de paciente."
                                      : "Ingresá el código de seis dígitos que enviamos a tu correo electrónico."}
                            </p>
                        </div>

                        {/* SELECTOR DE MODALIDAD */}

                        <div
                            role="tablist"
                            aria-label="Tipo de credenciales"
                            className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1"
                        >
                            {MODALIDADES.map(
                                ({ id, label, icon: Icon }) => {
                                    const activa =
                                        modalidad === id;

                                    return (
                                        <button
                                            key={id}
                                            id={`tab-${id}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={activa}
                                            aria-controls={`panel-${id}`}
                                            tabIndex={activa ? 0 : -1}
                                            disabled={cargando}
                                            onClick={() =>
                                                cambiarModalidad(id)
                                            }
                                            onKeyDown={(event) =>
                                                handleTabKeyDown(
                                                    event,
                                                    id
                                                )
                                            }
                                            className={cn(
                                                "flex min-h-14 items-center justify-center gap-2 rounded-xl px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                                                activa
                                                    ? "bg-white text-slate-900 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-800"
                                            )}
                                        >
                                            <Icon
                                                size={18}
                                                className={
                                                    activa
                                                        ? "shrink-0 text-cyan-600"
                                                        : "shrink-0 text-slate-400"
                                                }
                                            />

                                            <span className="flex flex-col leading-tight">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Credenciales
                                                </span>

                                                <span className="text-sm font-semibold">
                                                    {label}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        {/* FORMULARIO SALA MÉDICA */}

                        <div
                            id="panel-sala"
                            role="tabpanel"
                            aria-labelledby="tab-sala"
                            hidden={!esSala}
                        >
                            <form
                                noValidate
                                onSubmit={onSubmitSala}
                                aria-busy={
                                    formSala.formState.isSubmitting
                                }
                                className="mt-6 space-y-5"
                            >
                                <CampoTexto
                                    id="email"
                                    label="Email"
                                    type="email"
                                    icon={Mail}
                                    placeholder="nombre@salamedica.com"
                                    autoComplete="email"
                                    registro={formSala.register(
                                        "email",
                                        {
                                            onChange:
                                                limpiarErrorServidor,
                                        }
                                    )}
                                    error={
                                        formSala.formState.errors
                                            .email?.message
                                    }
                                    disabled={cargando}
                                />

                                <CampoTexto
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    icon={LockKeyhole}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    registro={formSala.register(
                                        "password",
                                        {
                                            onChange:
                                                limpiarErrorServidor,
                                        }
                                    )}
                                    error={
                                        formSala.formState.errors
                                            .password?.message
                                    }
                                    disabled={cargando}
                                />

                                <ErrorServidor
                                    mensaje={errorServidor}
                                />

                                <BotonIngresar cargando={cargando}>
                                    Ingresar a la Sala Médica
                                </BotonIngresar>
                            </form>
                        </div>

                        {/* FORMULARIO PACIENTE */}

                        <div
                            id="panel-paciente"
                            role="tabpanel"
                            aria-labelledby="tab-paciente"
                            hidden={esSala}
                        >
                            {pasoPaciente === "credenciales" ? (
                                <form
                                    noValidate
                                    onSubmit={onSubmitPaciente}
                                    aria-busy={
                                        formPaciente.formState.isSubmitting
                                    }
                                    className="mt-6 space-y-5"
                                >
                                    <CampoTexto
                                        id="dni"
                                        label="DNI"
                                        type="text"
                                        inputMode="numeric"
                                        icon={CreditCard}
                                        placeholder="Ej. 30123456"
                                        autoComplete="off"
                                        registro={formPaciente.register(
                                            "dni",
                                            {
                                                onChange:
                                                    limpiarErrorServidor,
                                            }
                                        )}
                                        error={
                                            formPaciente.formState.errors
                                                .dni?.message
                                        }
                                        disabled={cargando}
                                    />

                                    <CampoTexto
                                        id="telefono"
                                        label="Teléfono"
                                        type="tel"
                                        inputMode="tel"
                                        icon={Phone}
                                        placeholder="Ej. 3777123456"
                                        autoComplete="off"
                                        registro={formPaciente.register(
                                            "telefono",
                                            {
                                                onChange:
                                                    limpiarErrorServidor,
                                            }
                                        )}
                                        error={
                                            formPaciente.formState.errors
                                                .telefono?.message
                                        }
                                        disabled={cargando}
                                    />

                                    <ErrorServidor
                                        mensaje={errorServidor}
                                    />

                                    <BotonIngresar cargando={cargando}>
                                        Enviar código de verificación
                                    </BotonIngresar>
                                </form>
                            ) : (
                                <form
                                    noValidate
                                    onSubmit={onSubmitOtp}
                                    aria-busy={
                                        formOtp.formState.isSubmitting
                                    }
                                    className="mt-6 space-y-5"
                                >
                                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                                                <Mail size={20} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Revisá tu correo electrónico
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                                    Enviamos un código de seis
                                                    dígitos al correo registrado
                                                    en tu ficha de paciente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <CampoTexto
                                        id="codigo"
                                        label="Código de verificación"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        icon={KeyRound}
                                        placeholder="Ej. 123456"
                                        registro={formOtp.register(
                                            "codigo",
                                            {
                                                onChange: (event) => {
                                                    limpiarErrorServidor();

                                                    event.target.value =
                                                        event.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );
                                                },
                                            }
                                        )}
                                        error={
                                            formOtp.formState.errors
                                                .codigo?.message
                                        }
                                        disabled={cargando}
                                    />

                                    {solicitudOtp && (
                                        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="flex items-center justify-between gap-3 text-xs">
                                                <span className="flex items-center gap-2 text-slate-500">
                                                    <Clock3 size={15} />
                                                    El código vence en
                                                </span>

                                                <span className="font-semibold tabular-nums text-slate-800">
                                                    {formatearTiempo(
                                                        segundosExpiracion
                                                    )}
                                                </span>
                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-cyan-500 transition-all"
                                                    style={{
                                                        width: `${
                                                            Math.min(
                                                                100,
                                                                (segundosExpiracion /
                                                                    300) *
                                                                    100
                                                            )
                                                        }%`,
                                                    }}
                                                />
                                            </div>

                                            {segundosExpiracion === 0 && (
                                                <p className="text-xs text-amber-700">
                                                    El código puede haber
                                                    expirado. Solicitá uno
                                                    nuevo para continuar.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <ErrorServidor
                                        mensaje={errorServidor}
                                    />

                                    <BotonIngresar cargando={cargando}>
                                        Verificar código
                                    </BotonIngresar>

                                    <div className="flex flex-col items-center gap-3 pt-1">
                                        <button
                                            type="button"
                                            disabled={
                                                cargando ||
                                                segundosReenvio > 0
                                            }
                                            onClick={reenviarCodigo}
                                            className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 disabled:cursor-not-allowed disabled:text-slate-400"
                                        >
                                            {segundosReenvio > 0
                                                ? `Podés solicitar otro código en ${formatearTiempo(
                                                      segundosReenvio
                                                  )}`
                                                : "¿No recibiste el código? Reenviar"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={cargando}
                                            onClick={volverACredenciales}
                                            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-slate-800 disabled:opacity-50"
                                        >
                                            <ArrowLeft size={14} />
                                            Volver e ingresar otros datos
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                            {esSala
                                ? "¿No podés ingresar? Contactá al administrador del sistema."
                                : pasoPaciente === "credenciales"
                                  ? "Usá el mismo teléfono con el que te registraste en la sala."
                                  : "Si no recibís el correo, comunicate con recepción."}
                        </p>
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Sistema interno de gestión · Sala de Emergencias
                    </p>
                </div>
            </main>
        </div>
    );
}

/* ===================================================== */
/* COMPONENTES                                           */
/* ===================================================== */

interface MarcaProps {
    variante: "clara" | "oscura";
}

function Marca({ variante }: MarcaProps) {
    const esClara = variante === "clara";

    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25">
                <HeartPulse size={22} strokeWidth={2.3} />
            </div>

            <div>
                <p
                    className={cn(
                        "text-sm font-semibold tracking-tight",
                        esClara ? "text-white" : "text-slate-900"
                    )}
                >
                    Emergencias
                </p>

                <p
                    className={cn(
                        "text-[11px]",
                        esClara ? "text-slate-300" : "text-slate-500"
                    )}
                >
                    Gestión sanitaria
                </p>
            </div>
        </div>
    );
}

interface CampoTextoProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "className" | "id"
    > {
    id: string;
    label: string;
    icon: LucideIcon;
    registro: UseFormRegisterReturn;
    error?: string;
}

function CampoTexto({
    id,
    label,
    icon: Icon,
    registro,
    error,
    ...props
}: CampoTextoProps) {
    const errorId = `${id}-error`;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    id={id}
                    {...registro}
                    {...props}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? errorId : undefined
                    }
                    className={cn(
                        "h-12 w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 hover:border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    )}
                />
            </div>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

interface ErrorServidorProps {
    mensaje: string;
}

function ErrorServidor({ mensaje }: ErrorServidorProps) {
    if (!mensaje) {
        return null;
    }

    return (
        <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
            />

            <p>{mensaje}</p>
        </div>
    );
}

interface BotonIngresarProps {
    cargando: boolean;
    children: ReactNode;
}

function BotonIngresar({
    cargando,
    children,
}: BotonIngresarProps) {
    return (
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
                    Procesando...
                </>
            ) : (
                <>
                    {children}

                    <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-0.5"
                    />
                </>
            )}
        </button>
    );
}

/* ===================================================== */
/* ERRORES                                               */
/* ===================================================== */

function obtenerMensajeError(
    error: unknown,
    modalidad: Modalidad,
    etapa?: "solicitud" | "verificacion"
): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "No pudimos comunicarnos con el servidor. Revisá tu conexión e intentá nuevamente.";
        }

        const status = error.response.status;

        const mensajeBackend =
            error.response.data?.message;

        if (
            modalidad === "paciente" &&
            typeof mensajeBackend === "string" &&
            mensajeBackend.trim().length > 0 &&
            status !== 500
        ) {
            return mensajeBackend;
        }

        if (status === 401) {
            if (modalidad === "sala") {
                return "Email o contraseña incorrectos.";
            }

            return etapa === "verificacion"
                ? "No pudimos validar el código o las credenciales. Revisá los datos e intentá nuevamente."
                : "DNI o teléfono incorrectos.";
        }

        if (status === 400) {
            if (modalidad === "sala") {
                return "Revisá el email y la contraseña ingresados.";
            }

            return etapa === "verificacion"
                ? "El código ingresado no es válido. Revisalo e intentá nuevamente."
                : "Revisá el DNI y el teléfono ingresados.";
        }

        if (status === 429) {
            return "Demasiados intentos o solicitudes. Esperá unos minutos antes de volver a intentar.";
        }

        if (status >= 500) {
            return "Ocurrió un problema en el servidor. Intentá nuevamente más tarde.";
        }
    }

    return "No pudimos completar la operación. Intentá nuevamente.";
}
