
import api from "@/api/axios";

export interface RegistrarPacienteData {
    nombre: string;
    dni: string;
    telefono: {
        codigoArea: string;
        numero: string;
    };
    email: string;
}

export interface RegistroPacienteResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: {
        id: string;
        nombre: string;
    };
}

/**
 * Registrar un paciente desde el formulario público.
 */
export async function registrarPaciente(
    paciente: RegistrarPacienteData
): Promise<RegistroPacienteResponse> {
    const response = await api.post<RegistroPacienteResponse>(
        "/registro-paciente",
        paciente
    );

    return response.data;
}
