
import api from "@/api/axios";

import type {
    CrearTurnoData,
    CrearMiTurnoData,
    Turno,
    MiTurno,
    MiTurnoHistorial,
    DisponibilidadTurno,
    EstadoTurno
} from "@/types/turno";

// ============================================================
// RESPUESTAS DE LA API
// ============================================================

export interface TurnosResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Turno[];
}

export interface TurnoResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Turno;
}

export interface DisponibilidadResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: DisponibilidadTurno;
}

export interface MiTurnoResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: MiTurno;
}

export interface MiHistorialTurnosResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: MiTurnoHistorial[];
}

export interface DeleteTurnoResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Turno;
}

// ============================================================
// CONSULTAS
// ============================================================

/**
 * Obtener todos los turnos
 */
export async function getTurnos(): Promise<TurnosResponse> {
    const response = await api.get<TurnosResponse>("/turnos");

    return response.data;
}

/**
 * Obtener disponibilidad de un médico para una fecha
 */
export async function getDisponibilidad(
    medicoId: string,
    fecha: string
): Promise<DisponibilidadResponse> {
    const response = await api.get<DisponibilidadResponse>(
        "/turnos/disponibilidad",
        {
            params: { medicoId, fecha },
        }
    );

    return response.data;
}

/**
 * Obtener los turnos del médico autenticado
 */
export async function getMisTurnos(): Promise<TurnosResponse> {
    const response = await api.get<TurnosResponse>(
        "/turnos/mis-turnos"
    );

    return response.data;
}

/**
 * Obtener el historial de turnos del paciente autenticado.
 *
 * La identidad se resuelve desde el JWT, por eso no se envían
 * parámetros ni body.
 */
export async function getMiHistorialTurnos(): Promise<MiHistorialTurnosResponse> {
    const response = await api.get<MiHistorialTurnosResponse>(
        "/turnos/mi-historial"
    );

    return response.data;
}

// ============================================================
// OPERACIONES
// ============================================================

/**
 * Crear un turno para el paciente autenticado
 */
export async function crearMiTurno(
    datos: CrearMiTurnoData
): Promise<MiTurnoResponse> {
    // Se construye el body explícitamente para no enviar campos
    // administrativos ni la identidad del paciente.
    const response = await api.post<MiTurnoResponse>(
        "/turnos/mi-turno",
        {
            especialidad: datos.especialidad,
            medico: datos.medico,
            fechaTurno: datos.fechaTurno,
            observaciones: datos.observaciones,
        }
    );

    return response.data;
}

/**
 * Crear un turno
 */
export async function createTurno(
    turno: CrearTurnoData
): Promise<TurnoResponse> {
    const response = await api.post<TurnoResponse>(
        "/turnos",
        turno
    );

    return response.data;
}

/**
 * Cancelar un turno
 */
export async function deleteTurno(
    id: string
): Promise<DeleteTurnoResponse> {
    const response = await api.delete<DeleteTurnoResponse>(
        `/turnos/${id}`
    );

    return response.data;
}

/**
 * Actualizar el estado de un turno
 */
export async function updateEstadoTurno(
    id: string,
    estado: EstadoTurno
): Promise<TurnoResponse> {
    const response = await api.patch<TurnoResponse>(
        `/turnos/${id}/estado`,
        { estado }
    );

    return response.data;
}