import { Menu } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface PacienteHeaderProps {
    onAbrirMenu: () => void;
}

export default function PacienteHeader({
    onAbrirMenu,
}: PacienteHeaderProps) {
    const { identidad } = useAuth();

    const nombre =
        identidad?.tipo === "paciente"
            ? identidad.nombre
            : "";

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
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
            <button
                type="button"
                onClick={onAbrirMenu}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                aria-label="Abrir menú"
            >
                <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600">
                    Portal del Paciente
                </p>

                <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">
                    Sala de Emergencias
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="max-w-[220px] truncate text-xs font-semibold text-slate-800">
                        {nombre}
                    </p>

                    <p className="text-[10px] text-slate-400">
                        Paciente
                    </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-700">
                    {iniciales}
                </div>
            </div>
        </header>
    );
}
