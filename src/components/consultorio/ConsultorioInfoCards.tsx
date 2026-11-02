import type { ReactNode } from "react";

import {
    Bed,
    Building2,
    Layers3,
    Ruler,
    Stethoscope,
    Wrench,
} from "lucide-react";

import type {
    AlaConsultorio,
    Consultorio,
    EquipamientoConsultorio,
} from "@/types/consultorio";

// ============================================
// LABELS
// ============================================

const alaLabels: Record<AlaConsultorio, string> = {
    CENTRAL: "Central",
    NORTE: "Norte",
    SUR: "Sur",
    ESTE: "Este",
    OESTE: "Oeste",
};

const equipamientoLabels: Record<
    EquipamientoConsultorio,
    string
> = {
    CAMILLA: "Camilla",
    ELECTROCARDIOGRAFO: "Electrocardiógrafo",
    NEBULIZADOR: "Nebulizador",
    ECOGRAFO: "Ecógrafo",
    OTOSCOPIO: "Otoscopio",
    OPHTALMOSCOPIO: "Oftalmoscopio",
    TENSIOMETRO: "Tensiómetro",
    BALANZA: "Balanza",
    ESTETOSCOPIO: "Estetoscopio",
};

// ============================================
// TIPOS DE COLOR
// ============================================

type ColorTheme = "blue" | "purple" | "green";

interface ColorStyles {
    section: string;
    icon: string;
    title: string;
    description: string;
    card: string;
    cardIcon: string;
    value: string;
}

const COLOR_STYLES: Record<
    ColorTheme,
    ColorStyles
> = {
    blue: {
        section:
            "from-blue-50/80 to-indigo-50/80 border-blue-200/50",
        icon: "bg-blue-600 text-white",
        title: "text-blue-900",
        description: "text-blue-600",
        card: "border-blue-200 bg-white",
        cardIcon: "text-blue-500",
        value: "text-slate-800",
    },

    purple: {
        section:
            "from-purple-50/80 to-violet-50/80 border-purple-200/50",
        icon: "bg-purple-600 text-white",
        title: "text-purple-900",
        description: "text-purple-600",
        card: "border-purple-200 bg-white",
        cardIcon: "text-purple-500",
        value: "text-slate-800",
    },

    green: {
        section:
            "from-emerald-50/80 to-green-50/80 border-emerald-200/50",
        icon: "bg-emerald-600 text-white",
        title: "text-emerald-900",
        description: "text-emerald-600",
        card: "border-emerald-200 bg-white",
        cardIcon: "text-emerald-500",
        value: "text-slate-800",
    },
};

// ============================================
// INFO CARD
// ============================================

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    color?: ColorTheme;
}

function InfoCard({
    icon,
    label,
    value,
    color = "blue",
}: InfoCardProps) {
    const styles = COLOR_STYLES[color];

    return (
        <div
            className={`rounded-xl border-2 ${styles.card} p-4 transition-all duration-200 hover:shadow-sm`}
        >
            <div
                className={`flex items-center gap-2 ${styles.cardIcon}`}
            >
                {icon}

                <span className="text-xs font-semibold uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <p
                className={`mt-2 text-sm font-semibold ${styles.value}`}
            >
                {value}
            </p>
        </div>
    );
}

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    description: string;
    color?: ColorTheme;
}

function SectionHeader({
    icon,
    title,
    description,
    color = "blue",
}: SectionHeaderProps) {
    const styles = COLOR_STYLES[color];

    return (
        <div className="flex items-center gap-3">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon} shadow-sm`}
            >
                {icon}
            </div>

            <div>
                <h3
                    className={`text-base font-semibold ${styles.title}`}
                >
                    {title}
                </h3>

                <p
                    className={`text-sm ${styles.description}`}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

// ============================================
// PROPS
// ============================================

interface ConsultorioInfoCardsProps {
    consultorio: Consultorio;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ConsultorioInfoCards({
    consultorio,
}: ConsultorioInfoCardsProps) {
    return (
        <div className="space-y-6">

            {/* ==========================================
                INFORMACIÓN GENERAL
            ========================================== */}

            <section
                className="rounded-2xl border bg-linear-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/50 p-6"
            >
                <div className="mb-5">
                    <SectionHeader
                        icon={
                            <Building2 className="h-5 w-5" />
                        }
                        title="Información general"
                        description="Datos principales del consultorio"
                        color="blue"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <InfoCard
                        icon={
                            <Building2 className="h-4 w-4" />
                        }
                        label="Nombre"
                        value={consultorio.nombre}
                        color="blue"
                    />

                    <InfoCard
                        icon={
                            <Ruler className="h-4 w-4" />
                        }
                        label="Número"
                        value={consultorio.numero}
                        color="blue"
                    />

                    <InfoCard
                        icon={
                            <Layers3 className="h-4 w-4" />
                        }
                        label="Piso"
                        value={consultorio.piso}
                        color="blue"
                    />

                    <InfoCard
                        icon={
                            <Building2 className="h-4 w-4" />
                        }
                        label="Ala"
                        value={
                            alaLabels[
                                consultorio.ala
                            ]
                        }
                        color="blue"
                    />

                    <InfoCard
                        icon={
                            <Bed className="h-4 w-4" />
                        }
                        label="Capacidad"
                        value={`${consultorio.capacidad} ${
                            consultorio.capacidad === 1
                                ? "persona"
                                : "personas"
                        }`}
                        color="blue"
                    />
                </div>
            </section>

            {/* ==========================================
                ESPECIALIDADES
            ========================================== */}

            <section
                className="rounded-2xl border bg-linear-to-br from-purple-50/80 to-violet-50/80 border-purple-200/50 p-6"
            >
                <div className="mb-5">
                    <SectionHeader
                        icon={
                            <Stethoscope className="h-5 w-5" />
                        }
                        title="Especialidades"
                        description="Especialidades médicas que utilizan el consultorio"
                        color="purple"
                    />
                </div>

                <div className="rounded-xl border-2 border-purple-200 bg-white p-4">
                    {consultorio.especialidades.length ===
                    0 ? (
                        <div className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 p-5 text-center">
                            <p className="text-sm font-medium text-purple-800">
                                No hay especialidades asignadas.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {consultorio.especialidades.map(
                                (especialidad) => (
                                    <div
                                        key={
                                            especialidad.id
                                        }
                                        className="rounded-xl border-2 border-purple-200 bg-purple-50/40 p-4 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                                <Stethoscope className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {
                                                        especialidad.nombre
                                                    }
                                                </p>

                                                {especialidad.codigo && (
                                                    <span className="mt-1 inline-block rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                                        {
                                                            especialidad.codigo
                                                        }
                                                    </span>
                                                )}

                                                {especialidad.descripcion && (
                                                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                                        {
                                                            especialidad.descripcion
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ==========================================
                EQUIPAMIENTO
            ========================================== */}

            <section
                className="rounded-2xl border bg-linear-to-br from-emerald-50/80 to-green-50/80 border-emerald-200/50 p-6"
            >
                <div className="mb-5">
                    <SectionHeader
                        icon={
                            <Wrench className="h-5 w-5" />
                        }
                        title="Equipamiento"
                        description="Equipamiento disponible en el consultorio"
                        color="green"
                    />
                </div>

                <div className="rounded-xl border-2 border-emerald-200 bg-white p-4">
                    {consultorio.equipamiento.length ===
                    0 ? (
                        <div className="rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-center">
                            <p className="text-sm font-medium text-emerald-800">
                                No hay equipamiento registrado.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {consultorio.equipamiento.map(
                                (equipamiento) => (
                                    <div
                                        key={
                                            equipamiento
                                        }
                                        className="flex items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 px-4 py-3 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <Wrench className="h-4 w-4" />
                                        </div>

                                        <span className="text-sm font-semibold text-slate-700">
                                            {
                                                equipamientoLabels[
                                                    equipamiento
                                                ]
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}