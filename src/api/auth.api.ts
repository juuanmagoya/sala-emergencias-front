import api from "@/api/axios";

import type {
    LoginData,
    LoginPacienteData,
    LoginPacienteResponse,
    LoginResponse,
} from "@/types/auth";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Iniciar sesión de un usuario interno (admin, médico o recepcionista).
 */
export async function loginUsuario(
    credentials: LoginData
) {
    const response = await api.post<
        ApiResponse<LoginResponse>
    >("/auth/login", credentials);

    return response.data;
}

/**
 * Iniciar sesión de un paciente con DNI y teléfono.
 *
 * El backend autentica contra la ficha Paciente y devuelve su identidad
 * junto con el JWT. No crea ni utiliza documentos de Usuario.
 */
export async function loginPaciente(
    credentials: LoginPacienteData
) {
    const response = await api.post<
        ApiResponse<LoginPacienteResponse>
    >("/auth/paciente/login", credentials);

    return response.data;
}
