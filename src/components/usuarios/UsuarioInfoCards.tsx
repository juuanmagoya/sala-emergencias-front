
import {
    Users,
    Stethoscope,
    UserRound,
    UserCheck,
} from "lucide-react";

import type { Usuario } from "@/types/usuario";

// ============================================
// PROPS
// ============================================

interface UsuarioInfoCardsProps {
    usuarios: Usuario[];
}

// ============================================
// TARJETAS INFORMATIVAS DE USUARIOS
// ============================================

export function UsuarioInfoCards({
    usuarios,
}: UsuarioInfoCardsProps) {

    // ============================================
    // CALCULAR ESTADÍSTICAS
    // ============================================

    const totalUsuarios = usuarios.length;

    const totalMedicos = usuarios.filter(
        (usuario) => usuario.rol === "medico"
    ).length;

    const totalRecepcionistas = usuarios.filter(
        (usuario) => usuario.rol === "recepcionista"
    ).length;

    const totalActivos = usuarios.filter(
        (usuario) => usuario.activo
    ).length;

    // ============================================
    // DEFINICIÓN DE TARJETAS
    // ============================================

    const cards = [
        {
            title: "Total de usuarios",
            value: totalUsuarios,
            description: "Cuentas registradas",
            icon: Users,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            borderColor: "border-blue-200",
        },
        {
            title: "Médicos",
            value: totalMedicos,
            description: "Cuentas de médicos",
            icon: Stethoscope,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-100",
            borderColor: "border-emerald-200",
        },
        {
            title: "Recepcionistas",
            value: totalRecepcionistas,
            description: "Cuentas de recepción",
            icon: UserRound,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-100",
            borderColor: "border-amber-200",
        },
        {
            title: "Usuarios activos",
            value: totalActivos,
            description: "Cuentas habilitadas",
            icon: UserCheck,
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-100",
            borderColor: "border-indigo-200",
        },
    ];

    // ============================================
    // RENDERIZADO
    // ============================================

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`rounded-2xl border ${card.borderColor} bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {card.title}
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {card.value}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {card.description}
                                </p>
                            </div>

                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                            >
                                <Icon
                                    size={24}
                                    className={card.iconColor}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
