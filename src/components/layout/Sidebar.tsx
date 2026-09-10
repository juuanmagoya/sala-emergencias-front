import { NavLink } from "react-router-dom";

import {
    Activity,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    HeartPulse,
    LayoutDashboard,
    LogOut,
    Settings,
    Stethoscope,
    Users,
} from "lucide-react";

import { useSidebar } from "@/contexts/useSidebar";
import { useAuth } from "@/hooks/useAuth";

const management = [
    {
        title: "Pacientes",
        icon: Users,
        href: "/pacientes",
    },
    {
        title: "Médicos",
        icon: Stethoscope,
        href: "/medicos",
    },
    {
        title: "Turnos",
        icon: CalendarDays,
        href: "/turnos",
    },
    {
        title: "Consultorios",
        icon: Building2,
        href: "/consultorios",
    },
];

const administration = [
    {
        title: "Especialidades",
        icon: ClipboardList,
        href: "/especialidades",
    },
    {
        title: "Recepción",
        icon: HeartPulse,
        href: "/recepcion",
    },
    {
        title: "Historias clínicas",
        icon: Activity,
        href: "/historias-clinicas",
    },
];

interface SidebarItemProps {
    title: string;
    icon: React.ElementType;
    href: string;
    collapsed: boolean;
}

function SidebarItem({
    title,
    icon: Icon,
    href,
    collapsed,
}: SidebarItemProps) {
    return (
        <NavLink
            to={href}
            end={href === "/"}
            title={collapsed ? title : undefined}
            className={({ isActive }) =>
                `group flex items-center rounded-xl py-2.5 text-sm transition-all ${
                    collapsed
                        ? "justify-center px-2"
                        : "gap-3 px-3"
                } ${
                    isActive
                        ? "bg-cyan-500/10 font-medium text-cyan-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon
                        size={18}
                        className={
                            isActive
                                ? "shrink-0 text-cyan-400"
                                : "shrink-0 text-slate-500 transition group-hover:text-cyan-400"
                        }
                    />

                    {!collapsed && (
                        <span className="truncate">
                            {title}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
}

export default function Sidebar() {
    const {
        collapsed,
        toggleSidebar,
    } = useSidebar();

    const { logout } = useAuth();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-950 text-slate-300 transition-all duration-300 lg:flex ${
                collapsed
                    ? "w-[76px]"
                    : "w-[260px]"
            }`}
        >
            {/* Header */}
            <div
                className={`flex h-[72px] items-center border-b border-white/5 ${
                    collapsed
                        ? "justify-center px-3"
                        : "px-5"
                }`}
            >
                <div
                    className={`flex items-center ${
                        collapsed ? "" : "gap-3"
                    }`}
                >
                    {/* Logo */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                        <HeartPulse
                            size={21}
                            strokeWidth={2.3}
                        />
                    </div>

                    {/* Nombre */}
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold tracking-tight text-white">
                                Emergencias
                            </p>

                            <p className="text-[11px] text-slate-500">
                                Gestión sanitaria
                            </p>
                        </div>
                    )}
                </div>

                {/* Botón contraer */}
                {!collapsed && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="ml-auto rounded-lg p-1.5 text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
                        aria-label="Contraer menú"
                    >
                        <ChevronLeft size={17} />
                    </button>
                )}

                {/* Botón expandir */}
                {collapsed && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-lg transition hover:text-white"
                        aria-label="Expandir menú"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>

            {/* Navegación */}
            <div className="flex-1 overflow-y-auto px-3 py-6">

                {/* Principal */}
                {!collapsed && (
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Principal
                    </p>
                )}

                <nav className="space-y-1">
                    <SidebarItem
                        title="Dashboard"
                        icon={LayoutDashboard}
                        href="/"
                        collapsed={collapsed}
                    />
                </nav>

                {/* Gestión */}
                <div className="mt-8">

                    {!collapsed && (
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                            Gestión
                        </p>
                    )}

                    <nav className="space-y-1">
                        {management.map((item) => (
                            <SidebarItem
                                key={item.title}
                                title={item.title}
                                icon={item.icon}
                                href={item.href}
                                collapsed={collapsed}
                            />
                        ))}
                    </nav>

                </div>

                {/* Administración */}
                <div className="mt-8">

                    {!collapsed && (
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                            Administración
                        </p>
                    )}

                    <nav className="space-y-1">
                        {administration.map((item) => (
                            <SidebarItem
                                key={item.title}
                                title={item.title}
                                icon={item.icon}
                                href={item.href}
                                collapsed={collapsed}
                            />
                        ))}
                    </nav>

                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 p-3">

                <SidebarItem
                    title="Configuración"
                    icon={Settings}
                    href="/configuracion"
                    collapsed={collapsed}
                />

                {/* Cerrar sesión */}
                <button
                    type="button"
                    onClick={logout}
                    title={collapsed ? "Cerrar sesión" : undefined}
                    className={`group mt-1 flex w-full items-center rounded-xl py-2.5 text-sm text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 ${
                        collapsed
                            ? "justify-center px-2"
                            : "gap-3 px-3"
                    }`}
                >
                    <LogOut
                        size={18}
                        className="shrink-0 text-slate-500 transition group-hover:text-red-400"
                    />

                    {!collapsed && (
                        <span className="truncate">
                            Cerrar sesión
                        </span>
                    )}
                </button>

                {/* Usuario */}
                {!collapsed && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-300">
                            AD
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-300">
                                Administrador
                            </p>

                            <p className="truncate text-[10px] text-slate-600">
                                Sesión activa
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </aside>
    );
}