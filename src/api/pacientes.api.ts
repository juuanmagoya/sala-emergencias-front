import api from "@/api/axios";

import type {
    CreatePacienteData,
    Paciente,
    UpdatePacienteData,
} from "@/types/paciente";

export interface PacientesResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Paciente[];
}

export interface PacienteResponse {
    success: boolean;
    timestamp: string;
    message: string;
    data: Paciente;
}

export interface DeletePacienteResponse {
    success: boolean;
    message: string;
}

/**
 * Obtener todos los pacientes
 */
export async function getPacientes(): Promise<PacientesResponse> {
    const response = await api.get<PacientesResponse>(
        "/pacientes"
    );

    return response.data;
}

/**
 * Crear un paciente
 */
export async function createPaciente(
    paciente: CreatePacienteData
): Promise<PacienteResponse> {
    const response = await api.post<PacienteResponse>(
        "/pacientes",
        paciente
    );

    return response.data;
}

/**
 * Actualizar un paciente
 */
export async function updatePaciente(
    id: string,
    paciente: UpdatePacienteData
): Promise<PacienteResponse> {
    const response = await api.put<PacienteResponse>(
        `/pacientes/${id}`,
        paciente
    );

    return response.data;
}

/**
 * Eliminar un paciente
 */
export async function deletePaciente(
    id: string
): Promise<DeletePacienteResponse> {
    const response =
        await api.delete<DeletePacienteResponse>(
            `/pacientes/${id}`
        );

    return response.data;
}