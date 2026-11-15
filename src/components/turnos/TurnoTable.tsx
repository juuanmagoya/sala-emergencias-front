
import { useState } from "react";

import {
    CalendarDays,
    ChevronDown,
    Clock,
    Eye,
    MoreHorizontal,
    Stethoscope,
    Trash2,
    UserRound,
} from "lucide-react";

import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useUpdateEstadoTurno } from "@/hooks/useTurnos";

import type {
    EstadoTurno,
    Turno,
} from "@/types/turno";

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

function EstadoBadge({ estado }: { estado: EstadoTurno }) {
    const estilos: Record<EstadoTurno, string> = {
        pendiente: "bg-amber-100 text-amber-700",
        atendido: "bg-emerald-100 text-emerald-700",
        cancelado: "bg-red-100 text-red-700",
    };

    const etiquetas: Record<EstadoTurno, string> = {
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
    const updateEstadoMutation = useUpdateEstadoTurno();

    const [turnoSeleccionado, setTurnoSeleccionado] =
        useState<Turno | null>(null);

    const [estadoSeleccionado, setEstadoSeleccionado] =
        useState<EstadoTurno | null>(null);

    const [confirmacionAbierta, setConfirmacionAbierta] =
        useState(false);

    // ========================================
    // SELECCIONAR NUEVO ESTADO
    // ========================================

    function handleCambioEstado(
        turno: Turno,
        nuevoEstado: EstadoTurno
    ) {
        // Solo se permite pasar de pendiente a atendido.
        if (
            turno.estado !== "pendiente" ||
            nuevoEstado !== "atendido"
        ) {
            return;
        }

        setTurnoSeleccionado(turno);
        setEstadoSeleccionado(nuevoEstado);
        setConfirmacionAbierta(true);
    }

    // ========================================
    // CERRAR CONFIRMACIÓN
    // ========================================

    function handleCerrarConfirmacion(abierta: boolean) {
        setConfirmacionAbierta(abierta);

        if (!abierta) {
            setTurnoSeleccionado(null);
            setEstadoSeleccionado(null);
        }
    }

    // ========================================
    // CONFIRMAR CAMBIO DE ESTADO
    // ========================================

    async function handleConfirmarCambio() {
        if (!turnoSeleccionado || !estadoSeleccionado) {
            return;
        }

        try {
            await updateEstadoMutation.mutateAsync({
                id: turnoSeleccionado.id,
                estado: estadoSeleccionado,
            });

            toast.success("Estado del turno actualizado correctamente.");

            setConfirmacionAbierta(false);
            setTurnoSeleccionado(null);
            setEstadoSeleccionado(null);
        } catch {
            toast.error("No se pudo actualizar el estado del turno.");
        }
    }

    return (
        <>
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
                                className="group transition-colors duration-150 hover:bg-blue-50/40"
                            >
                                {/* PACIENTE */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                                            <UserRound size={18} />
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {turno.paciente?.nombre ??
                                                    "Paciente no disponible"}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                DNI: {turno.paciente?.dni ??
                                                    "No registrado"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* MÉDICO */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Stethoscope
                                            size={15}
                                            className="shrink-0 text-emerald-500"
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
                                    {turno.especialidad?.nombre ??
                                        "Especialidad no disponible"}
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
                                    {turno.estado === "pendiente" ? (
                                        <select
                                            value={turno.estado}
                                            onChange={(event) =>
                                                handleCambioEstado(
                                                    turno,
                                                    event.target.value as EstadoTurno
                                                )
                                            }
                                            disabled={updateEstadoMutation.isPending}
                                            aria-label={`Cambiar estado del turno de ${turno.paciente?.nombre ?? "paciente"}`}
                                            className="cursor-pointer rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 outline-none transition-all hover:border-amber-300 focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <option value="pendiente">
                                                Pendiente
                                            </option>

                                            <option value="atendido">
                                                Atendido
                                            </option>
                                        </select>
                                    ) : (
                                        <EstadoBadge estado={turno.estado} />
                                    )}
                                </td>

                                {/* ACCIONES */}
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                            <MoreHorizontal size={17} />

                                            <span>Acciones</span>

                                            <ChevronDown size={14} />
                                        </DropdownMenuTrigger>


                                        <DropdownMenuContent
                                            align="end"
                                            className="z-[60] w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 opacity-100 shadow-xl ring-1 ring-black/5"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => onView(turno)}
                                                className="cursor-pointer rounded-lg py-2.5"
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
                                                        className="cursor-pointer rounded-lg py-2.5"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
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


            {/* ========================================
                CONFIRMACIÓN DE CAMBIO DE ESTADO
            ======================================== */}

            <AlertDialog
                open={confirmacionAbierta}
                onOpenChange={handleCerrarConfirmacion}
            >
                <AlertDialogContent size="lg" className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-emerald-700">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                <Stethoscope
                                    size={20}
                                    className="text-emerald-600"
                                />
                            </div>

                            ¿Confirmar atención del turno?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-slate-600">
                            Estás a punto de cambiar el estado del turno de{" "}
                            <strong className="text-slate-900">
                                {turnoSeleccionado?.paciente?.nombre ?? "este paciente"}
                            </strong>
                            {" "}de <strong>Pendiente</strong> a{" "}
                            <strong className="text-emerald-700">Atendido</strong>.
                            Esta acción no se puede deshacer desde la tabla.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={updateEstadoMutation.isPending}
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium transition-all duration-200 hover:bg-slate-50"
                        >
                            Volver
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void handleConfirmarCambio();
                            }}
                            disabled={updateEstadoMutation.isPending}
                            className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:opacity-50"
                        >
                            {updateEstadoMutation.isPending
                                ? "Actualizando..."
                                : "Confirmar atención"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
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
