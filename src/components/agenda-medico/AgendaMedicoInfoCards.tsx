import {
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import type { Turno } from "@/types/turno";

// ============================================================
// PROPS
// ============================================================

interface AgendaMedicoInfoCardsProps {
    turnos: Turno[];
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AgendaMedicoInfoCards({
    turnos,
}: AgendaMedicoInfoCardsProps) {

    // ============================================
    // CALCULAR ESTADÍSTICAS
    // ============================================

    const totalTurnos = turnos.length;

    const turnosPendientes = turnos.filter(
        (turno) => turno.estado === "pendiente"
    ).length;

    const turnosAtendidos = turnos.filter(
        (turno) => turno.estado === "atendido"
    ).length;

    const turnosCancelados = turnos.filter(
        (turno) => turno.estado === "cancelado"
    ).length;

    // ============================================
    // TARJETAS
    // ============================================

    const tarjetas = [
        {
            titulo: "Total de turnos",
            valor: totalTurnos,
            descripcion: "Turnos de la fecha seleccionada",
            icono: CalendarDays,
            color: "blue",
            estilos: "bg-blue-50 text-blue-700",
        },
        {
            titulo: "Pendientes",
            valor: turnosPendientes,
            descripcion: "Pacientes por atender",
            icono: Clock,
            color: "amber",
            estilos: "bg-amber-50 text-amber-700",
        },
        {
            titulo: "Atendidos",
            valor: turnosAtendidos,
            descripcion: "Consultas realizadas",
            icono: CheckCircle2,
            color: "emerald",
            estilos: "bg-emerald-50 text-emerald-700",
        },
        {
            titulo: "Cancelados",
            valor: turnosCancelados,
            descripcion: "Turnos cancelados",
            icono: XCircle,
            color: "red",
            estilos: "bg-red-50 text-red-700",
        },
    ];

    // ============================================
    // RENDERIZADO
    // ============================================

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {tarjetas.map((tarjeta) => {
                const Icono = tarjeta.icono;

                return (
                    <div
                        key={tarjeta.titulo}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500">
                                    {tarjeta.titulo}
                                </p>

                                <p className="text-3xl font-bold tracking-tight text-slate-900">
                                    {tarjeta.valor}
                                </p>
                            </div>

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${tarjeta.estilos}`}
                            >
                                <Icono className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                            {tarjeta.descripcion}
                        </p>
                    </div>
                );
            })}

        </div>
    );
}