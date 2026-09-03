import {
    FileText,
    Stethoscope,
} from "lucide-react";

import type {
    FieldErrors,
    UseFormRegister,
    UseFormRegisterReturn,
} from "react-hook-form";

import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

import type { EspecialidadFormData } from "@/schemas/especialidad.schema";

// ============================================
// TIPOS Y CONSTANTES
// ============================================

type ColorTheme = "blue" | "purple";

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

interface FormTextareaProps
    extends Omit<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
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

interface FormSectionFieldsProps {
    register: UseFormRegister<EspecialidadFormData>;
    errors: FieldErrors<EspecialidadFormData>;
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
};

// ============================================
// COMPONENTE BASE: FORM SECTION
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
// TEXTAREA
// ============================================

export function FormTextarea({
    label,
    error,
    color = "purple",
    register,
    className = "",
    id,
    required,
    maxLength,
    ...props
}: FormTextareaProps) {
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

            <textarea
                id={id}
                {...register}
                {...props}
                maxLength={maxLength}
                className={`min-h-32 w-full resize-y rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? errorStyles
                        : styles.input
                }`}
            />

            <div className="flex items-center justify-between">
                {error ? (
                    <p className="text-xs font-medium text-red-600">
                        {error.message}
                    </p>
                ) : (
                    <span />
                )}

                {maxLength && (
                    <span className="text-xs text-slate-500">
                        Máximo {maxLength} caracteres
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================
// SECCIONES
// ============================================

export function InformacionEspecialidadSection({
    register,
    errors,
}: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={Stethoscope}
            title="Información de la especialidad"
            description="Datos principales de la especialidad médica."
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
                    placeholder="Ej. Cardiología"
                />

                <FormInput
                    id="codigo"
                    label="Código"
                    error={errors.codigo}
                    color="blue"
                    register={register("codigo")}
                    placeholder="Ej. CARD"
                    maxLength={5}
                    autoCapitalize="characters"
                    onInput={(event) => {
                        event.currentTarget.value =
                            event.currentTarget.value
                                .replace(/[^a-zA-Z]/g, "")
                                .toUpperCase();
                    }}
                />
            </div>

            <p className="mt-3 text-xs text-blue-600">
                El código debe contener entre 2 y 5 letras.
            </p>
        </FormSection>
    );
}

export function DescripcionEspecialidadSection({
    register,
    errors,
}: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={FileText}
            title="Descripción"
            description="Agregá información adicional sobre la especialidad."
            color="purple"
        >
            <FormTextarea
                id="descripcion"
                label="Descripción"
                error={errors.descripcion}
                color="purple"
                register={register("descripcion")}
                placeholder="Ej. Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón..."
                maxLength={500}
            />
        </FormSection>
    );
}