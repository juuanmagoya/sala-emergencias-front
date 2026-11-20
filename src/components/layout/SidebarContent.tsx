import type { ElementType } from "react";

import { NavLink } from "react-router-dom";

import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import type { RolUsuario } from "@/types/auth";

import {
    NAV_ADMINISTRACION,
    NAV_FOOTER,
    NAV_GESTION,
    NAV_PRINCIPAL,
    filtrarPorRol,
    type NavItem,
} from "./sidebar-navigation";

interface SidebarItemProps {
    title: string;
    icon: ElementType;
    href: string;
    collapsed: boolean;
    onNavigate?: () => void;
}

function SidebarItem({
    title,
    icon: Icon,
    href,
    collapsed,
    onNavigate,
}: SidebarItemProps) {
    return (
        <NavLink
            to={href}
            end={href === "/"}
            title={collapsed ? title : undefined}
            onClick={onNavigate}
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

interface SidebarGroupProps {
    title: string;
    items: NavItem[];
    collapsed: boolean;
    onNavigate?: () => void;
    className?: string;
}

function SidebarGroup({
    title,
    items,
    collapsed,
    onNavigate,
    className,
}: SidebarGroupProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                    {title}
                </p>
            )}

            <nav className="space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.href}
                        title={item.title}
                        icon={item.icon}
                        href={item.href}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>
        </div>
    );
}

interface SidebarContentProps {
    collapsed: boolean;
    onNavigate?: () => void;
}

export default function SidebarContent({
    collapsed,
    onNavigate,
}: SidebarContentProps) {
    const { logout, usuario } = useAuth();

    // Filtra los elementos según el rol del usuario.
    const principalFiltrado = filtrarPorRol(
        NAV_PRINCIPAL,
        usuario?.rol
    );

    const gestionFiltrada = filtrarPorRol(
        NAV_GESTION,
        usuario?.rol
    );

    const administracionFiltrada = filtrarPorRol(
        NAV_ADMINISTRACION,
        usuario?.rol
    );

    const footerFiltrado = filtrarPorRol(
        NAV_FOOTER,
        usuario?.rol
    );

    // Convierte el rol técnico en un nombre legible.
    const nombresRoles: Record<RolUsuario, string> = {
        admin: "Administrador",
        recepcionista: "Recepcionista",
        medico: "Médico",
    };

    // Obtiene las iniciales del nombre del usuario.
    const iniciales = usuario?.nombre
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join("") ?? "";

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Navegación */}
            <div className="flex-1 overflow-y-auto px-3 py-6">
                <SidebarGroup
                    title="Principal"
                    items={principalFiltrado}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                />

                <SidebarGroup
                    title="Gestión"
                    items={gestionFiltrada}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                    className="mt-8"
                />

                <SidebarGroup
                    title="Administración"
                    items={administracionFiltrada}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                    className="mt-8"
                />
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 p-3">
                {footerFiltrado.map((item) => (
                    <SidebarItem
                        key={item.href}
                        title={item.title}
                        icon={item.icon}
                        href={item.href}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                ))}

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

                {/* Usuario autenticado */}
                {!collapsed && usuario && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-300">
                            {iniciales}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-300">
                                {usuario.nombre}
                            </p>

                            <p className="truncate text-[10px] text-slate-600">
                                {nombresRoles[usuario.rol]}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
