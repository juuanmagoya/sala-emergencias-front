import type { ElementType } from "react";

import {
    Building2,
    CalendarDays,
    ClipboardList,
    HeartPulse,
    LayoutDashboard,
    Settings,
    Stethoscope,
    Users,
} from "lucide-react";

import type { RolUsuario } from "@/types/auth";

export interface NavItem {
    title: string;
    icon: ElementType;
    href: string;
    rolesPermitidos: RolUsuario[];
}

// Navegación principal. Solo el administrador accede al dashboard.
export const NAV_PRINCIPAL: NavItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        rolesPermitidos: ["admin"],
    },
];

// Navegación de gestión, compartida por el sidebar y el drawer móvil.
export const NAV_GESTION: NavItem[] = [
    {
        title: "Pacientes",
        icon: Users,
        href: "/pacientes",
        rolesPermitidos: ["admin", "recepcionista", "medico"],
    },
    {
        title: "Nuevo Turno",
        icon: HeartPulse,
        href: "/recepcion",
        rolesPermitidos: ["admin", "recepcionista"],
    },
    {
        title: "Médicos",
        icon: Stethoscope,
        href: "/medicos",
        rolesPermitidos: ["admin", "recepcionista"],
    },
    {
        title: "Turnos",
        icon: CalendarDays,
        href: "/turnos",
        rolesPermitidos: ["admin", "recepcionista"],
    },
    {
        title: "Agenda",
        icon: CalendarDays,
        href: "/mis-turnos",
        rolesPermitidos: ["medico"],
    },
    {
        title: "Consultorios",
        icon: Building2,
        href: "/consultorios",
        rolesPermitidos: ["admin"],
    },
];

// Navegación de administración.
export const NAV_ADMINISTRACION: NavItem[] = [
    {
        title: "Especialidades",
        icon: ClipboardList,
        href: "/especialidades",
        rolesPermitidos: ["admin"],
    },
    {
        title: "Usuarios",
        icon: Users,
        href: "/usuarios",
        rolesPermitidos: ["admin"],
    },
];

// Enlaces del footer del sidebar.
export const NAV_FOOTER: NavItem[] = [
    {
        title: "Configuración",
        icon: Settings,
        href: "/configuracion",
        rolesPermitidos: ["admin"],
    },
];

/**
 * Filtra los elementos de navegación según el rol autenticado.
 * Sin rol (por ejemplo, un paciente) no se muestra ningún elemento.
 */
export function filtrarPorRol(
    items: NavItem[],
    rol?: RolUsuario
): NavItem[] {
    if (!rol) {
        return [];
    }

    return items.filter((item) =>
        item.rolesPermitidos.includes(rol)
    );
}
