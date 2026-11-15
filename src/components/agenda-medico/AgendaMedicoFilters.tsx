import { Search, FilterX } from "lucide-react";

import type { EstadoTurno } from "@/types/turno";

// ============================================================
// PROPS
// ============================================================

interface AgendaMedicoFiltersProps {
    busqueda: string;
    estadoSeleccionado: EstadoTurno | "todos";
    onBusquedaChange: (valor: string) => void;
    onEstadoChange: (estado: EstadoTurno | "todos") => void;
    onLimpiarFiltros: () => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AgendaMedicoFilters({
    busqueda,
    estadoSeleccionado,
    onBusquedaChange,
    onEstadoChange,
    onLimpiarFiltros,
}: AgendaMedicoFiltersProps) {

    const hayFiltrosActivos =
        busqueda.trim() !== "" ||
        estadoSeleccionado !== "todos";

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">

            {/* BUSCAR PACIENTE */}

            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => onBusquedaChange(e.target.value)}
                    placeholder="Buscar paciente..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* FILTRAR POR ESTADO */}

            <div className="w-full sm:w-48">
                <select
                    value={estadoSeleccionado}
                    onChange={(e) =>
                        onEstadoChange(
                            e.target.value as EstadoTurno | "todos"
                        )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="atendido">Atendidos</option>
                    <option value="cancelado">Cancelados</option>
                </select>
            </div>

            {/* LIMPIAR FILTROS */}

            <button
                type="button"
                onClick={onLimpiarFiltros}
                disabled={!hayFiltrosActivos}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FilterX className="h-4 w-4" />
                Limpiar
            </button>
        </div>
    );
}