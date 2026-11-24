import type {
    IdentidadAutenticada,
    RolUsuario,
    Usuario,
} from "@/types/auth";

const TOKEN_KEY = "token";
const IDENTIDAD_KEY = "usuario";

const ROLES_USUARIO: readonly RolUsuario[] = [
    "admin",
    "medico",
    "recepcionista",
];
export interface SesionGuardada {
    token: string;
    identidad: IdentidadAutenticada;
}

function esRolUsuario(valor: unknown): valor is RolUsuario {
    return (
        typeof valor === "string" &&
        ROLES_USUARIO.some((rol) => rol === valor)
    );
}

/**
 * Normaliza la identidad recuperada de localStorage.
 *
 * Acepta las sesiones internas guardadas antes de la incorporación del
 * login de pacientes, que no tenían el discriminante `tipo`.
 */
function normalizarIdentidad(
    valor: unknown
): IdentidadAutenticada | null {
    if (typeof valor !== "object" || valor === null) {
        return null;
    }

    const registro = valor as Record<string, unknown>;

    // Paciente: rol "paciente" o el discriminante explícito.
    if (
        registro.tipo === "paciente" ||
        registro.rol === "paciente"
    ) {
        if (
            typeof registro.id !== "string" ||
            typeof registro.nombre !== "string"
        ) {
            return null;
        }

        return {
            tipo: "paciente",
            id: registro.id,
            nombre: registro.nombre,
            rol: "paciente",
        };
    }

    // Usuario interno. Las sesiones guardadas antes del login de
    // pacientes no tienen `tipo`, por eso se admite su ausencia.
    if (
        (registro.tipo !== undefined &&
            registro.tipo !== "usuario") ||
        typeof registro.id !== "string" ||
        typeof registro.nombre !== "string" ||
        typeof registro.email !== "string" ||
        !esRolUsuario(registro.rol)
    ) {
        return null;
    }

    const usuario: Usuario = {
        tipo: "usuario",
        id: registro.id,
        nombre: registro.nombre,
        email: registro.email,
        rol: registro.rol,
        medico:
            typeof registro.medico === "string"
                ? registro.medico
                : null,
    };

    return usuario;
}

/**
 * Persiste el JWT y la identidad usando las mismas claves que ya usaba
 * el proyecto. No se guardan DNI ni teléfono.
 */
export function guardarSesion(
    token: string,
    identidad: IdentidadAutenticada
): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
        IDENTIDAD_KEY,
        JSON.stringify(identidad)
    );
}

export function limpiarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(IDENTIDAD_KEY);
}

/**
 * Recupera la sesión al iniciar la aplicación.
 *
 * Si el token y la identidad no forman un par válido, limpia ambos para
 * no dejar una sesión a medias.
 */
export function obtenerSesionGuardada(): SesionGuardada | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const identidadGuardada =
        localStorage.getItem(IDENTIDAD_KEY);

    if (!token || !identidadGuardada) {
        limpiarSesion();
        return null;
    }

    try {
        const identidad = normalizarIdentidad(
            JSON.parse(identidadGuardada)
        );

        if (!identidad) {
            limpiarSesion();
            return null;
        }

        return { token, identidad };
    } catch {
        limpiarSesion();
        return null;
    }
}

/**
 * Ruta segura luego de autenticarse.
 *
 * Los pacientes ingresan al Portal del Paciente. Los usuarios internos
 * van a una ruta que su rol sí puede ver.
 */
export function obtenerRutaInicio(
    identidad: IdentidadAutenticada
): string {
    if (identidad.tipo === "paciente") {
        return "/portal";
    }

    switch (identidad.rol) {
        case "medico":
            return "/mis-turnos";

        case "recepcionista":
            return "/pacientes";

        default:
            return "/";
    }
}
