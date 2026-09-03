import { Eye, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Paciente } from "@/types/paciente";

interface PacienteTableProps {
    pacientes: Paciente[];
    onView: (paciente: Paciente) => void;
    onEdit: (paciente: Paciente) => void;
    onDelete: (paciente: Paciente) => void;
}

export function PacienteTable({ pacientes, onView, onEdit, onDelete }: PacienteTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 text-left">
                        <th className="px-6 py-3.5 font-semibold text-slate-600">Paciente</th>
                        <th className="px-6 py-3.5 font-semibold text-slate-600">DNI</th>
                        <th className="px-6 py-3.5 font-semibold text-slate-600">Teléfono</th>
                        <th className="px-6 py-3.5 font-semibold text-slate-600">Obra social</th>
                        <th className="px-6 py-3.5 text-right font-semibold text-slate-600">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {pacientes.map((paciente) => (
                        <tr key={paciente.id} className="transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-indigo-50/50 group">
                            {/* Paciente */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-md">
                                        {paciente.nombre.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{paciente.nombre}</p>
                                        <p className="text-xs text-slate-400">{paciente.email}</p>
                                    </div>
                                </div>
                            </td>
                            
                            {/* DNI */}
                            <td className="px-6 py-4 font-medium text-slate-700">{paciente.dni}</td>
                            
                            {/* Teléfono */}
                            <td className="px-6 py-4 text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                    <span className="text-xs text-slate-400">
                                        ({paciente.telefono.codigoArea})
                                    </span>
                                    {paciente.telefono.numero}
                                </span>
                            </td>
                            
                            {/* Obra social */}
                            <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                    paciente.obraSocial.nombre === "NINGUNA"
                                        ? "bg-slate-100 text-slate-500"
                                        : "bg-linear-to-r from-amber-100 to-orange-100 text-amber-700"
                                }`}>
                                    {paciente.obraSocial.nombre === "NINGUNA"
                                        ? "Sin cobertura"
                                        : paciente.obraSocial.nombre}
                                </span>
                            </td>
                            
                            {/* Acciones */}
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group-hover:bg-blue-50">
                                        <MoreHorizontal size={18} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-2 border-slate-200 shadow-lg">
                                        <DropdownMenuItem
                                            onClick={() => onView(paciente)}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-blue-50"
                                        >
                                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                            Ver paciente
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onEdit(paciente)}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-amber-50"
                                        >
                                            <Pencil className="mr-2 h-4 w-4 text-amber-600" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1" />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => onDelete(paciente)}
                                            className="cursor-pointer rounded-lg transition-colors hover:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                            Eliminar
                                        </DropdownMenuItem>
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

export function EmptyState({ search, onCreate }: { search: string; onCreate: () => void }) {
    return (
        <div className="p-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200">
                <Users className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-700">
                {search ? "No se encontraron pacientes" : "No hay pacientes registrados"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
                {search
                    ? "Probá con otro nombre, DNI o correo electrónico."
                    : "Los pacientes aparecerán aquí cuando sean registrados."}
            </p>
            {!search && (
                <button
                    onClick={onCreate}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                    <Users size={17} />
                    Registrar primer paciente
                </button>
            )}
        </div>
    );
}