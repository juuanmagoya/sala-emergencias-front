import {
    Eye,
    FilePlus2,
    Clock,
    UserRound,
    Stethoscope,
    CalendarCheck,
} from "lucide-react";

import type { Turno } from "@/types/turno";

// ============================================================
// PROPS
// ============================================================

interface AgendaMedicoTableProps {
    turnos: Turno[];
    onNuevaHistoriaClinica: (turno: Turno) => void;
    onVerHistoriasClinicas: (turno: Turno) => void;
}

// ============================================================
// ESTADO DEL TURNO
// ============================================================

function EstadoBadge({ estado }: { estado: Turno["estado"] }) {
    const estilos = {
        pendiente: "bg-amber-50 text-amber-700 border-amber-200",
        atendido: "bg-emerald-50 text-emerald-700 border-emerald-200",
        cancelado: "bg-red-50 text-red-700 border-red-200",
    };

    const etiquetas = {
        pendiente: "Pendiente",
        atendido: "Atendido",
        cancelado: "Cancelado",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${estilos[estado]}`}
        >
            {etiquetas[estado]}
        </span>
    );
}

// ============================================================
// FORMATEAR HORARIO
// ============================================================

function formatearHora(fecha: string): string {
    return new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(fecha));
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AgendaMedicoTable({
    turnos,
    onNuevaHistoriaClinica,
    onVerHistoriasClinicas,
}: AgendaMedicoTableProps) {

    // ============================================
    // ESTADO VACÍO
    // ============================================

    if (turnos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <CalendarCheck className="h-7 w-7" />
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                    No hay turnos para mostrar
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                    No se encontraron turnos para la fecha o los filtros seleccionados.
                </p>
            </div>
        );
    }

    // ============================================
    // TABLA
    // ============================================

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ENCABEZADO */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                    <h2 className="font-semibold text-slate-900">
                        Turnos de pacientes
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                        Listado de tus pacientes y sus horarios de atención.
                    </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    {turnos.length} turnos
                </span>
            </div>

            {/* CONTENEDOR RESPONSIVE */}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">

                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-5 py-3 font-semibold">
                                Paciente
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Horario
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Especialidad
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Estado
                            </th>

                            <th className="px-5 py-3 text-right font-semibold">
                                Acción
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                        {turnos.map((turno) => {

                            const paciente = turno.paciente;

                            const nombrePaciente = [
                                paciente.nombre,
                            ].filter(Boolean).join(" ");

                            return (
                                <tr
                                    key={turno.id}
                                    className="transition-colors hover:bg-slate-50/70"
                                >

                                    {/* PACIENTE */}

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                <UserRound className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {nombrePaciente}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {paciente.email || "Sin correo registrado"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* HORARIO */}

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <Clock className="h-4 w-4 text-slate-400" />

                                            <span className="font-medium">
                                                {formatearHora(turno.fechaTurno)}
                                            </span>

                                            <span className="text-slate-400">
                                                -
                                            </span>

                                            <span>
                                                {formatearHora(turno.fechaFin)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ESPECIALIDAD */}

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Stethoscope className="h-4 w-4 text-slate-400" />

                                            {turno.especialidad.nombre}
                                        </div>
                                    </td>

                                    {/* ESTADO */}

                                    <td className="px-5 py-4">
                                        <EstadoBadge estado={turno.estado} />
                                    </td>

                                    {/* ACCIONES */}

                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap justify-end gap-2">

                                            {turno.estado === "pendiente" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onNuevaHistoriaClinica(turno)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <FilePlus2 className="h-4 w-4" />
                                                    Nueva historia
                                                </button>
                                            )}

                                            {turno.estado !== "cancelado" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onVerHistoriasClinicas(turno)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Ver historias clínicas
                                                </button>
                                            )}

                                            {turno.estado === "cancelado" && (
                                                <span className="text-xs text-slate-400">
                                                    Sin acciones disponibles
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    );
}