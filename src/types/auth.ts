// Roles de las cuentas internas de la Sala Médica.
export type RolUsuario =
    | "admin"
    | "recepcionista"
    | "medico";

// Los pacientes no son documentos Usuario: se autentican contra su ficha.
export type RolPaciente = "paciente";

/**
 * Identidad de un usuario interno autenticado.
 *
 * `tipo` es el discriminante que permite distinguirla de un paciente.
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
 *
 * No tiene email ni contraseña: la credencial es DNI + teléfono.
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

export interface LoginPacienteData {
    dni: string;
    telefono: string;
}

/**
 * Datos exactos que devuelve el backend en el login interno.
 * El discriminante `tipo` se agrega en el frontend al construir la sesión.
 */
export interface UsuarioLoginResponse {
    id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    medico?: string | null;
}

/**
 * Datos exactos que devuelve el backend en el login de pacientes.
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

export interface LoginPacienteResponse {
    token: string;
    paciente: PacienteLoginResponse;
}
