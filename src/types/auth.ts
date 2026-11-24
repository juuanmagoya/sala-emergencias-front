
// Roles de las cuentas internas de la Sala Médica.
export type RolUsuario =
    | "admin"
    | "recepcionista"
    | "medico";

// Los pacientes no son documentos Usuario: se autentican contra su ficha.
export type RolPaciente = "paciente";

/**
 * Identidad de un usuario interno autenticado.
 */
export interface Usuario {
    tipo: "usuario";
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    medico?: string | null;
}

/**
 * Identidad de un paciente autenticado.
 */
export interface PacienteAutenticado {
    tipo: "paciente";
    id: string;
    nombre: string;
    rol: RolPaciente;
}

/**
 * Identidad que se persiste y se expone desde AuthContext.
 */
export type IdentidadAutenticada =
    | Usuario
    | PacienteAutenticado;

export interface LoginData {
    email: string;
    password: string;
}

/**
 * Credenciales iniciales para solicitar el código OTP.
 */
export interface LoginPacienteData {
    dni: string;
    telefono: string;
}

/**
 * Datos necesarios para verificar el código OTP.
 */
export interface VerificarOtpPacienteData {
    dni: string;
    telefono: string;
    codigo: string;
}

/**
 * Datos exactos que devuelve el backend en el login interno.
 */
export interface UsuarioLoginResponse {
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    medico?: string | null;
}

/**
 * Datos mínimos del paciente que devuelve el backend
 * después de verificar correctamente el OTP.
 */
export interface PacienteLoginResponse {
    id: string;
    nombre: string;
    rol: RolPaciente;
}

export interface LoginResponse {
    token: string;
    usuario: UsuarioLoginResponse;
}

/**
 * Respuesta de POST /auth/paciente/login.
 * Esta respuesta NO contiene un JWT.
 */
export interface SolicitudOtpPacienteResponse {
    expiraEn: string;
    proximoEnvioPermitido: string;
}

/**
 * Respuesta de POST /auth/paciente/verificar.
 * Esta sí contiene el JWT y la identidad autenticada.
 */
export interface VerificarOtpPacienteResponse {
    token: string;
    paciente: PacienteLoginResponse;
}
