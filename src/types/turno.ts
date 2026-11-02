
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
