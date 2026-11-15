
import {
    Eye,
    MoreHorizontal,
    Stethoscope,
    Trash2,
    UserRound,
    Users,
    Pencil,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Usuario } from "@/types/usuario";

// ============================================
// OBTENER NOMBRE DEL MÉDICO
// ============================================

function obtenerNombreMedico(
    medico: Usuario["medico"]
): string {
    if (!medico) {
        return "Sin médico asociado";
    }

    if (typeof medico === "string") {
        return "Médico asociado";
    }

    return medico.nombre;
}

// ============================================
// ESTADO DEL USUARIO
// ============================================

function EstadoBadge({ activo }: { activo: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                activo
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {activo ? "Activo" : "Inactivo"}
        </span>
    );
}

// ============================================
// ROL DEL USUARIO
// ============================================

function RolBadge({ rol }: { rol: Usuario["rol"] }) {
    const estilos = {
        admin: "bg-purple-100 text-purple-700",
        medico: "bg-blue-100 text-blue-700",
        recepcionista: "bg-amber-100 text-amber-700",
    };

    const etiquetas = {
        admin: "Administrador",
        medico: "Médico",
        recepcionista: "Recepcionista",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[rol]}`}
        >
            {etiquetas[rol]}
        </span>
    );
}

// ============================================
// PROPS
// ============================================

interface UsuarioTableProps {
    usuarios: Usuario[];
    onView: (usuario: Usuario) => void;
    onEdit: (usuario: Usuario) => void;
    onDelete: (usuario: Usuario) => void;
}

// ============================================
// TABLA DE USUARIOS
// ============================================

export function UsuarioTable({
    usuarios,
    onView,
    onEdit,
    onDelete,
}: UsuarioTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 text-left">
                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Usuario
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Rol
                        </th>

                        <th className="px-6 py-3.5 font-semibold text-slate-600">
                            Médico asociado
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
                    {usuarios.map((usuario) => (
                        <tr
                            key={usuario._id}
                            className="group transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                        >
                            {/* USUARIO */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                                        <UserRound size={18} />
                                    </div>

                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {usuario.nombre}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {usuario.email}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* ROL */}
                            <td className="px-6 py-4">
                                <RolBadge rol={usuario.rol} />
                            </td>

                            {/* MÉDICO ASOCIADO */}
                            <td className="px-6 py-4">
                                {usuario.rol === "medico" ? (
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Stethoscope
                                            size={15}
                                            className="text-emerald-500"
                                        />

                                        <span>
                                            {obtenerNombreMedico(usuario.medico)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400">
                                        No corresponde
                                    </span>
                                )}
                            </td>

                            {/* ESTADO */}
                            <td className="px-6 py-4">
                                <EstadoBadge activo={usuario.activo} />
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
                                            onClick={() => onView(usuario)}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-blue-50"
                                        >
                                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                            Ver usuario
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => onEdit(usuario)}
                                            disabled={!usuario.activo}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-amber-50"
                                        >
                                            <Pencil className="mr-2 h-4 w-4 text-amber-600" />
                                            Editar usuario
                                        </DropdownMenuItem>

                                        {usuario.activo && (
                                            <>
                                                <DropdownMenuSeparator className="my-1" />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onClick={() => onDelete(usuario)}
                                                    className="cursor-pointer rounded-lg transition-colors hover:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                                    Desactivar usuario
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
                <Users className="h-10 w-10 text-slate-400" />
            </div>

            <p className="text-lg font-medium text-slate-700">
                {search
                    ? "No se encontraron usuarios"
                    : "No hay usuarios registrados"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
                {search
                    ? "Probá con otro nombre, correo electrónico o rol."
                    : "Los usuarios aparecerán aquí cuando sean registrados."}
            </p>

            {!search && (
                <button
                    onClick={onCreate}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                    <Users size={17} />
                    Registrar primer usuario
                </button>
            )}
        </div>
    );
}
