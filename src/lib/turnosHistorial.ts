import type {
    EstadoTurno,
    MiTurnoHistorial,
} from "@/types/turno";

export type CategoriaTurno =
    | "proximos"
    | "anteriores"
    | "cancelados";

export interface TurnosClasificados {
    proximos: MiTurnoHistorial[];
    anteriores: MiTurnoHistorial[];
    cancelados: MiTurnoHistorial[];
}

/**
 * Normaliza el estado de un turno.
 *
 * Los documentos legacy pueden no tener estado o traer un valor que
 * el frontend todavía no conoce. En esos casos se devuelve null para
 * que la interfaz muestre "Sin estado" y no invente uno.
 */
export function normalizarEstadoTurno(
    estado?: string | null
): EstadoTurno | null {
    switch (estado) {
        case "pendiente":
        case "atendido":
        case "cancelado":
            return estado;

        default:
            return null;
    }
}

/**
 * Devuelve el timestamp de una fecha ISO o null si es ausente o
 * inválida. No se reconstruyen fechas a partir de strings.
 */
export function obtenerTimestamp(
    fecha?: string | null
): number | null {
    if (!fecha) {
        return null;
    }

    const timestamp = new Date(fecha).getTime();

    return Number.isNaN(timestamp) ? null : timestamp;
}

function compararAscendente(
    primero: MiTurnoHistorial,
    segundo: MiTurnoHistorial
): number {
    const timestampPrimero = obtenerTimestamp(
        primero.fechaTurno
    );

    const timestampSegundo = obtenerTimestamp(
        segundo.fechaTurno
    );

    if (
        timestampPrimero === null &&
        timestampSegundo === null
    ) {
        return 0;
    }

    if (timestampPrimero === null) {
        return 1;
    }

    if (timestampSegundo === null) {
        return -1;
    }

    return timestampPrimero - timestampSegundo;
}

function compararDescendente(
    primero: MiTurnoHistorial,
    segundo: MiTurnoHistorial
): number {
    const timestampPrimero = obtenerTimestamp(
        primero.fechaTurno
    );

    const timestampSegundo = obtenerTimestamp(
        segundo.fechaTurno
    );

    if (
        timestampPrimero === null &&
        timestampSegundo === null
    ) {
        return 0;
    }

    if (timestampPrimero === null) {
        return 1;
    }

    if (timestampSegundo === null) {
        return -1;
    }

    return timestampSegundo - timestampPrimero;
}

/**
 * Clasifica y ordena el historial del paciente.
 *
 * Reglas, en orden:
 * 1. Cancelado → Cancelados, sin importar la fecha.
 * 2. Pendiente con fecha futura → Próximos.
 * 3. Todo lo demás → Anteriores.
 *
 * Los turnos sin estado o con estado desconocido se conservan en
 * Anteriores. Las fechas inválidas también se conservan y quedan al
 * final de la categoría.
 */
export function clasificarTurnos(
    turnos: MiTurnoHistorial[],
    ahora: number = Date.now()
): TurnosClasificados {
    const proximos: MiTurnoHistorial[] = [];
    const anteriores: MiTurnoHistorial[] = [];
    const cancelados: MiTurnoHistorial[] = [];

    for (const turno of turnos) {
        const estado = normalizarEstadoTurno(turno.estado);

        if (estado === "cancelado") {
            cancelados.push(turno);
            continue;
        }

        const timestamp = obtenerTimestamp(
            turno.fechaTurno
        );

        const esFuturo =
            timestamp !== null && timestamp > ahora;

        if (estado === "pendiente" && esFuturo) {
            proximos.push(turno);
        } else {
            anteriores.push(turno);
        }
    }

    proximos.sort(compararAscendente);
    anteriores.sort(compararDescendente);
    cancelados.sort(compararDescendente);

    return {
        proximos,
        anteriores,
        cancelados,
    };
}
