import {
    CircleCheck,
    Hash,
    IdCard,
    RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { InfoCard } from "@/components/pacientes/PacienteInfoCards";
import { TurnoInfoCards } from "@/components/turnos/TurnoInfoCards";

import type { TurnoRecepcionConfirmado } from "@/types/recepcion";

// ============================================================
// TIPOS
// ============================================================

interface ConfirmacionRecepcionProps {
    turno: TurnoRecepcionConfirmado;
    onNuevaRecepcion: () => void;
}

// ============================================================
// COMPONENTE
// ============================================================

export default function ConfirmacionRecepcion({
    turno,
    onNuevaRecepcion,
}: ConfirmacionRecepcionProps) {
    const dni =
        turno.paciente.dni?.trim() || "No disponible";

    return (
        <div className="space-y-6">
            <section className="relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white shadow-xl shadow-emerald-500/20 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-teal-200/20 blur-2xl"
                />

                <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm">
                        <CircleCheck size={30} />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-50">
                            Ingreso registrado
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            El turno quedó registrado
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
                            {turno.paciente.nombre} · DNI {dni}
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoCard
                        icon={<IdCard size={16} />}
                        label="DNI"
                        value={dni}
                    />

                    <InfoCard
                        icon={<Hash size={16} />}
                        label="Identificador del turno"
                        value={turno.id}
                    />
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                    <TurnoInfoCards turno={turno} />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        onClick={onNuevaRecepcion}
                        className="h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                    >
                        <RotateCcw size={16} />
                        Iniciar nueva recepción
                    </Button>
                </div>
            </section>
        </div>
    );
}
