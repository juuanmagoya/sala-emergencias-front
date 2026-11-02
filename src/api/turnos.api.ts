
import api from "@/api/axios";

import type {
    CrearTurnoData,
    Turno,
    DisponibilidadTurno,
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

// ============================================================
// OPERACIONES
// ============================================================

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
