
import { useState } from "react";
import type { ReactNode } from "react";
import {
    Eraser,
    CalendarDays,
    Sun,
    Sunset,
    Check,
} from "lucide-react";

type DiaSemana =
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO";

export interface HorarioAtencion {
    dia: DiaSemana;
    horaInicio: string;
    horaFin: string;
}

interface Periodo {
    activo: boolean;
    horaInicio: string;
    horaFin: string;
}

interface DiaConfig {
    activo: boolean;
    manana: Periodo;
    tarde: Periodo;
}

type SemanaConfig = Record<DiaSemana, DiaConfig>;
type HorariosExtras = Record<DiaSemana, HorarioAtencion[]>;

interface HorarioSemanalProps {
    value: HorarioAtencion[];
    onChange: (horarios: HorarioAtencion[]) => void;
    resetKey?: string | number;
}

const DIAS: { id: DiaSemana; nombre: string }[] = [
    { id: "LUNES", nombre: "Lunes" },
    { id: "MARTES", nombre: "Martes" },
    { id: "MIERCOLES", nombre: "Miércoles" },
    { id: "JUEVES", nombre: "Jueves" },
    { id: "VIERNES", nombre: "Viernes" },
    { id: "SABADO", nombre: "Sábado" },
];

const HORARIO_MANANA = {
    horaInicio: "08:00",
    horaFin: "12:00",
};

const HORARIO_TARDE = {
    horaInicio: "16:00",
    horaFin: "20:00",
};

function crearDiaConfig(): DiaConfig {
    return {
        activo: false,
        manana: {
            activo: false,
            ...HORARIO_MANANA,
        },
        tarde: {
            activo: false,
            ...HORARIO_TARDE,
        },
    };
}

function crearSemanaVacia(): SemanaConfig {
    const semana = {} as SemanaConfig;

    for (const dia of DIAS) {
        semana[dia.id] = crearDiaConfig();
    }

    return semana;
}

function crearExtrasVacios(): HorariosExtras {
    return {
        LUNES: [],
        MARTES: [],
        MIERCOLES: [],
        JUEVES: [],
        VIERNES: [],
        SABADO: [],
    };
}

/**
 * Convierte los horarios existentes del backend a la configuración visual.
 *
 * Antes de las 13:00: mañana.
 * Desde las 13:00: tarde.
 *
 * Los registros adicionales se preservan en extras.
 */
function convertirAConfiguracion(
    horarios: HorarioAtencion[]
): { semana: SemanaConfig; extras: HorariosExtras } {
    const semana = crearSemanaVacia();
    const extras = crearExtrasVacios();
    const horariosPorDia = crearExtrasVacios();

    for (const horario of horarios) {
        horariosPorDia[horario.dia].push(horario);
    }

    for (const dia of DIAS) {
        const registros = [...horariosPorDia[dia.id]].sort(
            (a, b) => a.horaInicio.localeCompare(b.horaInicio)
        );

        const config = semana[dia.id];

        if (registros.length === 0) continue;

        config.activo = true;

        for (const registro of registros) {
            const esManana = registro.horaInicio < "13:00";
            const periodo = esManana ? config.manana : config.tarde;

            if (!periodo.activo) {
                periodo.activo = true;
                periodo.horaInicio = registro.horaInicio;
                periodo.horaFin = registro.horaFin;
            } else {
                extras[dia.id].push(registro);
            }
        }
    }

    return { semana, extras };
}

function convertirAHorarios(
    semana: SemanaConfig,
    extras: HorariosExtras
): HorarioAtencion[] {
    const horarios: HorarioAtencion[] = [];

    for (const dia of DIAS) {
        const config = semana[dia.id];

        if (!config.activo) continue;

        if (config.manana.activo) {
            horarios.push({
                dia: dia.id,
                horaInicio: config.manana.horaInicio,
                horaFin: config.manana.horaFin,
            });
        }

        if (config.tarde.activo) {
            horarios.push({
                dia: dia.id,
                horaInicio: config.tarde.horaInicio,
                horaFin: config.tarde.horaFin,
            });
        }

        horarios.push(...extras[dia.id]);
    }

    return horarios;
}

function Switch({
    checked,
    onChange,
    disabled = false,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                transition-colors duration-200
                ${checked ? "bg-orange-500" : "bg-gray-300"}
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
            `}
        >
            <span
                className={`
                    absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white
                    shadow-sm transition-transform duration-200
                    ${checked ? "translate-x-5" : "translate-x-0"}
                `}
            />
        </button>
    );
}

function PeriodoCard({
    titulo,
    icon,
    periodo,
    onToggle,
    onTimeChange,
    disabled,
}: {
    titulo: string;
    icon: ReactNode;
    periodo: Periodo;
    onToggle: (activo: boolean) => void;
    onTimeChange: (
        campo: "horaInicio" | "horaFin",
        valor: string
    ) => void;
    disabled: boolean;
}) {
    return (
        <div
            className={`
                rounded-xl border p-3 transition-all duration-200
                ${
                    periodo.activo && !disabled
                        ? "border-orange-200 bg-white shadow-sm"
                        : "border-gray-200 bg-gray-50/80"
                }
            `}
        >
            <div className="flex items-center justify-between gap-2">
                <div
                    className={`flex items-center gap-2 ${
                        periodo.activo && !disabled
                            ? "text-orange-700"
                            : "text-gray-500"
                    }`}
                >
                    <span>{icon}</span>
                    <span className="text-sm font-semibold">{titulo}</span>
                </div>

                <Switch
                    checked={periodo.activo}
                    onChange={onToggle}
                    disabled={disabled}
                />
            </div>

            {periodo.activo && !disabled && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                        <label className="mb-1 block text-xs text-gray-500">
                            Desde
                        </label>
                        <input
                            type="time"
                            value={periodo.horaInicio}
                            onChange={(e) =>
                                onTimeChange("horaInicio", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-gray-500">
                            Hasta
                        </label>
                        <input
                            type="time"
                            value={periodo.horaFin}
                            onChange={(e) =>
                                onTimeChange("horaFin", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function HorarioSemanalInterno({
    value,
    onChange,
}: Omit<HorarioSemanalProps, "resetKey">) {
    const [semana, setSemana] = useState<SemanaConfig>(
        () => convertirAConfiguracion(value ?? []).semana
    );

    const [extras, setExtras] = useState<HorariosExtras>(
        () => convertirAConfiguracion(value ?? []).extras
    );

    const guardarConfiguracion = (
        nuevaSemana: SemanaConfig,
        nuevosExtras: HorariosExtras = extras
    ) => {
        setSemana(nuevaSemana);
        setExtras(nuevosExtras);

        onChange(convertirAHorarios(nuevaSemana, nuevosExtras));
    };

    const activarDia = (dia: DiaSemana, activo: boolean) => {
        const nuevaSemana = {
            ...semana,
            [dia]: {
                ...semana[dia],
                activo,
                manana: {
                    ...semana[dia].manana,
                    activo,
                },
                tarde: {
                    ...semana[dia].tarde,
                    activo: activo ? semana[dia].tarde.activo : false,
                },
            },
        };

        const nuevosExtras = activo
            ? extras
            : {
                  ...extras,
                  [dia]: [],
              };

        guardarConfiguracion(nuevaSemana, nuevosExtras);
    };

    const activarPeriodo = (
        dia: DiaSemana,
        tipo: "manana" | "tarde",
        activo: boolean
    ) => {
        const nuevaSemana = {
            ...semana,
            [dia]: {
                ...semana[dia],
                [tipo]: {
                    ...semana[dia][tipo],
                    activo,
                },
            },
        };

        guardarConfiguracion(nuevaSemana);
    };

    const actualizarHora = (
        dia: DiaSemana,
        tipo: "manana" | "tarde",
        campo: "horaInicio" | "horaFin",
        valor: string
    ) => {
        const nuevaSemana = {
            ...semana,
            [dia]: {
                ...semana[dia],
                [tipo]: {
                    ...semana[dia][tipo],
                    [campo]: valor,
                },
            },
        };

        guardarConfiguracion(nuevaSemana);
    };

    const seleccionarTodos = () => {
        const nuevaSemana = crearSemanaVacia();

        for (const dia of DIAS) {
            nuevaSemana[dia.id] = {
                activo: true,
                manana: {
                    activo: true,
                    ...HORARIO_MANANA,
                },
                tarde: {
                    activo: false,
                    ...HORARIO_TARDE,
                },
            };
        }

        guardarConfiguracion(nuevaSemana, crearExtrasVacios());
    };

    const limpiarHorarios = () => {
        const nuevaSemana = crearSemanaVacia();
        const nuevosExtras = crearExtrasVacios();

        setSemana(nuevaSemana);
        setExtras(nuevosExtras);

        onChange([]);
    };

    const totalDiasActivos = DIAS.filter(
        (dia) => semana[dia.id].activo
    ).length;

    const totalPeriodos = DIAS.reduce((total, dia) => {
        const config = semana[dia.id];

        if (!config.activo) return total;

        return (
            total +
            Number(config.manana.activo) +
            Number(config.tarde.activo)
        );
    }, 0);

    return (
        <div className="space-y-5">
            {/* Encabezado */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-orange-800">
                        <CalendarDays size={18} />
                        <h3 className="font-semibold">
                            Disponibilidad semanal
                        </h3>
                    </div>
                    <p className="mt-1 text-sm text-orange-600">
                        Configurá los días y horarios en los que atiende el médico.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={seleccionarTodos}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-orange-700 transition hover:bg-orange-50"
                    >
                        <Check size={14} />
                        Seleccionar todos
                    </button>

                    <button
                        type="button"
                        onClick={limpiarHorarios}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        <Eraser size={14} />
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Resumen */}
            <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                    {totalDiasActivos}{" "}
                    {totalDiasActivos === 1 ? "día" : "días"} habilitados
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    {totalPeriodos}{" "}
                    {totalPeriodos === 1 ? "período" : "períodos"} configurados
                </span>
            </div>

            {/* Días */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {DIAS.map(({ id, nombre }) => {
                    const config = semana[id];

                    return (
                        <div
                            key={id}
                            className={`
                                overflow-hidden rounded-xl border transition-all duration-200
                                ${
                                    config.activo
                                        ? "border-orange-200 bg-orange-50/50 shadow-sm"
                                        : "border-gray-200 bg-white"
                                }
                            `}
                        >
                            <div
                                className={`flex items-center justify-between p-4 ${
                                    config.activo ? "bg-orange-50/80" : ""
                                }`}
                            >
                                <div>
                                    <p
                                        className={`font-semibold ${
                                            config.activo
                                                ? "text-orange-900"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {nombre}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {config.activo
                                            ? "Día habilitado"
                                            : "Día no disponible"}
                                    </p>
                                </div>

                                <Switch
                                    checked={config.activo}
                                    onChange={(activo) =>
                                        activarDia(id, activo)
                                    }
                                />
                            </div>

                            {config.activo && (
                                <div className="grid gap-3 border-t border-orange-100 p-3 sm:grid-cols-2">
                                    <PeriodoCard
                                        titulo="Mañana"
                                        icon={<Sun size={16} />}
                                        periodo={config.manana}
                                        disabled={!config.activo}
                                        onToggle={(activo) =>
                                            activarPeriodo(
                                                id,
                                                "manana",
                                                activo
                                            )
                                        }
                                        onTimeChange={(campo, valor) =>
                                            actualizarHora(
                                                id,
                                                "manana",
                                                campo,
                                                valor
                                            )
                                        }
                                    />

                                    <PeriodoCard
                                        titulo="Tarde"
                                        icon={<Sunset size={16} />}
                                        periodo={config.tarde}
                                        disabled={!config.activo}
                                        onToggle={(activo) =>
                                            activarPeriodo(
                                                id,
                                                "tarde",
                                                activo
                                            )
                                        }
                                        onTimeChange={(campo, valor) =>
                                            actualizarHora(
                                                id,
                                                "tarde",
                                                campo,
                                                valor
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Información */}
            <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                <p className="text-sm text-orange-800">
                    <span className="font-semibold">Tené en cuenta:</span>{" "}
                    los períodos habilitados determinan cuándo se podrán
                    reservar turnos. Podés configurar uno o ambos períodos
                    por día.
                </p>
            </div>
        </div>
    );
}

/**
 * El cambio de resetKey remonta el componente interno.
 * Así se inicializan los estados con los horarios del médico
 * sin necesitar un useEffect que ejecute setState.
 */
export default function HorarioSemanal({
    value,
    onChange,
    resetKey,
}: HorarioSemanalProps) {
    return (
        <HorarioSemanalInterno
            key={resetKey ?? "horario-semanal"}
            value={value}
            onChange={onChange}
        />
    );
}
