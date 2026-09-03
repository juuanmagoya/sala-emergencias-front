import api from "@/api/axios";

import type {
    Especialidad,
    CreateEspecialidadData,
    UpdateEspecialidadData,
} from "@/types/especialidad";

interface ApiResponse<T> {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: T;
}

export interface EspecialidadFilters {
    nombre?: string;
    codigo?: string;
    id?: string;
    estado?: "todos" | "activos" | "inactivos";
}

/**
 * Obtener todas las especialidades
 */
export async function getEspecialidades(
    filters?: EspecialidadFilters
) {
    const response = await api.get<
        ApiResponse<Especialidad[]>
    >("/especialidades", {
        params: filters,
    });

    return response.data;
}

/**
 * Obtener una especialidad por ID
 */
export async function getEspecialidad(id: string) {
    const response = await api.get<
        ApiResponse<Especialidad[]>
    >("/especialidades", {
        params: { id },
    });

    return response.data;
}

/**
 * Crear especialidad
 */
export async function createEspecialidad(
    especialidad: CreateEspecialidadData
) {
    const response = await api.post<
        ApiResponse<Especialidad>
    >("/especialidades", especialidad);

    return response.data;
}

/**
 * Actualizar especialidad
 */
export async function updateEspecialidad(
    id: string,
    especialidad: UpdateEspecialidadData
) {
    const response = await api.put<
        ApiResponse<Especialidad>
    >(`/especialidades/${id}`, especialidad);

    return response.data;
}

/**
 * Cambiar estado de la especialidad
 *
 * Activa una especialidad si está inactiva
 * y la desactiva si está activa.
 */
export async function toggleActivoEspecialidad(
    id: string
) {
    const response = await api.patch<
        ApiResponse<Especialidad>
    >(`/especialidades/${id}/toggle-estado`);

    return response.data;
}

/**
 * Borrado físico
 */
export async function deleteEspecialidadPermanente(
    id: string
) {
    const response = await api.delete<
        ApiResponse<Especialidad>
    >(`/especialidades/${id}/permanente`);

    return response.data;
}