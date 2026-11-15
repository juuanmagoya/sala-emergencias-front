import { Plus, Trash2, Pill } from "lucide-react";

import type { MedicamentoRecetado } from "@/types/historia-clinica";

// ============================================================
// PROPS
// ============================================================

interface MedicamentoFormProps {
    medicamentos: MedicamentoRecetado[];
    medicamentoActual: MedicamentoRecetado;
    error: string;
    onCampoChange: (campo: keyof MedicamentoRecetado, valor: string) => void;
    onAgregar: () => void;
    onEliminar: (index: number) => void;
}

// ============================================================
// FORMULARIO DE MEDICAMENTOS
// ============================================================

export default function MedicamentoForm({
    medicamentos,
    medicamentoActual,
    error,
    onCampoChange,
    onAgregar,
    onEliminar,
}: MedicamentoFormProps) {

    // ============================================
    // AGREGAR CON ENTER SIN ENVIAR LA HISTORIA
    // ============================================

    function manejarTecla(e: React.KeyboardEvent<HTMLDivElement>) {
        if (
            e.key !== "Enter" ||
            e.nativeEvent.isComposing ||
            !(e.target instanceof HTMLInputElement)
        ) {
            return;
        }

        e.preventDefault();
        onAgregar();
    }

    return (
        <div className="space-y-5">

            {/* ENCABEZADO */}

            <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-600" />

                <div>
                    <h3 className="font-semibold text-slate-900">
                        Recetario
                    </h3>

                    <p className="text-sm text-slate-500">
                        Agregá los medicamentos indicados al paciente.
                    </p>
                </div>
            </div>

            {/* FORMULARIO */}

            <div
                onKeyDown={manejarTecla}
                className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
                <div className="grid gap-4 sm:grid-cols-2">

                    {/* NOMBRE */}

                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Medicamento *
                        </label>

                        <input
                            type="text"
                            value={medicamentoActual.nombre}
                            onChange={(e) =>
                                onCampoChange("nombre", e.target.value)
                            }
                            placeholder="Ej. Ibuprofeno"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* DOSIS */}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Dosis *
                        </label>

                        <input
                            type="text"
                            value={medicamentoActual.dosis}
                            onChange={(e) =>
                                onCampoChange("dosis", e.target.value)
                            }
                            placeholder="Ej. 400 mg"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* FRECUENCIA */}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Frecuencia *
                        </label>

                        <input
                            type="text"
                            value={medicamentoActual.frecuencia}
                            onChange={(e) =>
                                onCampoChange("frecuencia", e.target.value)
                            }
                            placeholder="Ej. Cada 8 horas"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* DURACIÓN */}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Duración
                        </label>

                        <input
                            type="text"
                            value={medicamentoActual.duracion}
                            onChange={(e) =>
                                onCampoChange("duracion", e.target.value)
                            }
                            placeholder="Ej. 5 días"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* INDICACIONES */}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Indicaciones
                        </label>

                        <input
                            type="text"
                            value={medicamentoActual.indicaciones}
                            onChange={(e) =>
                                onCampoChange("indicaciones", e.target.value)
                            }
                            placeholder="Ej. Tomar después de comer"
                            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onAgregar}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar medicamento
                    </button>
                </div>
            </div>

            {/* LISTA DE MEDICAMENTOS AGREGADOS */}

            {medicamentos.length > 0 && (
                <div className="space-y-3">

                    <h4 className="text-sm font-semibold text-slate-700">
                        Medicamentos agregados ({medicamentos.length})
                    </h4>

                    {medicamentos.map((medicamento, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4"
                        >
                            <div className="min-w-0 space-y-1">
                                <p className="font-semibold text-slate-900">
                                    {medicamento.nombre}
                                </p>

                                <p className="text-sm text-slate-600">
                                    {medicamento.dosis} · {medicamento.frecuencia}
                                </p>

                                {medicamento.duracion && (
                                    <p className="text-xs text-slate-500">
                                        Duración: {medicamento.duracion}
                                    </p>
                                )}

                                {medicamento.indicaciones && (
                                    <p className="text-xs text-slate-500">
                                        {medicamento.indicaciones}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => onEliminar(index)}
                                title="Eliminar medicamento"
                                className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
