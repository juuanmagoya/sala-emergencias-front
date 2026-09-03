import { User, MapPin, Phone, Hospital } from "lucide-react";
import type { UseFormRegister, FieldErrors, FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { PacienteFormData } from "@/schemas/paciente.schema";
import type { LucideIcon } from "lucide-react";
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";

// ============================================
// TIPOS Y CONSTANTES
// ============================================

type ColorTheme = "blue" | "emerald" | "purple" | "amber";

interface FormSectionProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color: ColorTheme;
    children: ReactNode;
}

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    label: string;
    error?: FieldError;
    color?: ColorTheme;
    register: UseFormRegisterReturn;
    className?: string;
}

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
    label: string;
    color?: ColorTheme;
    options: ReadonlyArray<{ value: string; label: string }>;
    register: UseFormRegisterReturn;
    className?: string;
}

interface FormSectionFieldsProps {
    register: UseFormRegister<PacienteFormData>;
    errors: FieldErrors<PacienteFormData>;
}

// ============================================
// OPCIONES PARA SELECTS
// ============================================

const TIPOS_TELEFONO = [
    { value: "CELULAR", label: "Celular" },
    { value: "FIJO", label: "Fijo" },
    { value: "TRABAJO", label: "Trabajo" },
] as const;

const OBRAS_SOCIALES = [
    { value: "NINGUNA", label: "Ninguna" },
    { value: "PAMI", label: "PAMI" },
    { value: "OSPEL", label: "OSPEL" },
    { value: "OSDE", label: "OSDE" },
    { value: "SANCOR", label: "Sancor" },
    { value: "OSECAC", label: "OSECAC" },
    { value: "SWISS MEDICAL", label: "Swiss Medical" },
    { value: "GALENO", label: "Galeno" },
    { value: "MEDICUS", label: "Medicus" },
    { value: "OMINT", label: "Omint" },
    { value: "FEMEBA", label: "FEMEBA" },
    { value: "OTRAS", label: "Otras" },
] as const;

// ============================================
// ESTILOS POR COLOR
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
        section: "from-blue-50/80 to-indigo-50/80 border-blue-200/50",
        icon: "bg-blue-600",
        title: "text-blue-900",
        description: "text-blue-600",
        label: "text-blue-800",
        input: "border-blue-300 focus:border-blue-500 focus:ring-blue-200 hover:border-blue-400",
    },
    emerald: {
        section: "from-emerald-50/80 to-teal-50/80 border-emerald-200/50",
        icon: "bg-emerald-600",
        title: "text-emerald-900",
        description: "text-emerald-600",
        label: "text-emerald-800",
        input: "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-400",
    },
    purple: {
        section: "from-purple-50/80 to-violet-50/80 border-purple-200/50",
        icon: "bg-purple-600",
        title: "text-purple-900",
        description: "text-purple-600",
        label: "text-purple-800",
        input: "border-purple-300 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-400",
    },
    amber: {
        section: "from-amber-50/80 to-orange-50/80 border-amber-200/50",
        icon: "bg-amber-600",
        title: "text-amber-900",
        description: "text-amber-600",
        label: "text-amber-800",
        input: "border-amber-300 focus:border-amber-500 focus:ring-amber-200 hover:border-amber-400",
    },
};

// ============================================
// COMPONENTES BASE
// ============================================

export function FormSection({ icon: Icon, title, description, color, children }: FormSectionProps) {
    const styles = COLOR_STYLES[color];
    
    return (
        <section className={`bg-linear-to-br ${styles.section} rounded-2xl p-6 border`}>
            <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon} text-white shadow-md`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h2 className={`text-base font-semibold ${styles.title}`}>{title}</h2>
                    <p className={`text-sm ${styles.description}`}>{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

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
    const errorStyles = "border-red-400 focus:border-red-500 focus:ring-red-200";
    
    return (
        <div className={`space-y-2 ${className}`}>
            <label htmlFor={id} className={`text-sm ${required ? "font-semibold" : "font-medium"} ${styles.label}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
                    error ? errorStyles : styles.input
                }`}
            />
            {error && <p className="text-xs font-medium text-red-600">{error.message}</p>}
        </div>
    );
}

export function FormSelect({ 
    label, 
    color = "blue", 
    options, 
    register,
    id,
    className = "",
    ...props 
}: FormSelectProps) {
    const styles = COLOR_STYLES[color];
    
    return (
        <div className={`space-y-2 ${className}`}>
            <label htmlFor={id} className={`text-sm font-medium ${styles.label}`}>
                {label}
            </label>
            <select
                id={id}
                {...register}
                {...props}
                className={`w-full rounded-xl border-2 ${styles.input} bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-1`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

// ============================================
// SECCIONES DEL FORMULARIO
// ============================================

export function InformacionPersonalSection({ register, errors }: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={User}
            title="Información personal"
            description="Datos básicos del paciente."
            color="blue"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                    id="nombre"
                    label="Nombre completo"
                    required
                    error={errors.nombre}
                    color="blue"
                    register={register("nombre")}
                    placeholder="Ej. Juan Pérez"
                    className="md:col-span-2"
                />
                
                <FormInput
                    id="dni"
                    label="DNI"
                    required
                    error={errors.dni}
                    color="blue"
                    register={register("dni")}
                    placeholder="Ej. 40123456"
                    inputMode="numeric"
                />
                
                <FormInput
                    id="email"
                    label="Correo electrónico"
                    required
                    error={errors.email}
                    color="blue"
                    register={register("email")}
                    placeholder="paciente@email.com"
                    type="email"
                />
            </div>
        </FormSection>
    );
}

export function DireccionSection({ register, errors }: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={MapPin}
            title="Dirección"
            description="Información del domicilio del paciente."
            color="emerald"
        >
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <FormInput
                    id="calle"
                    label="Calle"
                    required
                    error={errors.direccion?.calle}
                    color="emerald"
                    register={register("direccion.calle")}
                    placeholder="Ej. San Martín"
                    className="lg:col-span-2"
                />
                
                <FormInput
                    id="numero"
                    label="Número"
                    required
                    error={errors.direccion?.numero}
                    color="emerald"
                    register={register("direccion.numero")}
                    placeholder="1234"
                />
                
                <FormInput
                    id="piso"
                    label="Piso"
                    color="emerald"
                    register={register("direccion.piso")}
                    placeholder="Opcional"
                />
                
                <FormInput
                    id="departamento"
                    label="Departamento"
                    color="emerald"
                    register={register("direccion.departamento")}
                    placeholder="Opcional"
                />
                
                <FormInput
                    id="barrio"
                    label="Barrio"
                    color="emerald"
                    register={register("direccion.barrio")}
                    placeholder="Opcional"
                />
            </div>
        </FormSection>
    );
}

export function ContactoSection({ register, errors }: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={Phone}
            title="Información de contacto"
            description="Número telefónico del paciente."
            color="purple"
        >
            <div className="grid gap-5 md:grid-cols-3">
                <FormSelect
                    id="tipoTelefono"
                    label="Tipo de teléfono"
                    color="purple"
                    options={TIPOS_TELEFONO}
                    register={register("telefono.tipo")}
                />
                
                <FormInput
                    id="codigoArea"
                    label="Código de área"
                    required
                    error={errors.telefono?.codigoArea}
                    color="purple"
                    register={register("telefono.codigoArea")}
                    placeholder="3777"
                    inputMode="numeric"
                />
                
                <FormInput
                    id="numeroTelefono"
                    label="Número"
                    required
                    error={errors.telefono?.numero}
                    color="purple"
                    register={register("telefono.numero")}
                    placeholder="123456"
                    inputMode="numeric"
                />
            </div>
        </FormSection>
    );
}

export function ObraSocialSection({ register }: FormSectionFieldsProps) {
    return (
        <FormSection
            icon={Hospital}
            title="Cobertura médica"
            description="Información de obra social o cobertura."
            color="amber"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormSelect
                    id="obraSocial"
                    label="Obra social"
                    color="amber"
                    options={OBRAS_SOCIALES}
                    register={register("obraSocial.nombre")}
                />
                
                <FormInput
                    id="numeroAfiliado"
                    label="Número de afiliado"
                    color="amber"
                    register={register("obraSocial.numeroAfiliado")}
                    placeholder="Opcional"
                />
            </div>
        </FormSection>
    );
}