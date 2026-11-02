import {
    Building2,
    Stethoscope,
    Wrench,
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

import type {
    ConsultorioEspecialidad,
} from "@/types/consultorio";

import type {
    ConsultorioFormData,
} from "@/schemas/consultorio.schema";

// ============================================
// TIPOS
// ============================================

type ColorTheme = "blue" | "purple" | "green";

interface FormSectionProps {
    icon: typeof Building2;
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
    register: UseFormRegister<ConsultorioFormData>;
    errors: FieldErrors<ConsultorioFormData>;
}

interface EspecialidadesConsultorioSectionProps
    extends FormSectionFieldsProps {
    especialidades: ConsultorioEspecialidad[];
    especialidadesSeleccionadas: string[];
    toggleEspecialidad: (id: string) => void;
}

interface EquipamientoConsultorioSectionProps
    extends FormSectionFieldsProps {
    equipamientoSeleccionado:
        ConsultorioFormData["equipamiento"];
    toggleEquipamiento: (
        value: ConsultorioFormData["equipamiento"][number]
    ) => void;
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

const COLOR_STYLES: Record<
    ColorTheme,
    ColorStyles
> = {
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
// INFORMACIÓN DEL CONSULTORIO
// ============================================

export function InformacionConsultorioSection({
    register,
    errors,
}: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={Building2}
            title="Información del consultorio"
            description="Datos principales y ubicación del consultorio."
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
                    placeholder="Ej. Consultorio Cardiología"
                    className="md:col-span-2"
                />

                <FormInput
                    id="numero"
                    label="Número"
                    required
                    error={errors.numero}
                    color="blue"
                    register={register("numero")}
                    placeholder="Ej. C-101"
                />

                <FormInput
                    id="piso"
                    label="Piso"
                    required
                    error={errors.piso}
                    color="blue"
                    register={register("piso")}
                    placeholder="Ej. 1"
                />

                <FormSelect
                    id="ala"
                    label="Ala"
                    required
                    error={errors.ala}
                    color="blue"
                    register={register("ala")}
                >
                    <option value="CENTRAL">
                        Central
                    </option>

                    <option value="NORTE">
                        Norte
                    </option>

                    <option value="SUR">
                        Sur
                    </option>

                    <option value="ESTE">
                        Este
                    </option>

                    <option value="OESTE">
                        Oeste
                    </option>
                </FormSelect>

                <FormInput
                    id="capacidad"
                    label="Capacidad"
                    required
                    error={errors.capacidad}
                    color="blue"
                    register={register("capacidad", {
                        valueAsNumber: true,
                    })}
                    type="number"
                    min={1}
                    placeholder="Ej. 2"
                />
            </div>
        </FormSection>
    );
}

// ============================================
// ESPECIALIDADES
// ============================================

export function EspecialidadesConsultorioSection({
    register,
    errors,
    especialidades,
    especialidadesSeleccionadas,
    toggleEspecialidad,
}: EspecialidadesConsultorioSectionProps) {
    return (
        <FormSection
            icon={Stethoscope}
            title="Especialidades"
            description="Seleccioná las especialidades que pueden atender en este consultorio."
            color="purple"
        >
            <input
                type="hidden"
                {...register("especialidades")}
            />

            {especialidades.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-purple-200 bg-white/60 p-6 text-center">
                    <p className="text-sm font-medium text-purple-800">
                        No hay especialidades disponibles.
                    </p>

                    <p className="mt-1 text-xs text-purple-600">
                        Primero deberías registrar una especialidad.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {especialidades.map(
                        (especialidad) => {
                            const selected =
                                especialidadesSeleccionadas.includes(
                                    especialidad.id
                                );

                            return (
                                <label
                                    key={
                                        especialidad.id
                                    }
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-white p-4 transition-all duration-200 ${
                                        selected
                                            ? "border-purple-500 bg-purple-50 shadow-sm"
                                            : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selected
                                        }
                                        onChange={() =>
                                            toggleEspecialidad(
                                                especialidad.id
                                            )
                                        }
                                        className="mt-0.5 h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {
                                                especialidad.nombre
                                            }
                                        </p>

                                        {especialidad.codigo && (
                                            <p className="mt-1 text-xs text-purple-600">
                                                {
                                                    especialidad.codigo
                                                }
                                            </p>
                                        )}

                                        {especialidad.descripcion && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {
                                                    especialidad.descripcion
                                                }
                                            </p>
                                        )}
                                    </div>
                                </label>
                            );
                        }
                    )}
                </div>
            )}

            {errors.especialidades && (
                <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.especialidades.message}
                </p>
            )}
        </FormSection>
    );
}

// ============================================
// EQUIPAMIENTO
// ============================================

const equipamientos = [
    {
        value: "CAMILLA",
        label: "Camilla",
    },
    {
        value: "ELECTROCARDIOGRAFO",
        label: "Electrocardiógrafo",
    },
    {
        value: "NEBULIZADOR",
        label: "Nebulizador",
    },
    {
        value: "ECOGRAFO",
        label: "Ecógrafo",
    },
    {
        value: "OTOSCOPIO",
        label: "Otoscopio",
    },
    {
        value: "OPHTALMOSCOPIO",
        label: "Oftalmoscopio",
    },
    {
        value: "TENSIOMETRO",
        label: "Tensiómetro",
    },
    {
        value: "BALANZA",
        label: "Balanza",
    },
    {
        value: "ESTETOSCOPIO",
        label: "Estetoscopio",
    },
] as const;

export function EquipamientoConsultorioSection({
    register,
    errors,
    equipamientoSeleccionado,
    toggleEquipamiento,
}: EquipamientoConsultorioSectionProps) {
    return (
        <FormSection
            icon={Wrench}
            title="Equipamiento"
            description="Seleccioná el equipamiento disponible en el consultorio."
            color="green"
        >
            <input
                type="hidden"
                {...register("equipamiento")}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {equipamientos.map(
                    (equipamiento) => {
                        const selected =
                            equipamientoSeleccionado.includes(
                                equipamiento.value
                            );

                        return (
                            <label
                                key={
                                    equipamiento.value
                                }
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white p-4 transition-all duration-200 ${
                                    selected
                                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                        : "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        selected
                                    }
                                    onChange={() =>
                                        toggleEquipamiento(
                                            equipamiento.value
                                        )
                                    }
                                    className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                                />

                                <span className="text-sm font-medium text-slate-800">
                                    {
                                        equipamiento.label
                                    }
                                </span>
                            </label>
                        );
                    }
                )}
            </div>

            {errors.equipamiento && (
                <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.equipamiento.message}
                </p>
            )}
        </FormSection>
    );
}