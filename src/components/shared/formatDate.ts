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

/**
 * Formatea la fecha del header: "Viernes, 20 de noviembre".
 * No incluye el año.
 */
export function formatFechaHeader(
    value: Date = new Date()
): string {
    const texto = new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).format(value);

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Devuelve el saludo según la hora de Argentina.
 */
export function obtenerSaludoHeader(
    value: Date = new Date()
): string {
    const partes = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        hourCycle: "h23",
        timeZone: ZONA_HORARIA_ARGENTINA,
    }).formatToParts(value);

    const hora = Number(
        partes.find((parte) => parte.type === "hour")
            ?.value ?? "0"
    );

    if (hora >= 6 && hora < 12) {
        return "Buenos días";
    }

    if (hora >= 12 && hora < 20) {
        return "Buenas tardes";
    }

    return "Buenas noches";
}