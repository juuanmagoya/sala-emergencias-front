import api from "@/api/axios";

import type {
    HistoriaClinica,
    MiHistoriaClinica,
    CrearHistoriaClinicaData,
    ActualizarHistoriaClinicaData,
} from "@/types/historia-clinica";

// ============================================================
// RESPUESTAS DE LA API
// ============================================================

export interface HistoriasClinicasResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: HistoriaClinica[];
}

export interface HistoriaClinicaResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: HistoriaClinica;
}

export interface MiHistorialResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: MiHistoriaClinica[];
}

// ============================================================
// CONSULTAS
// ============================================================

/**
 * Obtener todas las historias clínicas
 */
export async function getHistoriasClinicas(): Promise<HistoriasClinicasResponse> {
    const response = await api.get<HistoriasClinicasResponse>(
        "/historias-clinicas"
    );

    return response.data;
}

/**
 * Obtener el historial clínico de un paciente
 */
export async function getHistorialPaciente(
    pacienteId: string
): Promise<HistoriasClinicasResponse> {
    const response = await api.get<HistoriasClinicasResponse>(
        `/historias-clinicas/paciente/${pacienteId}`
    );

    return response.data;
}

/**
 * Obtener el historial clínico del paciente autenticado.
 *
 * No recibe `pacienteId`: el backend lo resuelve desde el JWT.
 */
export async function getMiHistorial(): Promise<MiHistorialResponse> {
    const response = await api.get<MiHistorialResponse>(
        "/historias-clinicas/mi-historial"
    );

    return response.data;
}

/**
 * Obtener una historia clínica por ID
 */
export async function getHistoriaClinicaById(
    id: string
): Promise<HistoriaClinicaResponse> {
    const response = await api.get<HistoriaClinicaResponse>(
        `/historias-clinicas/${id}`
    );

    return response.data;
}

// ============================================================
// OPERACIONES
// ============================================================

/**
 * Crear una historia clínica
 */
export async function createHistoriaClinica(
    historiaClinica: CrearHistoriaClinicaData
): Promise<HistoriaClinicaResponse> {
    const response = await api.post<HistoriaClinicaResponse>(
        "/historias-clinicas",
        historiaClinica
    );

    return response.data;
}

/**
 * Actualizar una historia clínica
 */
export async function updateHistoriaClinica(
    id: string,
    historiaClinica: ActualizarHistoriaClinicaData
): Promise<HistoriaClinicaResponse> {
    const response = await api.put<HistoriaClinicaResponse>(
        `/historias-clinicas/${id}`,
        historiaClinica
    );

    return response.data;
}