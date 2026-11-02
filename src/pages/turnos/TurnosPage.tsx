
import {
    CalendarDays,
    CalendarPlus,
    Eye,
    Search,
    Trash2,
} from "lucide-react";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

import { toast } from "sonner";

import {
    useDeleteTurno,
    useTurnos,
} from "@/hooks/useTurnos";

import type { Turno } from "@/types/turno";

import TurnosForm from "@/components/turnos/TurnosForm";
import TurnosDetail from "@/components/turnos/TurnosDetail";
import { TurnoTable, EmptyState } from "@/components/turnos/TurnoTable";

export default function TurnosPage() {
    const { data, isLoading, isError } = useTurnos();
    const deleteMutation = useDeleteTurno();

    const turnos = data?.data ?? [];

    // Estados para los diálogos y selección
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Filtrar turnos por búsqueda
    const filteredTurnos = turnos.filter((turno) => {
        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) return true;

        const nombrePaciente = turno.paciente?.nombre?.toLowerCase() ?? "";
        const nombreMedico = `${turno.medico?.nombre ?? ""} ${turno.medico?.apellido ?? ""}`.toLowerCase();
        const nombreEspecialidad = turno.especialidad?.nombre?.toLowerCase() ?? "";

        return (
            nombrePaciente.includes(searchTerm) ||
            nombreMedico.includes(searchTerm) ||
            nombreEspecialidad.includes(searchTerm)
        );
    });

    // Handlers
    const handleCreate = () => {
        setSelectedTurno(null);
        setIsFormOpen(true);
    };

    const handleView = (turno: Turno) => {
        setSelectedTurno(turno);
        setIsDetailOpen(true);
    };

    const handleCancelRequest = (turno: Turno) => {
        setSelectedTurno(turno);
        setIsCancelOpen(true);
    };

    const handleCancel = async () => {
        if (!selectedTurno) return;

        try {
            await deleteMutation.mutateAsync(selectedTurno.id);

            toast.success("Turno cancelado correctamente", {
                description: `El turno de ${selectedTurno.paciente.nombre} fue cancelado.`,
            });

            setIsCancelOpen(false);
            setSelectedTurno(null);
        } catch (error) {
            console.error("Error al cancelar turno:", error);

            toast.error("No se pudo cancelar el turno", {
                description: "Ocurrió un error al comunicarse con el servidor.",
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <CalendarDays size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Turnos
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión y administración de turnos médicos
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                >
                    <CalendarPlus size={18} />
                    Nuevo turno
                </button>
            </div>

            {/* TABLA */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                {/* Toolbar de búsqueda */}
                <div className="flex flex-col gap-3 border-b border-slate-200 bg-linear-to-r from-slate-50/80 to-slate-100/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por paciente, médico o especialidad..."
                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:border-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {filteredTurnos.length}
                        </span>

                        <span className="text-slate-500">resultados</span>
                    </div>
                </div>

                {/* Estados de carga */}
                {isLoading && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center gap-3 text-sm text-slate-500">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                            Cargando turnos...
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <span className="text-3xl">⚠️</span>
                        </div>

                        <p className="font-medium text-red-600">
                            No se pudieron cargar los turnos.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Verificá la conexión con el servidor.
                        </p>
                    </div>
                )}

                {/* Tabla o estado vacío */}
                {!isLoading && !isError && (
                    <>
                        {filteredTurnos.length > 0 ? (
                            <TurnoTable
                                turnos={filteredTurnos}
                                onView={handleView}
                                onDelete={handleCancelRequest}
                            />
                        ) : (
                            <EmptyState
                                search={search}
                                onCreate={handleCreate}
                            />
                        )}
                    </>
                )}
            </div>

            {/* TOTAL */}
            {!isLoading && !isError && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">
                        {data?.total ?? 0}
                    </span>

                    turnos registrados
                </div>
            )}

            {/* FORMULARIO DE REGISTRO */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent
                    size="5xl"
                    className="max-h-[95vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                                <CalendarPlus size={24} className="text-blue-200" />
                                Nuevo turno
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-blue-100">
                                Completá los datos para registrar un nuevo turno médico.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="bg-slate-50/50 p-6">
                        <TurnosForm
                            onCancel={() => setIsFormOpen(false)}
                            onSuccess={() => setIsFormOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* DETALLE */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent
                    size="3xl"
                    className="max-h-[90vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                                <Eye size={24} className="text-emerald-200" />
                                Detalle del turno
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-emerald-100">
                                Información detallada del turno médico.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="bg-slate-50/50 p-6">
                        {selectedTurno && (
                            <TurnosDetail turno={selectedTurno} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* CONFIRMAR CANCELACIÓN */}
            <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                <AlertDialogContent size="lg" className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <Trash2 size={20} className="text-red-600" />
                            </div>

                            ¿Cancelar turno?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-slate-600">
                            Estás a punto de cancelar el turno de{" "}
                            <strong className="text-slate-900">
                                {selectedTurno?.paciente.nombre}
                            </strong>
                            . Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={deleteMutation.isPending}
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium transition-all duration-200 hover:bg-slate-50"
                        >
                            Volver
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void handleCancel();
                            }}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-xl disabled:opacity-50"
                        >
                            {deleteMutation.isPending
                                ? "Cancelando..."
                                : "Cancelar turno"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
