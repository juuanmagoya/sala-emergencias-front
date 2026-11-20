import { useEffect, useState } from "react";

import { Menu } from "lucide-react";

import {
    formatFechaHeader,
    obtenerSaludoHeader,
} from "@/components/shared/formatDate";
import { useSidebar } from "@/contexts/useSidebar";
import { useAuth } from "@/hooks/useAuth";
import type { RolUsuario } from "@/types/auth";

const NOMBRES_ROL: Record<RolUsuario, string> = {
    admin: "Administrador",
    medico: "Médico",
    recepcionista: "Recepcionista",
};

function obtenerIniciales(nombre: string): string {
    return (
        nombre
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((parte) => parte.charAt(0).toUpperCase())
            .join("") || "U"
    );
}

export default function Header() {
    const { usuario } = useAuth();
    const { mobileOpen, openMobile } = useSidebar();

    // La fecha y el saludo se recalculan cada minuto sin navegar.
    const [ahora, setAhora] = useState(() => new Date());

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setAhora(new Date());
        }, 60_000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    const nombreCompleto = usuario?.nombre?.trim() ?? "";
    const primerNombre =
        nombreCompleto.split(/\s+/)[0] ?? "";
    const rol = usuario ? NOMBRES_ROL[usuario.rol] : "";
    const iniciales = obtenerIniciales(nombreCompleto);

    const fecha = formatFechaHeader(ahora);
    const saludo = obtenerSaludoHeader(ahora);

    return (
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">

            <div className="flex min-w-0 flex-1 items-center gap-3">

                <button
                    type="button"
                    onClick={openMobile}
                    aria-label="Abrir menú de navegación"
                    aria-expanded={mobileOpen}
                    aria-controls="menu-movil"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="min-w-0">

                    <p className="truncate text-xs font-medium text-slate-400">
                        {fecha}
                    </p>

                    <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                        {primerNombre
                            ? `${saludo}, ${primerNombre}`
                            : saludo}
                    </h1>

                </div>

            </div>

            <div className="flex shrink-0 items-center gap-3">

                <div className="hidden text-right sm:block">

                    <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                        {nombreCompleto}
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                        {rol}
                    </p>

                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {iniciales}
                </div>

            </div>

        </header>
    );
}
