import {
    IdCard,
    Phone,
    Search,
    UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { InfoCard } from "@/components/pacientes/PacienteInfoCards";

import type { Paciente } from "@/types/paciente";

// ============================================================
// TIPOS
// ============================================================

export interface PacienteIdentificadoCardProps {
    paciente: Paciente;
    onCambiarPaciente: () => void;
    deshabilitado?: boolean;
}

// ============================================================
// COMPONENTE
// ============================================================

export default function PacienteIdentificadoCard({
    paciente,
    onCambiarPaciente,
    deshabilitado = false,
}: PacienteIdentificadoCardProps) {
    const nombre =
        paciente.nombre?.trim() || "Sin nombre registrado";

    const dni =
        paciente.dni?.trim() || "No registrado";

    const codigoArea =
        paciente.telefono?.codigoArea?.trim() ?? "";

    const numero =
        paciente.telefono?.numero?.trim() ?? "";

    const telefono =
        codigoArea || numero
            ? `${codigoArea} ${numero}`.trim()
            : "No registrado";

    return (
        <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
            <div className="flex flex-col gap-4 border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                        <UserCheck size={21} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Paciente existente
                        </p>

                        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                            {nombre}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                            Identificado por DNI
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCambiarPaciente}
                    disabled={deshabilitado}
                    className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Search size={16} />
                    Cambiar paciente
                </Button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
                <InfoCard
                    icon={<IdCard size={16} />}
                    label="DNI"
                    value={dni}
                />

                <InfoCard
                    icon={<Phone size={16} />}
                    label="Teléfono"
                    value={telefono}
                />
            </div>
        </section>
    );
}
