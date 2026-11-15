import { useState } from "react";
import { FileText, Save, X } from "lucide-react";

import type { Turno } from "@/types/turno";
import type { MedicamentoRecetado } from "@/types/historia-clinica";

import { useCreateHistoriaClinica } from "@/hooks/useHistoriaClinica";

import { crearHistoriaClinicaSchema } from "@/schemas/historia-clinica.schema";

import MedicamentoForm from "./MedicamentoForm";

// ============================================================
// PROPS
// ============================================================

interface HistoriaClinicaFormProps {
    turno: Turno;
    onCancel: () => void;
    onCreated: () => void;
}

// ============================================================
// MEDICAMENTO VACÍO
// ============================================================

function crearMedicamentoVacio(): MedicamentoRecetado {
    return {
        nombre: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        indicaciones: "",
    };
}

function construirMedicamento(
    datos: MedicamentoRecetado
): MedicamentoRecetado | null {
    const nombre = datos.nombre.trim();
    const dosis = datos.dosis.trim();
    const frecuencia = datos.frecuencia.trim();

    if (!nombre || !dosis || !frecuencia) {
        return null;
    }

    const medicamento: MedicamentoRecetado = {
        nombre,
        dosis,
        frecuencia,
    };

    const duracion = datos.duracion?.trim();
    const indicaciones = datos.indicaciones?.trim();

    if (duracion) {
        medicamento.duracion = duracion;
    }

    if (indicaciones) {
        medicamento.indicaciones = indicaciones;
    }

    return medicamento;
}

function tieneDatosMedicamento(datos: MedicamentoRecetado): boolean {
    return Object.values(datos).some(
        (valor) => typeof valor === "string" && valor.trim() !== ""
    );
}

// ============================================================
// FECHA LOCAL PARA INPUT DATETIME-LOCAL
// ============================================================

function obtenerFechaLocal(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
}

// ============================================================
// FORMULARIO DE HISTORIA CLÍNICA
// ============================================================

export default function HistoriaClinicaForm({
    turno,
    onCancel,
    onCreated,
}: HistoriaClinicaFormProps) {
    // ============================================
    // ESTADOS DEL FORMULARIO
    // ============================================

    const [fechaAtencion, setFechaAtencion] = useState(obtenerFechaLocal());
    const [observaciones, setObservaciones] = useState("");
    const [medicamentos, setMedicamentos] = useState<MedicamentoRecetado[]>([]);
    const [medicamentoActual, setMedicamentoActual] =
        useState<MedicamentoRecetado>(crearMedicamentoVacio);
    const [errorMedicamento, setErrorMedicamento] = useState("");
    const [error, setError] = useState("");

    // ============================================
    // MUTACIÓN
    // ============================================

    const { mutateAsync, isPending } = useCreateHistoriaClinica();

    // ============================================
    // MANEJO DEL RECETARIO
    // ============================================

    function actualizarCampoMedicamento(
        campo: keyof MedicamentoRecetado,
        valor: string
    ) {
        setMedicamentoActual((actual) => ({
            ...actual,
            [campo]: valor,
        }));

        setErrorMedicamento("");
    }

    function agregarMedicamento() {
        const nuevoMedicamento = construirMedicamento(medicamentoActual);

        if (!nuevoMedicamento) {
            setErrorMedicamento(
                "Completá el nombre, la dosis y la frecuencia para agregar el medicamento."
            );
            return;
        }

        setMedicamentos([...medicamentos, nuevoMedicamento]);
        setMedicamentoActual(crearMedicamentoVacio());
        setErrorMedicamento("");
    }

    function eliminarMedicamento(index: number) {
        setMedicamentos(
            medicamentos.filter((_, i) => i !== index)
        );
    }

    function obtenerRecetarioParaEnviar(): MedicamentoRecetado[] | null {
        const medicamentoPendiente =
            construirMedicamento(medicamentoActual);

        if (medicamentoPendiente) {
            return [...medicamentos, medicamentoPendiente];
        }

        // Si el usuario empezó a cargar un medicamento pero no lo agregó,
        // no se descarta silenciosamente: se le pide completarlo o limpiarlo.
        if (tieneDatosMedicamento(medicamentoActual)) {
            setErrorMedicamento(
                "Completá el nombre, la dosis y la frecuencia del medicamento pendiente."
            );

            return null;
        }

        return medicamentos;
    }

    // ============================================
    // REGISTRAR HISTORIA CLÍNICA
    // ============================================

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!observaciones.trim()) {
            setError("Las observaciones médicas son obligatorias.");
            return;
        }

        const recetario = obtenerRecetarioParaEnviar();

        if (!recetario) {
            setError(
                "Revisá el medicamento pendiente antes de guardar la historia clínica."
            );
            return;
        }

        const datos = crearHistoriaClinicaSchema.safeParse({
            paciente: turno.paciente.id,
            medico: turno.medico.id,
            fechaAtencion: new Date(fechaAtencion).toISOString(),
            observaciones,
            recetario,
        });

        if (!datos.success) {
            setError(
                datos.error.issues[0]?.message ??
                    "Revisá los datos de la historia clínica."
            );
            return;
        }

        try {
            await mutateAsync(datos.data);

            onCreated();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo registrar la historia clínica."
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* ENCABEZADO */}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Nueva historia clínica
                        </h2>

                        <p className="text-sm text-slate-500">
                            Registro de atención médica del paciente.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
                    title="Cerrar formulario"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* DATOS DEL TURNO */}

            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-medium uppercase text-slate-500">
                        Paciente
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                        {turno.paciente.nombre}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase text-slate-500">
                        Médico responsable
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                        Dr. {turno.medico.nombre} {turno.medico.apellido}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase text-slate-500">
                        Especialidad
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                        {turno.especialidad.nombre}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase text-slate-500">
                        Fecha del turno
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                        {new Date(turno.fechaTurno).toLocaleString("es-AR", {
                            dateStyle: "short",
                            timeStyle: "short",
                            timeZone: "America/Argentina/Buenos_Aires",
                        })}
                    </p>
                </div>
            </div>

            {/* FECHA DE ATENCIÓN */}

            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Fecha y hora de atención *
                </label>

                <input
                    type="datetime-local"
                    value={fechaAtencion}
                    onChange={(e) => setFechaAtencion(e.target.value)}
                    required
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* OBSERVACIONES MÉDICAS */}

            <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Observaciones médicas *
                </label>

                <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Describí el diagnóstico, síntomas, evolución y demás observaciones de la atención..."
                    rows={5}
                    maxLength={2000}
                    required
                    className="w-full resize-y rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                    {observaciones.length}/2000 caracteres
                </p>
            </div>

            {/* RECETARIO */}

            <MedicamentoForm
                medicamentos={medicamentos}
                medicamentoActual={medicamentoActual}
                error={errorMedicamento}
                onCampoChange={actualizarCampoMedicamento}
                onAgregar={agregarMedicamento}
                onEliminar={eliminarMedicamento}
            />

            {/* MENSAJE DE ERROR */}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* ACCIONES */}

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />

                    {isPending ? "Guardando..." : "Registrar historia clínica"}
                </button>
            </div>
        </form>
    );
}
