import {
    Users,
    UserPlus,
    Eye,
    Search,
    Trash2,
    Pencil,
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

import {
    useDesactivarUsuario,
    useUsuarios,
} from "@/hooks/useUsuarios";

import type { Usuario } from "@/types/usuario";

import UsuarioForm from "@/components/usuarios/UsuarioForm";

import  UsuarioDetail  from "@/components/usuarios/UsuarioDetail";

import { UsuarioInfoCards } from "@/components/usuarios/UsuarioInfoCards";

import {
    UsuarioTable,
    EmptyState,
} from "@/components/usuarios/UsuarioTable";



// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function UsuariosPage() {
    const { data, isLoading, isError } = useUsuarios();
    const desactivarMutation = useDesactivarUsuario();

    const usuarios = data?.data ?? [];

    // ============================================
    // ESTADOS DE DIÁLOGOS Y SELECCIÓN
    // ============================================

    const [selectedUsuario, setSelectedUsuario] =
        useState<Usuario | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

    const [search, setSearch] = useState("");

    // ============================================
    // FILTRAR USUARIOS
    // ============================================

    const filteredUsuarios = usuarios.filter((usuario) => {
        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) return true;

        const nombre = usuario.nombre?.toLowerCase() ?? "";
        const email = usuario.email?.toLowerCase() ?? "";

        const nombreMedico =
            typeof usuario.medico === "object" && usuario.medico !== null
                ? usuario.medico.nombre.toLowerCase()
                : "";

        return (
            nombre.includes(searchTerm) ||
            email.includes(searchTerm) ||
            nombreMedico.includes(searchTerm) ||
            usuario.rol.includes(searchTerm)
        );
    });

    // ============================================
    // MANEJAR ACCIONES
    // ============================================

    const handleCreate = () => {
        setSelectedUsuario(null);
        setIsFormOpen(true);
    };

    const handleView = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsDetailOpen(true);
    };

    const handleEdit = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsFormOpen(true);
    };

    const handleDeactivateRequest = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsDeactivateOpen(true);
    };

    // ============================================
    // DESACTIVAR USUARIO
    // ============================================

    const handleDeactivate = async () => {
        if (!selectedUsuario) return;

        try {
            await desactivarMutation.mutateAsync(selectedUsuario._id);

            toast.success("Usuario desactivado correctamente", {
                description: `La cuenta de ${selectedUsuario.nombre} fue desactivada.`,
            });

            setIsDeactivateOpen(false);
            setSelectedUsuario(null);
        } catch (error) {
            console.error("Error al desactivar usuario:", error);

            toast.error("No se pudo desactivar el usuario", {
                description: "Ocurrió un error al comunicarse con el servidor.",
            });
        }
    };

    // ============================================
    // RENDERIZADO
    // ============================================

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <Users size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Usuarios
                        </h1>

                        <p className="text-sm text-slate-500">
                            Gestión y administración de usuarios del sistema
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                >
                    <UserPlus size={18} />
                    Nuevo usuario
                </button>
            </div>

            {/* TARJETAS INFORMATIVAS */}

            {!isLoading && !isError && (
                <UsuarioInfoCards usuarios={usuarios} />
            )}

            {/* TABLA */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

                {/* BÚSQUEDA */}

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
                            placeholder="Buscar por nombre, correo, médico o rol..."
                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {filteredUsuarios.length}
                        </span>

                        <span className="text-slate-500">
                            resultados
                        </span>
                    </div>
                </div>

                {/* ESTADOS DE CARGA */}

                {isLoading && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center gap-3 text-sm text-slate-500">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                            Cargando usuarios...
                        </div>
                    </div>
                )}

                {/* ERROR */}

                {isError && (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <span className="text-3xl">⚠️</span>
                        </div>

                        <p className="font-medium text-red-600">
                            No se pudieron cargar los usuarios.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Verificá la conexión con el servidor.
                        </p>
                    </div>
                )}

                {/* TABLA O ESTADO VACÍO */}

                {!isLoading && !isError && (
                    <>
                        {filteredUsuarios.length > 0 ? (
                            <UsuarioTable
                                usuarios={filteredUsuarios}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDeactivateRequest}
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

            {/* TOTAL DE USUARIOS */}

            {!isLoading && !isError && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">
                        {data?.total ?? 0}
                    </span>

                    usuarios registrados
                </div>
            )}

            {/* FORMULARIO DE CREACIÓN Y EDICIÓN */}

            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);

                    if (!open) {
                        setSelectedUsuario(null);
                    }
                }}
            >
                <DialogContent
                    size="5xl"
                    className="max-h-[95vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                                {selectedUsuario ? (
                                    <Pencil size={24} className="text-blue-200" />
                                ) : (
                                    <UserPlus size={24} className="text-blue-200" />
                                )}

                                {selectedUsuario
                                    ? "Editar usuario"
                                    : "Nuevo usuario"}
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-blue-100">
                                {selectedUsuario
                                    ? "Modificá los datos de la cuenta del usuario."
                                    : "Completá los datos para registrar un nuevo usuario."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="bg-slate-50/50 p-6">
                        <UsuarioForm
                            key={selectedUsuario?._id ?? "nuevo"}
                            usuario={selectedUsuario ?? undefined}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setSelectedUsuario(null);
                            }}
                            onSuccess={() => {
                                setIsFormOpen(false);
                                setSelectedUsuario(null);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* DETALLE DEL USUARIO */}

            <Dialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            >
                <DialogContent
                    size="3xl"
                    className="max-h-[90vh] overflow-y-auto p-0"
                >
                    <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                                <Eye size={24} className="text-emerald-200" />
                                Detalle del usuario
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-emerald-100">
                                Información detallada de la cuenta.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="bg-slate-50/50 p-6">
                        {selectedUsuario && (
                            <UsuarioDetail usuario={selectedUsuario} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* CONFIRMAR DESACTIVACIÓN */}

            <AlertDialog
                open={isDeactivateOpen}
                onOpenChange={setIsDeactivateOpen}
            >
                <AlertDialogContent size="lg" className="p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <Trash2 size={20} className="text-red-600" />
                            </div>

                            ¿Desactivar usuario?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-slate-600">
                            Estás a punto de desactivar la cuenta de{" "}
                            <strong className="text-slate-900">
                                {selectedUsuario?.nombre}
                            </strong>
                            . El usuario ya no podrá acceder al sistema, pero
                            sus datos y registros se conservarán.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel
                            disabled={desactivarMutation.isPending}
                            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 font-medium transition-all duration-200 hover:bg-slate-50"
                        >
                            Volver
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void handleDeactivate();
                            }}
                            disabled={desactivarMutation.isPending}
                            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-xl disabled:opacity-50"
                        >
                            {desactivarMutation.isPending
                                ? "Desactivando..."
                                : "Desactivar usuario"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}