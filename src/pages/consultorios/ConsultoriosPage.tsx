import { useState } from "react";
import {
    Plus,
    Stethoscope,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    useConsultorios,
    useDeleteConsultorio,
} from "@/hooks/useConsultorios";

import type { Consultorio } from "@/types/consultorio";

import ConsultorioForm from "@/components/consultorio/ConsultorioForm";
import ConsultorioTable from "@/components/consultorio/ConsultorioTable";
import ConsultorioInfoCards from "@/components/consultorio/ConsultorioInfoCards";

export default function ConsultoriosPage() {
    const {
        data,
        isLoading,
        isError,
    } = useConsultorios();

    const deleteMutation =
        useDeleteConsultorio();

    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const [consultorioSeleccionado, setConsultorioSeleccionado] =
        useState<Consultorio | null>(null);

    const [isViewOpen, setIsViewOpen] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] =
        useState(false);

    const consultorios = data?.data ?? [];

    // ============================================
    // CREAR
    // ============================================

    const handleCreate = () => {
        setConsultorioSeleccionado(null);
        setIsFormOpen(true);
    };

    // ============================================
    // EDITAR
    // ============================================

    const handleEdit = (
        consultorio: Consultorio
    ) => {
        setConsultorioSeleccionado(
            consultorio
        );

        setIsFormOpen(true);
    };

    // ============================================
    // VER
    // ============================================

    const handleView = (consultorio: Consultorio) => {
    setConsultorioSeleccionado(consultorio);
    setIsViewOpen(true);
    };

    // ============================================
    // ELIMINAR
    // ============================================

    const handleDelete = (
        consultorio: Consultorio
    ) => {
        setConsultorioSeleccionado(
            consultorio
        );

        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!consultorioSeleccionado) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(
                consultorioSeleccionado.id
            );

            toast.success(
                "Consultorio eliminado correctamente",
                {
                    description: `${consultorioSeleccionado.nombre} fue eliminado correctamente.`,
                }
            );

            setIsDeleteOpen(false);
            setConsultorioSeleccionado(null);
        } catch (error: unknown) {
            console.error(
                "Error al eliminar consultorio:",
                error
            );

            let errorMessage =
                "Ocurrió un error al comunicarse con el servidor.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (
                typeof error === "object" &&
                error !== null
            ) {
                const apiError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: string;
                        };
                    };
                };

                errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.error ||
                    errorMessage;
            }

            toast.error(
                "No se pudo eliminar el consultorio",
                {
                    description: errorMessage,
                }
            );
        }
    };

    // ============================================
    // FORM SUCCESS
    // ============================================

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setConsultorioSeleccionado(null);
    };

    // ============================================
    // CANCELAR FORMULARIO
    // ============================================

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setConsultorioSeleccionado(null);
    };

    return (
        <div className="space-y-6">
            {/* ================================== */}
            {/* HEADER */}
            {/* ================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Stethoscope
                                size={23}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Consultorios
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Administrá los consultorios
                                disponibles en el centro
                                de salud.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                    <Plus size={18} />
                    Nuevo consultorio
                </button>
            </div>

            {/* ================================== */}
            {/* CONTENIDO */}
            {/* ================================== */}

            {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Cargando consultorios...
                    </p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
                    <p className="font-medium text-red-700">
                        No se pudieron cargar los
                        consultorios.
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        Intentá nuevamente más tarde.
                    </p>
                </div>
            ) : (
                <ConsultorioTable
                    consultorios={consultorios}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* ================================== */}
            {/* MODAL FORMULARIO */}
            {/* ================================== */}

            {/* ================================== */}
            { /* MODAL DETALLE */ }
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {consultorioSeleccionado
                                        ? "Editar consultorio"
                                        : "Nuevo consultorio"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {consultorioSeleccionado
                                        ? "Modificá la información del consultorio."
                                        : "Completá la información para registrar un nuevo consultorio."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleFormCancel
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <ConsultorioForm
                                consultorio={
                                    consultorioSeleccionado
                                }
                                onSuccess={
                                    handleFormSuccess
                                }
                                onCancel={
                                    handleFormCancel
                                }
                            />
                        </div>
                    </div>
                </div>
                        )}
            {isViewOpen && consultorioSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {consultorioSeleccionado.nombre}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Información detallada del consultorio
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsViewOpen(false);
                                    setConsultorioSeleccionado(null);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            <ConsultorioInfoCards
                                consultorio={consultorioSeleccionado}
                            />
                        </div>

                    </div>
                </div>
            )}
            {/* ================================== */}
            {/* MODAL ELIMINACIÓN */}
            {/* ================================== */}

            {isDeleteOpen &&
                consultorioSeleccionado && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Eliminar consultorio
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    ¿Estás seguro de que
                                    querés eliminar el
                                    consultorio{" "}
                                    <span className="font-semibold text-slate-800">
                                        {
                                            consultorioSeleccionado.nombre
                                        }
                                    </span>
                                    ?
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                    El consultorio dejará
                                    de aparecer en el
                                    listado.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDeleteOpen(
                                            false
                                        )
                                    }
                                    disabled={
                                        deleteMutation.isPending
                                    }
                                    className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        confirmDelete
                                    }
                                    disabled={
                                        deleteMutation.isPending
                                    }
                                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deleteMutation.isPending
                                        ? "Eliminando..."
                                        : "Eliminar consultorio"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}