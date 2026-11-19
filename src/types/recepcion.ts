// src/types/recepcion.ts

import type { TipoTelefono } from "@/types/paciente";
import type { EstadoTurno } from "@/types/turno";

// ============================================================
// PACIENTE NUEVO - DATOS MÍNIMOS
// ============================================================

/**
 * Datos mínimos para registrar un paciente desde Recepción.
 *
 * No incluye email, dirección ni obra social.
 */
export interface PacienteMinimoData {
    nombre: string;
    dni: string;
    telefono: {
        codigoArea: string;
        numero: string;
        tipo?: TipoTelefono;
    };
}

// ============================================================
// REGISTRAR INGRESO
// ============================================================

/**
 * Body exacto de POST /recepcion.
 *
 * El servidor calcula fechaFin, duración y estado inicial; además
 * crea el paciente y el turno dentro de una transacción.
 */
export interface CrearIngresoRecepcionData {
    datosPaciente: PacienteMinimoData;
    especialidad: string;
    medico: string;
    fechaTurno: string;
    observaciones?: string;
}

// ============================================================
// RESPUESTA DEL REGISTRO
// ============================================================

/**
 * Datos del paciente que devuelve el turno populado.
 *
 * Un paciente creado desde Recepción puede no tener email,
 * dirección ni obra social, por eso no se reutiliza `Paciente`.
 */
export interface PacienteTurnoRecepcion {
    id: string;
    nombre: string;
    dni: string;
}

export interface EspecialidadTurnoRecepcion {
    id: string;
    nombre: string;
}

export interface MedicoTurnoRecepcion {
    id: string;
    nombre: string;
    apellido: string;
    matricula: string;
}

/**
 * Turno devuelto por POST /recepcion y por POST /turnos.
 *
 * Solo declara los campos que consume la confirmación de Recepción.
 */
export interface TurnoRecepcionConfirmado {
    id: string;
    paciente: PacienteTurnoRecepcion;
    especialidad: EspecialidadTurnoRecepcion;
    medico: MedicoTurnoRecepcion;
    fechaTurno: string;
    fechaFin: string;
    estado: EstadoTurno;
    observaciones?: string | null;
}

export interface RecepcionResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: TurnoRecepcionConfirmado;
}
