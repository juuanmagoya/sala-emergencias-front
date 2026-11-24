
import api from "@/api/axios";

import type {
    LoginData,
    LoginPacienteData,
    LoginResponse,
    SolicitudOtpPacienteResponse,
    VerificarOtpPacienteData,
    VerificarOtpPacienteResponse,
} from "@/types/auth";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Iniciar sesión de un usuario interno
 * (administrador, médico o recepcionista).
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
 * Solicitar un código OTP al correo registrado del paciente.
 *
 * Esta operación NO inicia sesión ni devuelve un JWT.
 */
export async function solicitarCodigoPaciente(
    credentials: LoginPacienteData
) {
    const response = await api.post<
        ApiResponse<SolicitudOtpPacienteResponse>
    >("/auth/paciente/login", credentials);

    return response.data;
}

/**
 * Verificar el código OTP enviado al paciente.
 *
 * Solo esta operación devuelve el JWT.
 */
export async function verificarCodigoPaciente(
    credentials: VerificarOtpPacienteData
) {
    const response = await api.post<
        ApiResponse<VerificarOtpPacienteResponse>
    >("/auth/paciente/verificar", credentials);

    return response.data;
}
