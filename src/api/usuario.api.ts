
import api from "@/api/axios";

import type {
    CrearUsuarioData,
    ActualizarUsuarioData,
    Usuario,
} from "@/types/usuario";

// ============================================================
// RESPUESTAS DE LA API
// ============================================================

export interface UsuariosResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Usuario[];
}

export interface UsuarioResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Usuario;
}

export interface DesactivarUsuarioResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Usuario;
}

// ============================================================
// CONSULTAS
// ============================================================

/**
 * Obtener todos los usuarios
 */
export async function getUsuarios(): Promise<UsuariosResponse> {
    const response = await api.get<UsuariosResponse>("/usuarios");

    return response.data;
}

/**
 * Obtener un usuario por su ID
 */
export async function getUsuarioById(
    id: string
): Promise<UsuarioResponse> {
    const response = await api.get<UsuarioResponse>(
        `/usuarios/${id}`
    );

    return response.data;
}

// ============================================================
// OPERACIONES
// ============================================================

/**
 * Crear un usuario
 */
export async function createUsuario(
    usuario: CrearUsuarioData
): Promise<UsuarioResponse> {
    const response = await api.post<UsuarioResponse>(
        "/usuarios",
        usuario
    );

    return response.data;
}

/**
 * Actualizar un usuario
 */
export async function updateUsuario(
    id: string,
    usuario: ActualizarUsuarioData
): Promise<UsuarioResponse> {
    const response = await api.put<UsuarioResponse>(
        `/usuarios/${id}`,
        usuario
    );

    return response.data;
}

/**
 * Desactivar un usuario
 */
export async function desactivarUsuario(
    id: string
): Promise<DesactivarUsuarioResponse> {
    const response = await api.delete<DesactivarUsuarioResponse>(
        `/usuarios/${id}`
    );

    return response.data;
}
