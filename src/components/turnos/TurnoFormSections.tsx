
import {
    CalendarDays,
    Clock,
    FileText,
    Stethoscope,
    UserRound,
} from "lucide-react";

import type {
    FieldErrors,
    UseFormRegister,
    UseFormRegisterReturn,
} from "react-hook-form";

import type {
    ChangeEvent,
    ElementType,
    ReactNode,
} from "react";

import type { Paciente } from "@/types/paciente";
import type { Medico } from "@/types/medico";
import type { Especialidad } from "@/types/especialidad";
import type { TurnoFormData } from "@/schemas/turno.schema";
import type { HorarioDisponible } from "@/types/turno";

// ============================================
// TIPOS Y PROPS
// ============================================

interface TurnoFormSectionsProps {
    register: UseFormRegister<TurnoFormData>;
    errors: FieldErrors<TurnoFormData>;

    pacientes: Paciente[];
    especialidades: Especialidad[];
    medicos: Medico[];

    fechaSeleccionada: string;
    onCambiarEspecialidad: () => void;
    onCambiarMedico: () => void;
    onCambiarFecha: (fecha: string) => void;

    horariosDisponibles: HorarioDisponible[];
    cargandoDisponibilidad: boolean;
    errorDisponibilidad: boolean;

    horarioSeleccionado: string;
    onSeleccionarHorario: (horario: HorarioDisponible) => void;
}

type ColorTheme = "blue" | "emerald" | "purple" | "amber";

interface FormSectionProps {
    icon: ElementType;
    title: string;
    description: string;
    color: ColorTheme;
    children: ReactNode;
}

interface FormSelectProps {
    id: string;
    label: string;
    color: ColorTheme;
    options: ReadonlyArray<{ value: string; label: string }>;
    register: UseFormRegisterReturn;
    error?: string;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

interface FormTextareaProps {
    id: string;
    label: string;
    register: UseFormRegisterReturn;
    error?: string;
}

// ============================================
// ESTILOS
// ============================================

const COLOR_STYLES: Record<
    ColorTheme,
    {
        section: string;
        icon: string;
        title: string;
        description: string;
        label: string;
        input: string;
    }
> = {
    blue: {
        section: "from-blue-50/80 to-indigo-50/80 border-blue-200/50",
        icon: "bg-blue-600",
        title: "text-blue-900",
        description: "text-blue-600",
        label: "text-blue-800",
        input: "border-blue-300 focus:border-blue-500 focus:ring-blue-200",
    },
    emerald: {
        section: "from-emerald-50/80 to-teal-50/80 border-emerald-200/50",
        icon: "bg-emerald-600",
        title: "text-emerald-900",
        description: "text-emerald-600",
        label: "text-emerald-800",
        input: "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200",
    },
    purple: {
        section: "from-purple-50/80 to-violet-50/80 border-purple-200/50",
        icon: "bg-purple-600",
        title: "text-purple-900",
        description: "text-purple-600",
        label: "text-purple-800",
        input: "border-purple-300 focus:border-purple-500 focus:ring-purple-200",
    },
    amber: {
        section: "from-amber-50/80 to-orange-50/80 border-amber-200/50",
        icon: "bg-amber-600",
        title: "text-amber-900",
        description: "text-amber-600",
        label: "text-amber-800",
        input: "border-amber-300 focus:border-amber-500 focus:ring-amber-200",
    },
};

// ============================================
// COMPONENTES BASE
// ============================================

function FormSection({
    icon: Icon,
    title,
    description,
    color,
    children,
}: FormSectionProps) {
    const styles = COLOR_STYLES[color];

    return (
        <section className={`bg-linear-to-br ${styles.section} rounded-2xl border p-6`}>
            <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon} text-white shadow-md`}>
                    <Icon size={20} />
                </div>

                <div>
                    <h2 className={`text-base font-semibold ${styles.title}`}>
                        {title}
                    </h2>

                    <p className={`text-sm ${styles.description}`}>
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

function FormSelect({
    id,
    label,
    color,
    options,
    register,
    error,
    onChange,
}: FormSelectProps) {
    const styles = COLOR_STYLES[color];

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className={`text-sm font-medium ${styles.label}`}
            >
                {label}
                <span className="ml-1 text-red-500">*</span>
            </label>

            <select
                id={id}
                {...register}
                onChange={onChange ?? register.onChange}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : styles.input
                }`}
            >
                <option value="">Seleccionar...</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function FormTextarea({
    id,
    label,
    register,
    error,
}: FormTextareaProps) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm font-medium text-amber-800"
            >
                {label}
            </label>

            <textarea
                id={id}
                {...register}
                rows={3}
                maxLength={500}
                placeholder="Información adicional sobre el turno..."
                className={`w-full resize-none rounded-xl border-2 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-amber-300 hover:border-amber-400 focus:border-amber-500 focus:ring-amber-200"
                }`}
            />

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

// ============================================
// SECCIÓN: PACIENTE Y ESPECIALIDAD
// ============================================

function PacienteEspecialidadSection({
    register,
    errors,
    pacientes,
    especialidades,
    onCambiarEspecialidad,
}: Pick<
    TurnoFormSectionsProps,
    | "register"
    | "errors"
    | "pacientes"
    | "especialidades"
    | "onCambiarEspecialidad"
>) {
    const especialidadRegister = register("especialidad");

    return (
        <FormSection
            icon={UserRound}
            title="Información del paciente"
            description="Seleccioná el paciente y la especialidad médica."
            color="blue"
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormSelect
                    id="paciente"
                    label="Paciente"
                    color="blue"
                    register={register("paciente")}
                    error={errors.paciente?.message}
                    options={pacientes.map((paciente) => ({
                        value: paciente.id,
                        label: `${paciente.nombre} - DNI ${paciente.dni}`,
                    }))}
                />

                <FormSelect
                    id="especialidad"
                    label="Especialidad"
                    color="blue"
                    register={especialidadRegister}
                    error={errors.especialidad?.message}
                    onChange={(event) => {
                        especialidadRegister.onChange(event);
                        onCambiarEspecialidad();
                    }}
                    options={especialidades.map((especialidad) => ({
                        value: especialidad.id,
                        label: especialidad.nombre,
                    }))}
                />
            </div>
        </FormSection>
    );
}

// ============================================
// SECCIÓN: MÉDICO
// ============================================

function MedicoSection({
    register,
    errors,
    medicos,
    onCambiarMedico,
}: Pick<
    TurnoFormSectionsProps,
    "register" | "errors" | "medicos" | "onCambiarMedico"
>) {
    const medicoRegister = register("medico");

    return (
        <FormSection
            icon={Stethoscope}
            title="Profesional médico"
            description="Seleccioná el médico que atenderá al paciente."
            color="emerald"
        >
            <FormSelect
                id="medico"
                label="Médico"
                color="emerald"
                register={medicoRegister}
                error={errors.medico?.message}
                onChange={(event) => {
                    medicoRegister.onChange(event);
                    onCambiarMedico();
                }}
                options={medicos.map((medico) => ({
                    value: medico.id,
                    label: `Dr. ${medico.nombre} ${medico.apellido}`,
                }))}
            />

            {medicos.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">
                    No hay médicos activos disponibles para esta especialidad.
                </p>
            )}
        </FormSection>
    );
}

// ============================================
// SECCIÓN: FECHA Y HORARIOS
// ============================================

function FechaHorarioSection({
    errors,
    fechaSeleccionada,
    onCambiarFecha,
    horariosDisponibles,
    cargandoDisponibilidad,
    errorDisponibilidad,
    horarioSeleccionado,
    onSeleccionarHorario,
}: Pick<
    TurnoFormSectionsProps,
    | "errors"
    | "fechaSeleccionada"
    | "onCambiarFecha"
    | "horariosDisponibles"
    | "cargandoDisponibilidad"
    | "errorDisponibilidad"
    | "horarioSeleccionado"
    | "onSeleccionarHorario"
>) {
    return (
        <FormSection
            icon={CalendarDays}
            title="Fecha y horario"
            description="Seleccioná el día y uno de los horarios disponibles."
            color="purple"
        >
            <div className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="fechaSeleccionada"
                        className="text-sm font-medium text-purple-800"
                    >
                        Fecha del turno
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                        id="fechaSeleccionada"
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(event) => onCambiarFecha(event.target.value)}
                        disabled={!horarioSeleccionado && false}
                        className="w-full rounded-xl border-2 border-purple-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:ring-offset-1"
                    />
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Clock size={17} className="text-purple-600" />

                        <h3 className="text-sm font-semibold text-purple-900">
                            Horarios disponibles
                        </h3>
                    </div>

                    {!fechaSeleccionada ? (
                        <p className="rounded-xl border border-dashed border-purple-200 bg-white/70 p-4 text-sm text-slate-500">
                            Seleccioná una fecha para consultar los horarios disponibles.
                        </p>
                    ) : cargandoDisponibilidad ? (
                        <p className="text-sm text-slate-500">
                            Consultando disponibilidad...
                        </p>
                    ) : errorDisponibilidad ? (
                        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            No se pudo consultar la disponibilidad. Intentá nuevamente.
                        </p>
                    ) : horariosDisponibles.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {horariosDisponibles.map((horario) => (
                                <button
                                    key={horario.inicio}
                                    type="button"
                                    onClick={() => onSeleccionarHorario(horario)}
                                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                                        horarioSeleccionado === horario.inicio
                                            ? "border-purple-600 bg-purple-600 text-white shadow-md"
                                            : "border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:bg-purple-50"
                                    }`}
                                >
                                    {horario.horaLocal}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-purple-200 bg-white/70 p-4 text-sm text-slate-500">
                            No hay horarios disponibles para la fecha seleccionada.
                        </p>
                    )}

                    {errors.fechaTurno && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                            {errors.fechaTurno.message}
                        </p>
                    )}
                </div>
            </div>
        </FormSection>
    );
}

// ============================================
// SECCIÓN: OBSERVACIONES
// ============================================

function ObservacionesSection({
    register,
    errors,
}: Pick<TurnoFormSectionsProps, "register" | "errors">) {
    return (
        <FormSection
            icon={FileText}
            title="Observaciones"
            description="Información adicional para el turno (opcional)."
            color="amber"
        >
            <FormTextarea
                id="observaciones"
                label="Observaciones"
                register={register("observaciones")}
                error={errors.observaciones?.message}
            />
        </FormSection>
    );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function TurnoFormSections(props: TurnoFormSectionsProps) {
    return (
        <div className="space-y-6">
            <PacienteEspecialidadSection {...props} />
            <MedicoSection {...props} />
            <FechaHorarioSection {...props} />
            <ObservacionesSection {...props} />
        </div>
    );
}
