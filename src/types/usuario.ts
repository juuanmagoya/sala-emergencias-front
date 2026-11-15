
/**
 * Roles disponibles en el sistema.
 */
export type RolUsuario =
    | "admin"
    | "medico"
    | "recepcionista";

/**
 * Roles que pueden gestionarse desde el CRUD administrativo.
 */
export type RolGestionable =
    | "medico"
    | "recepcionista";

/**
 * Información de un médico asociado a un usuario.
 *
 * El backend puede devolver únicamente el ID o el objeto
 * poblado, dependiendo del endpoint.
 */
export interface MedicoUsuario {
    _id: string;
    nombre: string;
}

/**
 * Usuario recibido desde la API.
 */
export interface Usuario {
    _id: string;
    nombre: string;
    email: string;
    rol: RolUsuario;
    medico?: string | MedicoUsuario | null;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Datos necesarios para crear un usuario.
 */
export interface CrearUsuarioData {
    nombre: string;
    email: string;
    password: string;
    rol: RolGestionable;
    medico?: string | null;
}

/**
 * Datos para actualizar un usuario.
 *
 * Todos los campos son opcionales.
 * La contraseña solamente se envía cuando se desea modificarla.
 */
export interface ActualizarUsuarioData {
    nombre?: string;
    email?: string;
    password?: string;
    rol?: RolGestionable;
    medico?: string | null;
}
