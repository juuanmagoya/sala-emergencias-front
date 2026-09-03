import {
    Eye,
    Pencil,
    Search,
    Trash2,
    Users,
    UserPlus,
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
    useDeletePaciente,
    usePacientes,
} from "@/hooks/usePacientes";

import type { Paciente } from "@/types/paciente";

import PacienteForm from "./PacienteForm";
import PacienteDetail from "./PacienteDetail";
import { PacienteTable, EmptyState } from "@/components/pacientes/PacienteTable";

export default function PacientesPage() {
    const { data, isLoading, isError } = usePacientes();
    const deleteMutation = useDeletePaciente();

    const pacientes = data?.data ?? [];

    // Estados para los diálogos y selección
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Filtrar pacientes por búsqueda
    const filteredPacientes = pacientes.filter((paciente) => {
        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) return true;

        return (
            paciente.nombre.toLowerCase().includes(searchTerm) ||
            paciente.dni.toLowerCase().includes(searchTerm) ||
            paciente.email.toLowerCase().includes(searchTerm)
        );
    });

    // Handlers
    const handleCreate = () => {
        setSelectedPaciente(null);
        setIsFormOpen(true);
    };

    const handleEdit = (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        setIsFormOpen(true);
    };

    const handleView = (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        setIsDetailOpen(true);
    };

    const handleDeleteRequest = (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedPaciente) return;

        try {
            await deleteMutation.mutateAsync(selectedPaciente.id);

            toast.success("Paciente eliminado correctamente", {
                description: `${selectedPaciente.nombre} fue eliminado del sistema.`,
            });

            setIsDeleteOpen(false);
            setSelectedPaciente(null);
        } catch (error) {
            console.error("Error al eliminar paciente:", error);

            toast.error("No se pudo eliminar el paciente", {
                description: "Ocurrió un error al comunicarse con el servidor.",
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <Users size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Pacientes
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gestión y registro de pacientes
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                >
                    <UserPlus size={18} />
                    Nuevo paciente
                </button>
            </div>

            {/* ================================================= */}
            {/* TABLA */}
            {/* ================================================= */}
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
                            placeholder="Buscar por nombre, DNI o email..."
                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 hover:border-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {filteredPacientes.length}
                        </span>
                        <span className="text-slate-500">resultados</span>
                    </div>
                </div>

                {/* Estados de carga */}
                {isLoading && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center gap-3 text-sm text-slate-500">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            Cargando pacientes...
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <p className="font-medium text-red-600">
                            No se pudieron cargar los pacientes.
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            Verificá la conexión con el servidor.
                        </p>
                    </div>
                )}

                {/* Tabla o estado vacío */}
                {!isLoading && !isError && (
                    <>
                        {filteredPacientes.length > 0 ? (
                            <PacienteTable
                                pacientes={filteredPacientes}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDeleteRequest}
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

            {/* ================================================= */}
            {/* TOTAL */}
            {/* ================================================= */}
            {!isLoading && !isError && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">
                        {data?.total ?? 0}
                    </span>
                    pacientes registrados
                </div>
            )}

            {/* ================================================= */}
            {/* FORMULARIO CREATE / EDIT */}
            {/* ================================================= */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent 
                    size="5xl"
                    className="max-h-[95vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 bg-linear-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                                {selectedPaciente ? (
                                    <>
                                        <Pencil size={24} className="text-blue-200" />
                                        Editar paciente
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={24} className="text-blue-200" />
                                        Nuevo paciente
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                                {selectedPaciente
                                    ? "Modificá la información del paciente en el sistema."
                                    : "Completá los datos para registrar un nuevo paciente."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6 bg-slate-50/50">
                        <PacienteForm
                            paciente={selectedPaciente ?? undefined}
                            onCancel={() => setIsFormOpen(false)}
                            onSuccess={() => setIsFormOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================================================= */}
            {/* DETALLE */}
            {/* ================================================= */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent 
                    size="3xl"
                    className="max-h-[90vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 bg-linear-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                                <Eye size={24} className="text-emerald-200" />
                                Ficha del paciente
                            </DialogTitle>
                            <DialogDescription className="text-emerald-100 mt-1">
                                Información detallada del paciente.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6 bg-slate-50/50">
                        {selectedPaciente && (
                            <PacienteDetail paciente={selectedPaciente} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================================================= */}
            {/* CONFIRMAR ELIMINACIÓN */}
            {/* ================================================= */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent size="lg" className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-red-600 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <Trash2 size={20} className="text-red-600" />
                            </div>
                            ¿Eliminar paciente?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 mt-2">
                            Estás a punto de eliminar a{" "}
                            <strong className="text-slate-900">
                                {selectedPaciente?.nombre}
                            </strong>
                            . Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={deleteMutation.isPending}
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium transition-all duration-200 hover:bg-slate-50"
                        >
                            Cancelar
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void handleDelete();
                            }}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-xl disabled:opacity-50"
                        >
                            {deleteMutation.isPending
                                ? "Eliminando..."
                                : "Eliminar paciente"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}