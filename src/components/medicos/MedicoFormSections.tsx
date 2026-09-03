import {
    Stethoscope,
    User,
    Phone,
    Clock,
    Plus,
    Trash2,
} from "lucide-react";

import type {
    FieldArrayWithId,
    FieldErrors,
    UseFormRegister,
    UseFormRegisterReturn,
} from "react-hook-form";

import type {
    InputHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
} from "react";

import type { MedicoFormData } from "@/schemas/medico.schema";

// ============================================
// TIPOS Y CONSTANTES
// ============================================

type ColorTheme = "blue" | "purple" | "green" | "orange";

interface FormSectionProps {
    icon: typeof Stethoscope;
    title: string;
    description: string;
    color: ColorTheme;
    children: ReactNode;
}

interface FormInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "className"
    > {
    label: string;
    error?: {
        message?: string;
    };
    color?: ColorTheme;
    register: UseFormRegisterReturn;
    className?: string;
}

interface FormSelectProps
    extends Omit<
        SelectHTMLAttributes<HTMLSelectElement>,
        "className"
    > {
    label: string;
    error?: {
        message?: string;
    };
    color?: ColorTheme;
    register: UseFormRegisterReturn;
    className?: string;
    children: ReactNode;
}

interface FormSectionFieldsProps {
    register: UseFormRegister<MedicoFormData>;
    errors: FieldErrors<MedicoFormData>;
}

// ============================================
// HORARIOS
// ============================================

type HorarioField = FieldArrayWithId<
    MedicoFormData,
    "horariosAtencion",
    "id"
>;

interface HorarioMedicoSectionProps
    extends FormSectionFieldsProps {
    fields: HorarioField[];
    onAdd: () => void;
    onRemove: (index: number) => void;
}

// ============================================
// ESTILOS
// ============================================

interface ColorStyles {
    section: string;
    icon: string;
    title: string;
    description: string;
    label: string;
    input: string;
}

const COLOR_STYLES: Record<ColorTheme, ColorStyles> = {
    blue: {
        section:
            "from-blue-50/80 to-indigo-50/80 border-blue-200/50",
        icon: "bg-blue-600",
        title: "text-blue-900",
        description: "text-blue-600",
        label: "text-blue-800",
        input:
            "border-blue-300 focus:border-blue-500 focus:ring-blue-200 hover:border-blue-400",
    },

    purple: {
        section:
            "from-purple-50/80 to-violet-50/80 border-purple-200/50",
        icon: "bg-purple-600",
        title: "text-purple-900",
        description: "text-purple-600",
        label: "text-purple-800",
        input:
            "border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400",
    },

    green: {
        section:
            "from-emerald-50/80 to-green-50/80 border-emerald-200/50",
        icon: "bg-emerald-600",
        title: "text-emerald-900",
        description: "text-emerald-600",
        label: "text-emerald-800",
        input:
            "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-400",
    },

    orange: {
        section:
            "from-orange-50/80 to-amber-50/80 border-orange-200/50",
        icon: "bg-orange-600",
        title: "text-orange-900",
        description: "text-orange-600",
        label: "text-orange-800",
        input:
            "border-orange-300 focus:border-orange-500 focus:ring-orange-200",
    },
};

// ============================================
// FORM SECTION
// ============================================

export function FormSection({
    icon: Icon,
    title,
    description,
    color,
    children,
}: FormSectionProps) {
    const styles = COLOR_STYLES[color];

    return (
        <section
            className={`bg-linear-to-br ${styles.section} rounded-2xl border p-6`}
        >
            <div className="mb-5 flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon} text-white shadow-md`}
                >
                    <Icon size={20} />
                </div>

                <div>
                    <h2
                        className={`text-base font-semibold ${styles.title}`}
                    >
                        {title}
                    </h2>

                    <p
                        className={`text-sm ${styles.description}`}
                    >
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

// ============================================
// INPUT
// ============================================

export function FormInput({
    label,
    error,
    color = "blue",
    register,
    className = "",
    id,
    required,
    ...props
}: FormInputProps) {
    const styles = COLOR_STYLES[color];

    const errorStyles =
        "border-red-400 focus:border-red-500 focus:ring-red-200";

    return (
        <div className={`space-y-2 ${className}`}>
            <label
                htmlFor={id}
                className={`text-sm ${
                    required
                        ? "font-semibold"
                        : "font-medium"
                } ${styles.label}`}
            >
                {label}

                {required && (
                    <span className="text-red-500">
                        {" "}
                        *
                    </span>
                )}
            </label>

            <input
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? errorStyles
                        : styles.input
                }`}
            />

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error.message}
                </p>
            )}
        </div>
    );
}

// ============================================
// SELECT
// ============================================

export function FormSelect({
    label,
    error,
    color = "blue",
    register,
    className = "",
    id,
    required,
    children,
    ...props
}: FormSelectProps) {
    const styles = COLOR_STYLES[color];

    const errorStyles =
        "border-red-400 focus:border-red-500 focus:ring-red-200";

    return (
        <div className={`space-y-2 ${className}`}>
            <label
                htmlFor={id}
                className={`text-sm ${
                    required
                        ? "font-semibold"
                        : "font-medium"
                } ${styles.label}`}
            >
                {label}

                {required && (
                    <span className="text-red-500">
                        {" "}
                        *
                    </span>
                )}
            </label>

            <select
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? errorStyles
                        : styles.input
                }`}
            >
                {children}
            </select>

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error.message}
                </p>
            )}
        </div>
    );
}

// ============================================
// INFORMACIÓN PERSONAL
// ============================================

export function InformacionMedicoSection({
    register,
    errors,
}: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={User}
            title="Información personal"
            description="Datos principales del médico."
            color="blue"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                    id="nombre"
                    label="Nombre"
                    required
                    error={errors.nombre}
                    color="blue"
                    register={register("nombre")}
                    placeholder="Ej. Juan"
                />

                <FormInput
                    id="apellido"
                    label="Apellido"
                    required
                    error={errors.apellido}
                    color="blue"
                    register={register("apellido")}
                    placeholder="Ej. Pérez"
                />

                <FormInput
                    id="matricula"
                    label="Matrícula"
                    required
                    error={errors.matricula}
                    color="blue"
                    register={register("matricula")}
                    placeholder="Ej. 123456"
                    inputMode="numeric"
                    maxLength={8}
                />

                <FormInput
                    id="email"
                    type="email"
                    label="Email"
                    required
                    error={errors.email}
                    color="blue"
                    register={register("email")}
                    placeholder="Ej. juan@correo.com"
                />
            </div>
        </FormSection>
    );
}

// ============================================
// ESPECIALIDAD
// ============================================

interface EspecialidadOption {
    id: string;
    nombre: string;
}

interface EspecialidadMedicoSectionProps
    extends FormSectionFieldsProps {
    especialidades: EspecialidadOption[];
}

export function EspecialidadMedicoSection({
    register,
    errors,
    especialidades,
}: EspecialidadMedicoSectionProps) {
    return (
        <FormSection
            icon={Stethoscope}
            title="Especialidad"
            description="Seleccioná la especialidad médica."
            color="purple"
        >
            <FormSelect
                id="especialidad"
                label="Especialidad"
                required
                error={errors.especialidad}
                color="purple"
                register={register("especialidad")}
            >
                <option value="">
                    Seleccioná una especialidad
                </option>

                {especialidades.map((especialidad) => (
                    <option
                        key={especialidad.id}
                        value={especialidad.id}
                    >
                        {especialidad.nombre}
                    </option>
                ))}
            </FormSelect>
        </FormSection>
    );
}

// ============================================
// TELÉFONO
// ============================================

export function TelefonoMedicoSection({
    register,
    errors,
}: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={Phone}
            title="Teléfono"
            description="Información de contacto del médico."
            color="green"
        >
            <div className="grid gap-5 md:grid-cols-3">
                <FormSelect
                    id="telefono.tipo"
                    label="Tipo"
                    required
                    error={errors.telefono?.tipo}
                    color="green"
                    register={register("telefono.tipo")}
                >
                    <option value="CELULAR">
                        Celular
                    </option>

                    <option value="FIJO">
                        Fijo
                    </option>

                    <option value="TRABAJO">
                        Trabajo
                    </option>
                </FormSelect>

                <FormInput
                    id="telefono.codigoArea"
                    label="Código de área"
                    required
                    error={errors.telefono?.codigoArea}
                    color="green"
                    register={register(
                        "telefono.codigoArea"
                    )}
                    placeholder="Ej. 3777"
                    inputMode="numeric"
                    maxLength={5}
                />

                <FormInput
                    id="telefono.numero"
                    label="Número"
                    required
                    error={errors.telefono?.numero}
                    color="green"
                    register={register(
                        "telefono.numero"
                    )}
                    placeholder="Ej. 123456"
                    inputMode="numeric"
                    maxLength={10}
                />
            </div>
        </FormSection>
    );
}

// ============================================
// HORARIOS DE ATENCIÓN
// ============================================

export function HorarioMedicoSection({
    register,
    errors,
    fields,
    onAdd,
    onRemove,
}: HorarioMedicoSectionProps) {
    return (
        <FormSection
            icon={Clock}
            title="Horarios de atención"
            description="Configurá los días y períodos en los que el médico atiende."
            color="orange"
        >
            <div className="space-y-6">

                {/* ================================== */}
                {/* DURACIÓN DEL TURNO */}
                {/* ================================== */}

                <div className="rounded-xl border border-orange-200 bg-white/70 p-5">
                    <div className="max-w-xs">
                        <FormInput
                            id="duracionTurno"
                            label="Duración del turno"
                            required
                            error={errors.duracionTurno}
                            color="orange"
                            register={register(
                                "duracionTurno",
                                {
                                    valueAsNumber: true,
                                }
                            )}
                            type="number"
                            min={5}
                            max={240}
                            step={5}
                            placeholder="Ej. 30"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Indicá la duración en minutos.
                            Por ejemplo: 30, 45 o 60.
                        </p>
                    </div>
                </div>

                {/* ================================== */}
                {/* LISTA DE HORARIOS */}
                {/* ================================== */}

                <div className="space-y-4">

                    {fields.map((field, index) => {
                        const horarioErrors =
                            errors.horariosAtencion?.[index];

                        return (
                            <div
                                key={field.id}
                                className="rounded-xl border border-orange-200 bg-white p-5 shadow-sm"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-orange-900">
                                            Horario{" "}
                                            {index + 1}
                                        </h3>

                                        <p className="text-xs text-orange-600">
                                            Configurá el período de atención.
                                        </p>
                                    </div>

                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(
                                                    index
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2
                                                size={15}
                                            />

                                            Eliminar
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-5 md:grid-cols-3">
                                    <FormSelect
                                        id={`horariosAtencion.${index}.dia`}
                                        label="Día"
                                        required
                                        error={
                                            horarioErrors?.dia
                                        }
                                        color="orange"
                                        register={register(
                                            `horariosAtencion.${index}.dia`
                                        )}
                                    >
                                        <option value="">
                                            Seleccioná un día
                                        </option>

                                        <option value="LUNES">
                                            Lunes
                                        </option>

                                        <option value="MARTES">
                                            Martes
                                        </option>

                                        <option value="MIERCOLES">
                                            Miércoles
                                        </option>

                                        <option value="JUEVES">
                                            Jueves
                                        </option>

                                        <option value="VIERNES">
                                            Viernes
                                        </option>

                                        <option value="SABADO">
                                            Sábado
                                        </option>
                                    </FormSelect>

                                    <FormInput
                                        id={`horariosAtencion.${index}.horaInicio`}
                                        label="Hora de inicio"
                                        required
                                        error={
                                            horarioErrors?.horaInicio
                                        }
                                        color="orange"
                                        register={register(
                                            `horariosAtencion.${index}.horaInicio`
                                        )}
                                        type="time"
                                    />

                                    <FormInput
                                        id={`horariosAtencion.${index}.horaFin`}
                                        label="Hora de finalización"
                                        required
                                        error={
                                            horarioErrors?.horaFin
                                        }
                                        color="orange"
                                        register={register(
                                            `horariosAtencion.${index}.horaFin`
                                        )}
                                        type="time"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ================================== */}
                {/* AGREGAR HORARIO */}
                {/* ================================== */}

                <button
                    type="button"
                    onClick={onAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 px-4 py-3 text-sm font-semibold text-orange-700 transition-all hover:border-orange-400 hover:bg-orange-50"
                >
                    <Plus size={18} />

                    Agregar otro horario
                </button>

                {/* ================================== */}
                {/* INFORMACIÓN */}
                {/* ================================== */}

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-xs leading-relaxed text-orange-800">
                        <strong>Ejemplo:</strong> un médico
                        puede atender los lunes de 08:00 a
                        12:00 y nuevamente de 16:00 a 20:00.
                        También podés agregar diferentes
                        horarios para cada día.
                    </p>
                </div>
            </div>
        </FormSection>
    );
}
