import { useMemo } from "react";
import {
    AlertCircle,
    CalendarDays,
    FileText,
    LoaderCircle,
    Pill,
    Stethoscope,
    UserRound,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useHistorialPaciente } from "@/hooks/useHistoriaClinica";

import type {
    HistoriaClinica,
    MedicamentoRecetado,
} from "@/types/historia-clinica";

// ============================================================
// PROPS
// ============================================================

interface HistorialClinicoPanelProps {
    pacienteId: string | null;
    pacienteNombre?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// ============================================================
// FORMATO DE FECHA
// ============================================================

function formatearFechaAtencion(fecha: string): string {
    const fechaAtencion = new Date(fecha);

    if (Number.isNaN(fechaAtencion.getTime())) {
        return "Fecha no disponible";
    }

    return fechaAtencion.toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Argentina/Buenos_Aires",
    });
}

// ============================================================
// DATOS DEL MÉDICO
// ============================================================

function obtenerNombreMedico(
    medico: HistoriaClinica["medico"]
): string {
    if (!medico) {
        return "Médico no disponible";
    }

    return [medico.nombre, medico.apellido]
        .filter(Boolean)
        .join(" ");
}

// ============================================================
// MEDICAMENTO DEL RECETARIO
// ============================================================

function MedicamentoItem({
    medicamento,
}: {
    medicamento: MedicamentoRecetado;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-medium text-slate-900">
                {medicamento.nombre}
            </p>

            <p className="mt-0.5 text-sm text-slate-600">
                {medicamento.dosis} · {medicamento.frecuencia}
            </p>

            {(medicamento.duracion || medicamento.indicaciones) && (
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                    {medicamento.duracion && (
                        <p>Duración: {medicamento.duracion}</p>
                    )}

                    {medicamento.indicaciones && (
                        <p>Indicaciones: {medicamento.indicaciones}</p>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function HistorialClinicoPanel({
    pacienteId,
    pacienteNombre,
    open,
    onOpenChange,
}: HistorialClinicoPanelProps) {
    const {
        data: respuesta,
        isLoading,
        isError,
        error,
    } = useHistorialPaciente(pacienteId ?? "");

    // El backend ya devuelve el historial ordenado. Se ordena también acá
    // para que la vista no dependa del orden de la respuesta.
    const historias = useMemo(() => {
        const datos = respuesta?.data ?? [];

        return [...datos].sort((primera, segunda) => {
            const fechaPrimera = new Date(primera.fechaAtencion).getTime();
            const fechaSegunda = new Date(segunda.fechaAtencion).getTime();

            return fechaSegunda - fechaPrimera;
        });
    }, [respuesta]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                size="3xl"
                className="max-h-[90vh] overflow-y-auto p-0"
            >
                {/* ENCABEZADO */}

                <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-blue-600 to-indigo-600 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                            <FileText className="h-6 w-6 text-blue-200" />
                            Historial clínico
                        </DialogTitle>

                        <DialogDescription className="mt-1 text-blue-100">
                            {pacienteNombre
                                ? `Historias clínicas de ${pacienteNombre}.`
                                : "Historias clínicas del paciente."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* CONTENIDO */}

                <div className="bg-slate-50/50 p-6">
                    {isLoading && (
                        <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
                            <LoaderCircle className="h-5 w-5 animate-spin" />

                            <span className="text-sm">
                                Cargando historial clínico...
                            </span>
                        </div>
                    )}

                    {!isLoading && isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                <div>
                                    <p className="font-semibold text-red-800">
                                        No se pudo cargar el historial clínico
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        {error instanceof Error
                                            ? error.message
                                            : "Ocurrió un error al consultar las historias del paciente."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoading && !isError && historias.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FileText className="h-7 w-7" />
                            </div>

                            <h3 className="text-base font-semibold text-slate-800">
                                Sin historias clínicas
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                Este paciente todavía no tiene historias
                                clínicas registradas.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && historias.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-slate-500">
                                {historias.length}{" "}
                                {historias.length === 1
                                    ? "historia clínica registrada"
                                    : "historias clínicas registradas"}
                            </p>

                            {historias.map((historia) => (
                                <article
                                    key={historia.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    {/* FECHA Y MÉDICO */}

                                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase text-slate-500">
                                                    Fecha de atención
                                                </p>

                                                <p className="mt-1 font-semibold text-slate-900">
                                                    {formatearFechaAtencion(
                                                        historia.fechaAtencion
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                                <UserRound className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium uppercase text-slate-500">
                                                    Médico responsable
                                                </p>

                                                <p className="mt-1 font-medium text-slate-900">
                                                    {obtenerNombreMedico(
                                                        historia.medico
                                                    )}
                                                </p>

                                                {historia.medico?.matricula && (
                                                    <p className="text-xs text-slate-500">
                                                        Matrícula{" "}
                                                        {
                                                            historia.medico
                                                                .matricula
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* OBSERVACIONES */}

                                    <div className="mt-4">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Stethoscope className="h-4 w-4 text-slate-400" />
                                            Observaciones médicas
                                        </h3>

                                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                            {historia.observaciones?.trim() ||
                                                "Sin observaciones registradas."}
                                        </p>
                                    </div>

                                    {/* RECETARIO */}

                                    <div className="mt-4">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <Pill className="h-4 w-4 text-slate-400" />
                                            Recetario
                                        </h3>

                                        {historia.recetario &&
                                        historia.recetario.length > 0 ? (
                                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                                {historia.recetario.map(
                                                    (medicamento, indice) => (
                                                        <MedicamentoItem
                                                            key={`${historia.id}-${indice}`}
                                                            medicamento={
                                                                medicamento
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-sm text-slate-500">
                                                Sin medicamentos recetados.
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
