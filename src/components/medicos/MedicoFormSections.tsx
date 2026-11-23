
import {
    Stethoscope,
    User,
    Phone,
    Clock,
} from "lucide-react";

import type {
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

import HorarioSemanal, {
    type HorarioAtencion,
} from "@/components/medicos/HorarioSemanal";

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

interface HorarioMedicoSectionProps
    extends FormSectionFieldsProps {
    horarios: HorarioAtencion[];
    onHorariosChange: (
        horarios: HorarioAtencion[]
    ) => void;
    resetKey: number;
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
                    required ? "font-semibold" : "font-medium"
                } ${styles.label}`}
            >
                {label}

                {required && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <input
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
                    error ? errorStyles : styles.input
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
                    required ? "font-semibold" : "font-medium"
                } ${styles.label}`}
            >
                {label}

                {required && (
                    <span className="text-red-500"> *</span>
                )}
            </label>

            <select
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1 ${
                    error ? errorStyles : styles.input
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
    const errorEspecialidades = (
        errors.especialidades as unknown as
            | { message?: string }
            | undefined
    )?.message;

    return (
        <FormSection
            icon={Stethoscope}
            title="Especialidades"
            description="Seleccioná al menos una especialidad médica."
            color="purple"
        >
            {especialidades.length === 0 ? (
                <p className="text-sm text-slate-500">
                    No hay especialidades activas disponibles.
                </p>
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {especialidades.map((especialidad) => (
                        <label
                            key={especialidad.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-purple-300 hover:bg-purple-50/40"
                        >
                            <input
                                type="checkbox"
                                value={especialidad.id}
                                {...register("especialidades")}
                                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />

                            <span>{especialidad.nombre}</span>
                        </label>
                    ))}
                </div>
            )}

            {errorEspecialidades && (
                <p className="text-xs font-medium text-red-600">
                    {errorEspecialidades}
                </p>
            )}
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
                    <option value="CELULAR">Celular</option>
                    <option value="FIJO">Fijo</option>
                    <option value="TRABAJO">Trabajo</option>
                </FormSelect>

                <FormInput
                    id="telefono.codigoArea"
                    label="Código de área"
                    required
                    error={errors.telefono?.codigoArea}
                    color="green"
                    register={register("telefono.codigoArea")}
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
                    register={register("telefono.numero")}
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
    horarios,
    onHorariosChange,
    resetKey,
}: HorarioMedicoSectionProps) {
    return (
        <FormSection
            icon={Clock}
            title="Horarios de atención"
            description="Configurá los días y períodos en los que el médico atiende."
            color="orange"
        >
            <div className="space-y-6">
                {/* Duración del turno */}

                <div className="rounded-xl border border-orange-200 bg-white/70 p-5">
                    <div className="max-w-xs">
                        <FormInput
                            id="duracionTurno"
                            label="Duración del turno"
                            required
                            error={errors.duracionTurno}
                            color="orange"
                            register={register("duracionTurno", {
                                valueAsNumber: true,
                            })}
                            type="number"
                            min={5}
                            max={240}
                            step={5}
                            placeholder="Ej. 30"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Indicá la duración en minutos. Por ejemplo:
                            30, 45 o 60.
                        </p>
                    </div>
                </div>

                {/* Configuración semanal */}

                <HorarioSemanal
                    value={horarios}
                    onChange={onHorariosChange}
                    resetKey={resetKey}
                />

                {/* Error de validación */}

                {errors.horariosAtencion?.message && (
                    <p className="text-sm font-medium text-red-600">
                        {errors.horariosAtencion.message}
                    </p>
                )}
            </div>
        </FormSection>
    );
}
