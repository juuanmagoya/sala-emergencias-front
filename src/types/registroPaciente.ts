
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
