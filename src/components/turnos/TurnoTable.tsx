
import {
    CalendarDays,
    Clock,
    Eye,
    MoreHorizontal,
    Stethoscope,
    Trash2,
    UserRound,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Turno } from "@/types/turno";

// ============================================
// FORMATEAR FECHA Y HORA
// ============================================

function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

function formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

// ============================================
// ESTADO DEL TURNO
// ============================================

function EstadoBadge({ estado }: { estado: Turno["estado"] }) {
    const estilos = {
        pendiente: "bg-amber-100 text-amber-700",
        atendido: "bg-emerald-100 text-emerald-700",
        cancelado: "bg-red-100 text-red-700",
    };

    const etiquetas = {
        pendiente: "Pendiente",
        atendido: "Atendido",
        cancelado: "Cancelado",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
        >
            {etiquetas[estado]}
        </span>
    );
}

// ============================================
// PROPS
// ============================================

interface TurnoTableProps {
    turnos: Turno[];
    onView: (turno: Turno) => void;
    onDelete: (turno: Turno) => void;
}

// ============================================
// TABLA DE TURNOS
// ============================================

export function TurnoTable({
    turnos,
    onView,
    onDelete,
}: TurnoTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 text-left">
                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Paciente
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Médico
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Especialidad
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Fecha
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Horario
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Estado
                        </th>

                        <th className="px-6 py-3.5 text-right font-semibold text-slate-600">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {turnos.map((turno) => (
                        <tr
                            key={turno.id}
                            className="group transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                        >
                            {/* PACIENTE */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                                        <UserRound size={18} />
                                    </div>

                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {turno.paciente?.nombre ?? "Paciente no disponible"}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            DNI: {turno.paciente?.dni ?? "No registrado"}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* MÉDICO */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Stethoscope
                                        size={15}
                                        className="text-emerald-500"
                                    />

                                    <span>
                                        {turno.medico
                                            ? `Dr. ${turno.medico.nombre} ${turno.medico.apellido}`
                                            : "Médico no disponible"}
                                    </span>
                                </div>
                            </td>

                            {/* ESPECIALIDAD */}
                            <td className="px-6 py-4 text-slate-600">
                                {turno.especialidad?.nombre ?? "Especialidad no disponible"}
                            </td>

                            {/* FECHA */}
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-2 text-slate-600">
                                    <CalendarDays
                                        size={15}
                                        className="text-blue-500"
                                    />

                                    {formatearFecha(turno.fechaTurno)}
                                </span>
                            </td>

                            {/* HORARIO */}
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-2 text-slate-600">
                                    <Clock
                                        size={15}
                                        className="text-purple-500"
                                    />

                                    {formatearHora(turno.fechaTurno)}
                                    {" - "}
                                    {formatearHora(turno.fechaFin)}
                                </span>
                            </td>

                            {/* ESTADO */}
                            <td className="px-6 py-4">
                                <EstadoBadge estado={turno.estado} />
                            </td>

                            {/* ACCIONES */}
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group-hover:bg-blue-50">
                                        <MoreHorizontal size={18} />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48 rounded-xl border-2 border-slate-200 shadow-lg"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => onView(turno)}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-blue-50"
                                        >
                                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                            Ver turno
                                        </DropdownMenuItem>

                                        {turno.estado === "pendiente" && (
                                            <>
                                                <DropdownMenuSeparator className="my-1" />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => onDelete(turno)}
                                                    className="cursor-pointer rounded-lg transition-colors hover:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                                    Cancelar turno
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============================================
// ESTADO VACÍO
// ============================================

export function EmptyState({
    search,
    onCreate,
}: {
    search: string;
    onCreate: () => void;
}) {
    return (
        <div className="p-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200">
                <CalendarDays className="h-10 w-10 text-slate-400" />
            </div>

            <p className="text-lg font-medium text-slate-700">
                {search
                    ? "No se encontraron turnos"
                    : "No hay turnos registrados"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
                {search
                    ? "Probá con otro paciente, médico o especialidad."
                    : "Los turnos aparecerán aquí cuando sean registrados."}
            </p>

            {!search && (
                <button
                    onClick={onCreate}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                    <CalendarDays size={17} />
                    Registrar primer turno
                </button>
            )}
        </div>
    );
}
