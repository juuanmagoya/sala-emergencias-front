import api from "@/api/axios";

import type {
    Medico,
    CreateMedicoData,
    UpdateMedicoData,
} from "@/types/medico";

// ============================================
// RESPUESTA ESTÁNDAR DE LA API
// ============================================

interface ApiResponse<T> {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: T;
}

// ============================================
// FILTROS
// ============================================

export interface MedicoFilters {
    especialidad?: string;
    matricula?: string;
    apellido?: string;
    nombre?: string;
    id?: string;
    activo?: boolean;
}

// ============================================
// OBTENER MÉDICOS
// ============================================

/**
 * Obtener médicos.
 *
 * Si no se envía activo:
 * - devuelve activos e inactivos
 *
 * Si activo = true:
 * - devuelve solamente activos
 *
 * Si activo = false:
 * - devuelve solamente inactivos
 */
export async function getMedicos(
    filters?: MedicoFilters
): Promise<ApiResponse<Medico[]>> {
    const response = await api.get<
        ApiResponse<Medico[]>
    >("/medicos", {
        params: filters,
    });

    return response.data;
}

// ============================================
// OBTENER MÉDICO
// ============================================

/**
 * Obtener un médico por ID.
 *
 * El backend utiliza:
 * GET /medicos?id=...
 *
 * y devuelve un array con un solo médico.
 *
 * Acá lo transformamos en un único Medico.
 */
export async function getMedico(
    id: string
): Promise<ApiResponse<Medico>> {
    const response = await api.get<
        ApiResponse<Medico[]>
    >("/medicos", {
        params: { id },
    });

    const medicos = response.data.data;

    if (!medicos || medicos.length === 0) {
        throw new Error("Médico no encontrado");
    }

    return {
        ...response.data,
        data: medicos[0],
    };
}

// ============================================
// CREAR MÉDICO
// ============================================

export async function createMedico(
    medico: CreateMedicoData
): Promise<ApiResponse<Medico>> {
    const response = await api.post<
        ApiResponse<Medico>
    >("/medicos", medico);

    return response.data;
}

// ============================================
// ACTUALIZAR MÉDICO
// ============================================

export async function updateMedico(
    id: string,
    medico: UpdateMedicoData
): Promise<ApiResponse<Medico>> {
    const response = await api.put<
        ApiResponse<Medico>
    >(`/medicos/${id}`, medico);

    return response.data;
}

// ============================================
// ACTIVAR / DESACTIVAR
// ============================================

export async function toggleActivoMedico(
    id: string
): Promise<ApiResponse<Medico>> {
    const response = await api.patch<
        ApiResponse<Medico>
    >(`/medicos/${id}/toggle-estado`);

    return response.data;
}

// ============================================
// ELIMINAR PERMANENTEMENTE
// ============================================

export async function deleteMedicoPermanente(
    id: string
): Promise<ApiResponse<Medico>> {
    const response = await api.delete<
        ApiResponse<Medico>
    >(`/medicos/${id}/permanente`);

    return response.data;
}