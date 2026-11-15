import {
    CalendarDays,
    IdCard,
    Mail,
    Stethoscope,
    UserRound,
    ShieldCheck,
    Clock,
} from "lucide-react";

import type { Usuario } from "@/types/usuario";

import {
    InfoCard,
    SectionHeader,
} from "@/components/turnos/TurnoInfoCards";

import { formatDate } from "@/components/shared/formatDate";

// ============================================
// ESTADO DEL USUARIO
// ============================================

function EstadoBadge({ activo }: { activo: boolean }) {
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
                activo
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {activo ? "Activo" : "Inactivo"}
        </span>
    );
}

// ============================================
// ROL DEL USUARIO
// ============================================

function RolBadge({ rol }: { rol: Usuario["rol"] }) {
    const estilos = {
        admin: "bg-purple-50 text-purple-700",
        medico: "bg-blue-50 text-blue-700",
        recepcionista: "bg-amber-50 text-amber-700",
    };

    const etiquetas = {
        admin: "Administrador",
        medico: "Médico",
        recepcionista: "Recepcionista",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${estilos[rol]}`}
        >
            {etiquetas[rol]}
        </span>
    );
}

// ============================================
// OBTENER NOMBRE DEL MÉDICO
// ============================================

function obtenerNombreMedico(medico: Usuario["medico"]): string {
    if (!medico) return "Sin médico asociado";

    if (typeof medico === "string") return "Médico asociado";

    return medico.nombre;
}

// ============================================
// PROPS
// ============================================

interface UsuarioDetailProps {
    usuario: Usuario;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function UsuarioDetail({ usuario }: UsuarioDetailProps) {
    const iniciales = usuario.nombre
        .split(" ")
        .slice(0, 2)
        .map((parte) => parte.charAt(0))
        .join("")
        .toUpperCase();

    const nombreMedico = obtenerNombreMedico(usuario.medico);

    return (
        <div className="space-y-6">

            {/* PERFIL DEL USUARIO */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">
                        {iniciales}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                                {usuario.nombre}
                            </h2>

                            <EstadoBadge activo={usuario.activo} />
                            <RolBadge rol={usuario.rol} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {usuario.email}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <IdCard className="h-4 w-4" />
                                ID: {usuario._id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DE LA CUENTA */}

            <section className="space-y-3">
                <SectionHeader
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Información de la cuenta"
                    description="Datos generales y permisos del usuario."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<UserRound className="h-4 w-4" />}
                        label="Nombre completo"
                        value={usuario.nombre}
                    />

                    <InfoCard
                        icon={<Mail className="h-4 w-4" />}
                        label="Correo electrónico"
                        value={usuario.email}
                    />

                    <InfoCard
                        icon={<ShieldCheck className="h-4 w-4" />}
                        label="Rol"
                        value={{
                            admin: "Administrador",
                            medico: "Médico",
                            recepcionista: "Recepcionista",
                        }[usuario.rol]}
                    />

                    <InfoCard
                        icon={<IdCard className="h-4 w-4" />}
                        label="Identificador"
                        value={usuario._id}
                    />
                </div>
            </section>

            {/* MÉDICO ASOCIADO */}

            {usuario.rol === "medico" && (
                <section className="space-y-3">
                    <SectionHeader
                        icon={<Stethoscope className="h-4 w-4" />}
                        title="Médico asociado"
                        description="Perfil médico vinculado a esta cuenta."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        <InfoCard
                            icon={<Stethoscope className="h-4 w-4" />}
                            label="Médico"
                            value={nombreMedico}
                        />
                    </div>
                </section>
            )}

            {/* FECHAS DE REGISTRO */}

            <section className="space-y-3">
                <SectionHeader
                    icon={<CalendarDays className="h-4 w-4" />}
                    title="Actividad de la cuenta"
                    description="Fechas de creación y última modificación."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Fecha de registro"
                        value={
                            usuario.createdAt
                                ? formatDate(usuario.createdAt)
                                : "No disponible"
                        }
                    />

                    <InfoCard
                        icon={<Clock className="h-4 w-4" />}
                        label="Última actualización"
                        value={
                            usuario.updatedAt
                                ? formatDate(usuario.updatedAt)
                                : "No disponible"
                        }
                    />
                </div>
            </section>
        </div>
    );
}