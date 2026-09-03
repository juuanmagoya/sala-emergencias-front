import {
    AlertTriangle,
    Ban,
    CheckCircle,
    Eye,
    Filter,
    Plus,
    Search,
    Stethoscope,
    Trash2,
    UserRound,
    X,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

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

import MedicoForm from "@/components/medicos/MedicoForm";
import MedicoTable from "@/components/medicos/MedicoTable";
import MedicoDetail from "@/components/medicos/MedicoDetail";

import {
    useDeleteMedicoPermanente,
    useMedicos,
    useToggleActivoMedico,
} from "@/hooks/useMedicos";

import type { Medico } from "@/types/medico";

export default function MedicosPage() {
    // ============================================
    // DATOS
    // ============================================

    const {
        data,
        isLoading,
        isError,
    } = useMedicos();

    // ============================================
    // MUTACIONES
    // ============================================

    const toggleStatusMutation =
        useToggleActivoMedico();

    const deletePermanentMutation =
        useDeleteMedicoPermanente();

    // ============================================
    // FILTROS
    // ============================================

    const [search, setSearch] =
        useState("");

    const [estado, setEstado] = useState<
        "todos" | "activos" | "inactivos"
    >("todos");

    // ============================================
    // FORMULARIO
    // ============================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingMedico, setEditingMedico] =
        useState<Medico | undefined>();

    // ============================================
    // MÉDICO SELECCIONADO
    // ============================================

    const [selectedMedico, setSelectedMedico] =
        useState<Medico | null>(null);

    const [isDetailOpen, setIsDetailOpen] =
        useState(false);

    const [isToggleOpen, setIsToggleOpen] =
        useState(false);

    const [isDeletePermanentOpen, setIsDeletePermanentOpen] =
        useState(false);

    // ============================================
    // DATOS
    // ============================================

    const medicos = data?.data ?? [];

    // ============================================
    // FILTRADO LOCAL
    // ============================================

    const searchTerm =
        search.trim().toLowerCase();

    const filteredMedicos =
        medicos.filter((medico) => {
            // ----------------------------------------
            // FILTRO POR ESTADO
            // ----------------------------------------

            if (
                estado === "activos" &&
                medico.activo === false
            ) {
                return false;
            }

            if (
                estado === "inactivos" &&
                medico.activo !== false
            ) {
                return false;
            }

            // ----------------------------------------
            // SIN BÚSQUEDA
            // ----------------------------------------

            if (!searchTerm) {
                return true;
            }

            // ----------------------------------------
            // CAMPOS DE BÚSQUEDA
            // ----------------------------------------

            const nombre =
                medico.nombre
                    ?.toLowerCase() ?? "";

            const apellido =
                medico.apellido
                    ?.toLowerCase() ?? "";

            const matricula =
                medico.matricula
                    ?.toLowerCase() ?? "";

            const email =
                medico.email
                    ?.toLowerCase() ?? "";

            const especialidad =
                medico.especialidad?.nombre
                    ?.toLowerCase() ?? "";

            return (
                nombre.includes(searchTerm) ||
                apellido.includes(searchTerm) ||
                `${nombre} ${apellido}`.includes(
                    searchTerm
                ) ||
                matricula.includes(searchTerm) ||
                email.includes(searchTerm) ||
                especialidad.includes(searchTerm)
            );
        });

    // ============================================
    // FILTROS
    // ============================================

    const handleClearFilters = () => {
        setSearch("");
        setEstado("todos");
    };

    const hasFilters =
        search.trim() !== "" ||
        estado !== "todos";

    // ============================================
    // CREAR MÉDICO
    // ============================================

    const handleCreate = () => {
        setEditingMedico(undefined);
        setShowForm(true);
    };

    // ============================================
    // EDITAR MÉDICO
    // ============================================

    const handleEdit = (
        medico: Medico
    ) => {
        setEditingMedico(medico);
        setShowForm(true);
    };

    // ============================================
    // VER MÉDICO
    // ============================================

    const handleView = (
        medico: Medico
    ) => {
        setSelectedMedico(medico);
        setIsDetailOpen(true);
    };

    // ============================================
    // CERRAR FORMULARIO
    // ============================================

    const handleCloseForm = () => {
        if (
            toggleStatusMutation.isPending ||
            deletePermanentMutation.isPending
        ) {
            return;
        }

        setShowForm(false);
        setEditingMedico(undefined);
    };

    // ============================================
    // SOLICITAR CAMBIO DE ESTADO
    // ============================================

    const handleToggleStatus = (
        medico: Medico
    ) => {
        setSelectedMedico(medico);
        setIsToggleOpen(true);
    };

    // ============================================
    // CONFIRMAR CAMBIO DE ESTADO
    // ============================================

    const handleToggleStatusConfirm =
        async () => {
            if (!selectedMedico) {
                return;
            }

            try {
                await toggleStatusMutation.mutateAsync(
                    selectedMedico.id
                );

                const estaActivo =
                    selectedMedico.activo === true;

                toast.success(
                    estaActivo
                        ? "Médico desactivado correctamente"
                        : "Médico activado correctamente",
                    {
                        description: estaActivo
                            ? `${selectedMedico.nombre} ${selectedMedico.apellido} fue marcado como inactivo.`
                            : `${selectedMedico.nombre} ${selectedMedico.apellido} fue activado nuevamente.`,
                    }
                );

                setIsToggleOpen(false);
                setSelectedMedico(null);
            } catch (error: unknown) {
                console.error(
                    "Error al cambiar estado del médico:",
                    error
                );

                let errorMessage =
                    "No se pudo cambiar el estado del médico.";

                if (
                    typeof error === "object" &&
                    error !== null
                ) {
                    const apiError =
                        error as {
                            response?: {
                                data?: {
                                    message?: string;
                                };
                            };
                        };

                    errorMessage =
                        apiError.response?.data
                            ?.message ??
                        errorMessage;
                }

                toast.error(
                    "No se pudo cambiar el estado",
                    {
                        description:
                            errorMessage,
                    }
                );
            }
        };

    // ============================================
    // SOLICITAR BORRADO PERMANENTE
    // ============================================

    const handleDeletePermanent = (
        medico: Medico
    ) => {
        setSelectedMedico(medico);
        setIsDeletePermanentOpen(true);
    };

    // ============================================
    // CONFIRMAR BORRADO PERMANENTE
    // ============================================

    const handleDeletePermanentConfirm =
        async () => {
            if (!selectedMedico) {
                return;
            }

            try {
                await deletePermanentMutation.mutateAsync(
                    selectedMedico.id
                );

                toast.success(
                    "Médico eliminado definitivamente",
                    {
                        description: `${selectedMedico.nombre} ${selectedMedico.apellido} fue eliminado completamente del sistema.`,
                    }
                );

                setIsDeletePermanentOpen(false);
                setSelectedMedico(null);
            } catch (error: unknown) {
                console.error(
                    "Error al eliminar médico permanentemente:",
                    error
                );

                let errorMessage =
                    "No se pudo eliminar definitivamente el médico.";

                if (
                    typeof error === "object" &&
                    error !== null
                ) {
                    const apiError =
                        error as {
                            response?: {
                                data?: {
                                    message?: string;
                                };
                            };
                        };

                    errorMessage =
                        apiError.response?.data
                            ?.message ??
                        errorMessage;
                }

                toast.error(
                    "No se pudo eliminar el médico",
                    {
                        description:
                            errorMessage,
                    }
                );
            }
        };

    // ============================================
    // FORMULARIO
    // ============================================

    if (showForm) {
        return (
            <div className="space-y-6">
                {/* HEADER */}

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                            <UserRound size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {editingMedico
                                    ? "Editar médico"
                                    : "Nuevo médico"}
                            </h1>

                            <p className="text-sm text-slate-500">
                                {editingMedico
                                    ? "Modificá los datos del médico."
                                    : "Registrá un nuevo médico en el sistema."}
                            </p>
                        </div>
                    </div>
                </div>

                <MedicoForm
                    medico={editingMedico}
                    onSuccess={handleCloseForm}
                    onCancel={handleCloseForm}
                />
            </div>
        );
    }

    // ============================================
    // LOADING
    // ============================================

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

                        <div className="space-y-2">
                            <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />

                            <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
                        </div>
                    </div>

                    <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="h-14 animate-pulse bg-slate-100" />

                    <div className="space-y-4 p-6">
                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // ERROR
    // ============================================

    if (isError) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                        <UserRound
                            size={22}
                            className="text-red-600"
                        />
                    </div>

                    <h2 className="text-lg font-semibold text-red-900">
                        No se pudieron cargar
                        los médicos
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        Ocurrió un error al
                        obtener los médicos
                        desde el servidor.
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // ESTADO SELECCIONADO
    // ============================================

    const selectedIsActive =
        selectedMedico?.activo === true;

    // ============================================
    // LISTADO
    // ============================================

    return (
        <div className="space-y-6">
            {/* ======================================== */}
            {/* HEADER */}
            {/* ======================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <Stethoscope size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Médicos
                        </h1>

                        <p className="text-sm text-slate-500">
                            Gestión de médicos
                            de la institución
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                >
                    <Plus size={18} />
                    Nuevo médico
                </button>
            </div>

            {/* ======================================== */}
            {/* FILTROS */}
            {/* ======================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-linear-to-r from-slate-50/80 to-slate-100/80 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Filter
                                size={18}
                                className="text-slate-500"
                            />

                            <h2 className="text-sm font-semibold text-slate-900">
                                Buscar médicos
                            </h2>
                        </div>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-red-600"
                            >
                                <X size={15} />
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-[1fr_220px]">
                    {/* BÚSQUEDA */}

                    <div>
                        <label
                            htmlFor="search-medicos"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Buscar
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="search-medicos"
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Buscar por nombre, apellido, matrícula o especialidad..."
                                className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* ESTADO */}

                    <div>
                        <label
                            htmlFor="estado-medicos"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Estado
                        </label>

                        <select
                            id="estado-medicos"
                            value={estado}
                            onChange={(event) =>
                                setEstado(
                                    event.target
                                        .value as
                                        | "todos"
                                        | "activos"
                                        | "inactivos"
                                )
                            }
                            className="h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="todos">
                                Todos
                            </option>

                            <option value="activos">
                                Activos
                            </option>

                            <option value="inactivos">
                                Inactivos
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ======================================== */}
            {/* CONTADOR */}
            {/* ======================================== */}

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 px-2 text-xs font-bold text-white shadow-md">
                    {filteredMedicos.length}
                </span>

                <span>
                    {filteredMedicos.length === 1
                        ? "médico encontrado"
                        : "médicos encontrados"}
                </span>

                {hasFilters && (
                    <span className="text-slate-400">
                        de {medicos.length} registrados
                    </span>
                )}
            </div>

            {/* ======================================== */}
            {/* TABLA */}
            {/* ======================================== */}

            {filteredMedicos.length > 0 ? (
                <MedicoTable
                    medicos={filteredMedicos}
                    onView={handleView}
                    onEdit={handleEdit}
                    onToggleStatus={
                        handleToggleStatus
                    }
                    onDeletePermanent={
                        handleDeletePermanent
                    }
                />
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <Search
                            size={26}
                            className="text-slate-400"
                        />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                        No se encontraron médicos
                    </h3>

                    <p className="mt-1 max-w-md text-sm text-slate-500">
                        No hay médicos que coincidan
                        con los filtros seleccionados.
                    </p>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            <X size={16} />
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}

            {/* ======================================== */}
            {/* DIALOG DETALLE DEL MÉDICO */}
            {/* ======================================== */}

            <Dialog
                open={isDetailOpen}
                onOpenChange={(open) => {
                    setIsDetailOpen(open);

                    if (!open) {
                        setSelectedMedico(null);
                    }
                }}
            >
                <DialogContent
                    size="3xl"
                    className="max-h-[90vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                                <Eye
                                    size={24}
                                    className="text-blue-200"
                                />

                                Ficha del médico
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-blue-100">
                                Información detallada del médico.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="bg-slate-50/50 p-6">
                        {selectedMedico && (
                            <MedicoDetail
                                medico={selectedMedico}
                                showActions={false}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ======================================== */}
            {/* DIALOG CAMBIO DE ESTADO */}
            {/* ======================================== */}

            <AlertDialog
                open={isToggleOpen}
                onOpenChange={(open) => {
                    setIsToggleOpen(open);

                    if (!open) {
                        setSelectedMedico(null);
                    }
                }}
            >
                <AlertDialogContent
                    size="lg"
                    className="p-6"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle
                            className={`flex items-center gap-3 text-xl font-bold ${
                                selectedIsActive
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                            }`}
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    selectedIsActive
                                        ? "bg-amber-100"
                                        : "bg-emerald-100"
                                }`}
                            >
                                {selectedIsActive ? (
                                    <Ban
                                        size={20}
                                        className="text-amber-600"
                                    />
                                ) : (
                                    <CheckCircle
                                        size={20}
                                        className="text-emerald-600"
                                    />
                                )}
                            </div>

                            {selectedIsActive
                                ? "¿Desactivar médico?"
                                : "¿Activar médico?"}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-slate-600">
                            Estás a punto de{" "}
                            {selectedIsActive
                                ? "desactivar"
                                : "activar"}{" "}
                            al médico{" "}
                            <strong className="text-slate-900">
                                {selectedMedico?.nombre}{" "}
                                {selectedMedico?.apellido}
                            </strong>
                            .

                            <br />

                            {selectedIsActive
                                ? "El médico quedará inactivo y no estará disponible para nuevas operaciones."
                                : "El médico volverá a estar activo y disponible para nuevas operaciones."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={
                                toggleStatusMutation.isPending
                            }
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium"
                        >
                            Cancelar
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();

                                void handleToggleStatusConfirm();
                            }}
                            disabled={
                                toggleStatusMutation.isPending
                            }
                            className={
                                selectedIsActive
                                    ? "rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-medium text-white shadow-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                                    : "rounded-xl bg-linear-to-r from-emerald-500 to-green-600 px-5 py-2.5 font-medium text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
                            }
                        >
                            {toggleStatusMutation.isPending
                                ? selectedIsActive
                                    ? "Desactivando..."
                                    : "Activando..."
                                : selectedIsActive
                                  ? "Desactivar médico"
                                  : "Activar médico"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ======================================== */}
            {/* DIALOG BORRADO FÍSICO */}
            {/* ======================================== */}

            <AlertDialog
                open={isDeletePermanentOpen}
                onOpenChange={(open) => {
                    setIsDeletePermanentOpen(open);

                    if (!open) {
                        setSelectedMedico(null);
                    }
                }}
            >
                <AlertDialogContent
                    size="lg"
                    className="p-6"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <Trash2
                                    size={20}
                                    className="text-red-600"
                                />
                            </div>

                            ¿Eliminar definitivamente?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-slate-600">
                            Estás a punto de eliminar
                            definitivamente al médico{" "}
                            <strong className="text-slate-900">
                                {selectedMedico?.nombre}{" "}
                                {selectedMedico?.apellido}
                            </strong>
                            .

                            <br />

                            <span className="font-semibold text-red-600">
                                Esta acción no se puede
                                deshacer.
                            </span>{" "}
                            El registro será eliminado
                            completamente de la base de
                            datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <p className="text-sm text-red-700">
                            Solo deberías utilizar esta
                            opción cuando estés seguro de
                            que el médico ya no necesita
                            conservarse.
                        </p>
                    </div>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={
                                deletePermanentMutation.isPending
                            }
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium"
                        >
                            Cancelar
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();

                                void handleDeletePermanentConfirm();
                            }}
                            disabled={
                                deletePermanentMutation.isPending
                            }
                            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-2.5 font-medium text-white shadow-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50"
                        >
                            {deletePermanentMutation.isPending
                                ? "Eliminando..."
                                : "Eliminar definitivamente"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}