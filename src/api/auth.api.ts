import api from "@/api/axios";

import type {
    LoginData,
    LoginResponse,
} from "@/types/auth";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Iniciar sesión
 */
export async function loginUsuario(
    credentials: LoginData
) {
    const response = await api.post<
        ApiResponse<LoginResponse>
    >("/auth/login", credentials);

    return response.data;
}