import { useMemo, useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

import type { EstadoTurno, Turno } from "@/types/turno";

import { useMisTurnos } from "@/hooks/useTurnos";

import AgendaMedicoHeader from "@/components/agenda-medico/AgendaMedicoHeader";
import AgendaMedicoInfoCards from "@/components/agenda-medico/AgendaMedicoInfoCards";
import AgendaMedicoFilters from "@/components/agenda-medico/AgendaMedicoFilters";
import AgendaMedicoTable from "@/components/agenda-medico/AgendaMedicoTable";
import HistoriaClinicaForm from "@/components/agenda-medico/HistoriaClinicaForm";
import HistorialClinicoPanel from "@/components/agenda-medico/HistorialClinicoPanel";

// ============================================================
// PACIENTE SELECCIONADO PARA CONSULTAR SU HISTORIAL
// ============================================================

interface PacienteHistorialSeleccionado {
    id: string;
    nombre: string;
}

// ============================================================
// OBTENER FECHA ACTUAL
// ============================================================

function obtenerFechaActual(): string {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

// ============================================================
// OBTENER FECHA DE UN TURNO EN ZONA HORARIA ARGENTINA
// ============================================================

function obtenerFechaTurno(fecha: string): string {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(fecha));

    const anio = partes.find((parte) => parte.type === "year")?.value;
    const mes = partes.find((parte) => parte.type === "month")?.value;
    const dia = partes.find((parte) => parte.type === "day")?.value;

    return `${anio}-${mes}-${dia}`;
}

// ============================================================
// PÁGINA DE AGENDA MÉDICA
// ============================================================

export default function AgendaMedicoPage() {
    // ============================================
    // CONSULTA DE TURNOS DEL MÉDICO AUTENTICADO
    // ============================================

const {
    data: respuesta,
    isLoading,
    isError,
    error,
} = useMisTurnos();



    // ============================================
    // ESTADOS DE FILTROS
    // ============================================

    const [fechaSeleccionada, setFechaSeleccionada] =
        useState(obtenerFechaActual());

    const [busqueda, setBusqueda] = useState("");

    const [estadoSeleccionado, setEstadoSeleccionado] =
        useState<EstadoTurno | "todos">("todos");

    // ============================================
    // TURNO SELECCIONADO PARA REGISTRAR HISTORIA
    // ============================================

    const [turnoSeleccionado, setTurnoSeleccionado] =
        useState<Turno | null>(null);

    // ============================================
    // PACIENTE SELECCIONADO PARA CONSULTAR HISTORIAL
    // ============================================

    const [pacienteHistorial, setPacienteHistorial] =
        useState<PacienteHistorialSeleccionado | null>(null);

    // ============================================
    // FILTRAR TURNOS
    // ============================================

    const turnosFiltrados = useMemo(() => {
        // Obtener los turnos de la respuesta de la API.
        const turnos: Turno[] = respuesta?.data ?? [];

        return turnos.filter((turno) => {
            // Filtrar por fecha seleccionada.
            const coincideFecha =
                obtenerFechaTurno(turno.fechaTurno) === fechaSeleccionada;

            // Filtrar por nombre del paciente o especialidad.
            const termino = busqueda.trim().toLowerCase();

            const nombrePaciente =
                turno.paciente.nombre?.toLowerCase() ?? "";

            const nombreEspecialidad =
                turno.especialidad.nombre?.toLowerCase() ?? "";

            const coincideBusqueda =
                !termino ||
                nombrePaciente.includes(termino) ||
                nombreEspecialidad.includes(termino);

            // Filtrar por estado del turno.
            const coincideEstado =
                estadoSeleccionado === "todos" ||
                turno.estado === estadoSeleccionado;

            return coincideFecha && coincideBusqueda && coincideEstado;
        });
    }, [respuesta, fechaSeleccionada, busqueda, estadoSeleccionado]);

    // ============================================
    // LIMPIAR FILTROS
    // ============================================

    function limpiarFiltros() {
        setBusqueda("");
        setEstadoSeleccionado("todos");
    }

    // ============================================
    // CONSULTAR HISTORIAL CLÍNICO DEL PACIENTE
    // ============================================

    function handleVerHistoriasClinicas(turno: Turno) {
        setPacienteHistorial({
            id: turno.paciente.id,
            nombre: turno.paciente.nombre,
        });
    }

    // ============================================
    // FINALIZAR REGISTRO DE HISTORIA CLÍNICA
    // ============================================

    function handleHistoriaCreada() {
        setTurnoSeleccionado(null);
    }

    // ============================================
    // ESTADO DE CARGA
    // ============================================

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <LoaderCircle className="h-6 w-6 animate-spin" />

                    <span className="text-sm">
                        Cargando agenda médica...
                    </span>
                </div>
            </div>
        );
    }

    // ============================================
    // ERROR DE CONSULTA
    // ============================================

    if (isError) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

                    <h2 className="font-semibold text-red-800">
                        No se pudo cargar la agenda
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error instanceof Error
                            ? error.message
                            : "Ocurrió un error al consultar tus turnos."}
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // RENDERIZADO PRINCIPAL
    // ============================================

    return (
        <div className="space-y-6">

            {/* ENCABEZADO Y SELECCIÓN DE FECHA */}

            <AgendaMedicoHeader
                fechaSeleccionada={fechaSeleccionada}
                onFechaChange={setFechaSeleccionada}
            />

            {/* TARJETAS INFORMATIVAS */}

            <AgendaMedicoInfoCards
                turnos={turnosFiltrados}
            />

            {/* FILTROS */}

            <AgendaMedicoFilters
                busqueda={busqueda}
                estadoSeleccionado={estadoSeleccionado}
                onBusquedaChange={setBusqueda}
                onEstadoChange={setEstadoSeleccionado}
                onLimpiarFiltros={limpiarFiltros}
            />

            {/* TABLA DE TURNOS */}

            <AgendaMedicoTable
                turnos={turnosFiltrados}
                onNuevaHistoriaClinica={setTurnoSeleccionado}
                onVerHistoriasClinicas={handleVerHistoriasClinicas}
            />

            {/* FORMULARIO DE HISTORIA CLÍNICA */}

            {turnoSeleccionado && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <HistoriaClinicaForm
                        turno={turnoSeleccionado}
                        onCancel={() => setTurnoSeleccionado(null)}
                        onCreated={handleHistoriaCreada}
                    />
                </div>
            )}

            {/* HISTORIAL CLÍNICO DEL PACIENTE */}

            <HistorialClinicoPanel
                pacienteId={pacienteHistorial?.id ?? null}
                pacienteNombre={pacienteHistorial?.nombre}
                open={Boolean(pacienteHistorial)}
                onOpenChange={(open) => {
                    if (!open) {
                        setPacienteHistorial(null);
                    }
                }}
            />

        </div>
    );
}