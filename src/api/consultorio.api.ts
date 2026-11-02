import api from "@/api/axios";

import type {
    Consultorio,
    CreateConsultorioData,
    UpdateConsultorioData,
} from "@/types/consultorio";

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

export interface ConsultorioFilters {
    id?: string;
    numero?: string;
    nombre?: string;
    especialidad?: string;
}

// ============================================
// OBTENER CONSULTORIOS
// ============================================

export async function getConsultorios(
    filters?: ConsultorioFilters
): Promise<ApiResponse<Consultorio[]>> {
    const response = await api.get<
        ApiResponse<Consultorio[]>
    >("/consultorios", {
        params: filters,
    });

    return response.data;
}

// ============================================
// OBTENER CONSULTORIO
// ============================================

/**
 * Obtener un consultorio por ID.
 *
 * El backend utiliza:
 * GET /consultorios?id=...
 *
 * y devuelve un array con un solo consultorio.
 *
 * Acá lo transformamos en un único Consultorio.
 */
export async function getConsultorio(
    id: string
): Promise<ApiResponse<Consultorio>> {
    const response = await api.get<
        ApiResponse<Consultorio[]>
    >("/consultorios", {
        params: { id },
    });

    const consultorios = response.data.data;

    if (!consultorios || consultorios.length === 0) {
        throw new Error("Consultorio no encontrado");
    }

    return {
        ...response.data,
        data: consultorios[0],
    };
}

// ============================================
// CREAR CONSULTORIO
// ============================================

export async function createConsultorio(
    consultorio: CreateConsultorioData
): Promise<ApiResponse<Consultorio>> {
    const response = await api.post<
        ApiResponse<Consultorio>
    >("/consultorios", consultorio);

    return response.data;
}

// ============================================
// ACTUALIZAR CONSULTORIO
// ============================================

export async function updateConsultorio(
    id: string,
    consultorio: UpdateConsultorioData
): Promise<ApiResponse<Consultorio>> {
    const response = await api.put<
        ApiResponse<Consultorio>
    >(`/consultorios/${id}`, consultorio);

    return response.data;
}

// ============================================
// ELIMINAR CONSULTORIO
// ============================================

/**
 * Eliminación lógica.
 *
 * El backend cambia activo = true
 * a activo = false.
 */
export async function deleteConsultorio(
    id: string
): Promise<ApiResponse<Consultorio>> {
    const response = await api.delete<
        ApiResponse<Consultorio>
    >(`/consultorios/${id}`);

    return response.data;
}