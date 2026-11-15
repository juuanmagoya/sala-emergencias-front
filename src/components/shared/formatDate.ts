export function formatDate(value?: string | Date): string {
    if (!value) return "No disponible";
    
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No disponible";
    
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

/**
 * Formatea fecha y hora en la zona horaria de Argentina.
 * Devuelve un texto seguro ante valores ausentes o inválidos.
 */
export function formatDateTime(value?: string | Date): string {
    if (!value) return "Fecha no disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";

    return new Intl.DateTimeFormat("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Argentina/Buenos_Aires",
    }).format(date);
}

const ZONA_HORARIA_ARGENTINA =
    "America/Argentina/Buenos_Aires";

/**
 * Formatea una fecha larga en la zona horaria de Argentina.
 * Devuelve un texto seguro ante valores ausentes o inválidos.
 */
export function formatFechaLargaArgentina(
    value?: string | Date | null
): string {
    if (!value) return "Fecha no disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Fecha no disponible";
    }

    const texto = new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).format(date);

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Formatea una hora en la zona horaria de Argentina.
 * Devuelve un texto seguro ante valores ausentes o inválidos.
 */
export function formatHoraArgentina(
    value?: string | Date | null
): string {
    if (!value) return "Hora no disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Hora no disponible";
    }

    return new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).format(date);
}