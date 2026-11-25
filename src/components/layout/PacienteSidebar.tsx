
import { NavLink } from "react-router-dom";

import {
    Bot,
    CalendarClock,
    CalendarPlus,
    FileText,
    HeartPulse,
    Home,
    LogOut,
    X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface PacienteSidebarProps {
    abierto: boolean;
    onCerrar: () => void;
}

// Navegación del portal. No se agregan accesos a funcionalidades
// que todavía no existen.
const navegacion = [
    {
        title: "Inicio",
        icon: Home,
        href: "/portal",
    },
    {
        title: "Reservar turno",
        icon: CalendarPlus,
        href: "/portal/reservar-turno",
    },
    {
        title: "Mis turnos",
        icon: CalendarClock,
        href: "/portal/mis-turnos",
    },
    {
        title: "Historias clínicas",
        icon: FileText,
        href: "/portal/historias-clinicas",
    },
    {
        title: "Asistente médico",
        icon: Bot,
        href: "/portal/asistente-medico",
    },
] as const;

export default function PacienteSidebar({
    abierto,
    onCerrar,
}: PacienteSidebarProps) {
    const { identidad, logout } = useAuth();

    const nombre =
        identidad?.tipo === "paciente"
            ? identidad.nombre
            : "";

    // Obtiene las iniciales del nombre del paciente.
    const iniciales =
        nombre
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((parte) =>
                parte.charAt(0).toUpperCase()
            )
            .join("") || "P";

    return (
        <>
            {/* Fondo del menú móvil */}
            <div
                role="presentation"
                onClick={onCerrar}
                aria-hidden="true"
                className={cn(
                    "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                    abierto
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                )}
            />

            <aside
                aria-label="Menú del Portal del Paciente"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0",
                    abierto
                        ? "translate-x-0"
                        : "-translate-x-full"
                )}
            >
                {/* Marca */}
                <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-slate-100 px-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/25">
                        <HeartPulse
                            size={21}
                            strokeWidth={2.3}
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                            Portal del Paciente
                        </p>

                        <p className="truncate text-[11px] text-slate-400">
                            Sala de Emergencias
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCerrar}
                        className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navegación */}
                <div className="flex-1 overflow-y-auto px-3 py-6">
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Tu espacio
                    </p>

                    <nav className="space-y-1">
                        {navegacion.map(
                            ({
                                title,
                                icon: Icon,
                                href,
                            }) => (
                                <NavLink
                                    key={href}
                                    to={href}
                                    end={href === "/portal"}
                                    onClick={onCerrar}
                                    className={({ isActive }) =>
                                        cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                                            isActive
                                                ? "bg-cyan-50 font-medium text-cyan-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={18}
                                                className={cn(
                                                    "shrink-0",
                                                    isActive
                                                        ? "text-cyan-600"
                                                        : "text-slate-400 transition group-hover:text-cyan-600"
                                                )}
                                            />

                                            <span className="truncate">
                                                {title}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            )
                        )}
                    </nav>
                </div>

                {/* Sesión */}
                <div className="border-t border-slate-100 p-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-700">
                            {iniciales}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800">
                                {nombre}
                            </p>

                            <p className="truncate text-[10px] text-slate-400">
                                Paciente
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="group mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut
                            size={18}
                            className="shrink-0 text-slate-400 transition group-hover:text-red-500"
                        />

                        <span className="truncate">
                            Cerrar sesión
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}
