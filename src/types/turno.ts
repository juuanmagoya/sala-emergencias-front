
import type { Paciente } from "@/types/paciente";
import type { Especialidad } from "@/types/especialidad";

// ============================================================
// ESTADOS DEL TURNO
// ============================================================

export type EstadoTurno =
    | "pendiente"
    | "atendido"
    | "cancelado";

// ============================================================
// MÉDICO ASOCIADO AL TURNO
// ============================================================

export interface MedicoTurno {
    id: string;
    nombre: string;
    apellido: string;
    matricula: string;
    especialidad: string;
    email: string;
    activo: boolean;
    duracionTurno: number;
}

// ============================================================
// TURNO
// ============================================================

export interface Turno {
    id: string;
    paciente: Paciente;
    especialidad: Especialidad;
    medico: MedicoTurno;
    fechaTurno: string;
    fechaFin: string;
    estado: EstadoTurno;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// CREAR TURNO
// ============================================================

export interface CrearTurnoData {
    paciente: string;
    especialidad: string;
    medico: string;
    fechaTurno: string;
    observaciones?: string;
}

// ============================================================
// DISPONIBILIDAD
// ============================================================

export interface HorarioDisponible {
    inicio: string;
    fin: string;
    horaLocal: string;
}

export interface DisponibilidadTurno {
    medicoId: string;
    fecha: string;
    zonaHoraria: string;
    duracionTurno: number;
    horarios: HorarioDisponible[];
}

// ============================================================
// PORTAL DEL PACIENTE
// ============================================================

/**
 * Datos permitidos para reservar un turno desde el portal.
 *
 * El paciente se resuelve desde el JWT y no se envía en el body.
 */
export interface CrearMiTurnoData {
    especialidad: string;
    medico: string;
    fechaTurno: string;
    observaciones?: string;
}

/**
 * Respuesta exacta de POST /turnos/mi-turno.
 *
 * No incluye paciente, activo ni timestamps. La especialidad y el
 * médico vienen con una proyección mínima.
 */
export interface MiTurno {
    id: string;
    fechaTurno: string;
    fechaFin: string;
    estado: EstadoTurno;
    observaciones?: string;
    especialidad: {
        id: string;
        nombre: string;
    };
    medico: {
        id: string;
        nombre: string;
        apellido: string;
        matricula: string;
    };
}

/**
 * Especialidad reducida que devuelve GET /turnos/mi-historial.
 */
export interface EspecialidadHistorial {
    id: string;
    nombre: string;
}

/**
 * Médico reducido que devuelve GET /turnos/mi-historial.
 *
 * La matrícula puede faltar en documentos antiguos.
 */
export interface MedicoHistorial {
    id: string;
    nombre: string;
    apellido: string;
    matricula?: string | null;
}

/**
 * Turno del historial del paciente autenticado.
 *
 * Los campos opcionales reflejan documentos legacy: el backend puede
 * omitir estado, fechaFin, observaciones o las referencias pobladas.
 */
export interface MiTurnoHistorial {
    id: string;
    fechaTurno: string;
    fechaFin?: string | null;
    estado?: EstadoTurno | null;
    observaciones?: string | null;
    especialidad?: EspecialidadHistorial | null;
    medico?: MedicoHistorial | null;
}
