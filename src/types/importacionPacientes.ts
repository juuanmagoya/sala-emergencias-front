import type { ObraSocialNombre, TipoTelefono } from "@/types/paciente";

// ============================================================
// CAMPOS Y ESTADOS DE LA IMPORTACIÓN
// ============================================================

export const CAMPOS_IMPORTACION = [
    "nombre",
    "dni",
    "telefono.codigoArea",
    "telefono.numero",
    "telefono.tipo",
    "email",
    "obraSocial.nombre",
    "obraSocial.numeroAfiliado",
    "direccion.calle",
    "direccion.numero",
    "direccion.piso",
    "direccion.departamento",
    "direccion.barrio",
] as const;

export type CampoImportacion = (typeof CAMPOS_IMPORTACION)[number];

export const ESTADOS_FILA_IMPORTACION = [
    "vacia",
    "invalida",
    "duplicada_en_archivo",
    "existente",
    "conflicto_email",
    "valida",
    "importada",
] as const;

export type EstadoFilaImportacion =
    (typeof ESTADOS_FILA_IMPORTACION)[number];

// ============================================================
// FILAS
// ============================================================

export interface MotivoImportacion {
    campo?: string;
    mensaje: string;
}

export interface TelefonoImportacion {
    codigoArea?: string;
    numero?: string;
    tipo?: TipoTelefono;
}

export interface ObraSocialImportacion {
    nombre?: ObraSocialNombre | string;
    numeroAfiliado?: string;
}

export interface DireccionImportacion {
    calle?: string;
    numero?: string;
    piso?: string;
    departamento?: string;
    barrio?: string;
}

export interface DatosPacienteImportacion {
    nombre?: string;
    dni?: string;
    telefono?: TelefonoImportacion;
    email?: string;
    obraSocial?: ObraSocialImportacion;
    direccion?: DireccionImportacion;
}

export interface FilaImportacion {
    numeroFila: number;
    estado: EstadoFilaImportacion;
    datos: DatosPacienteImportacion;
    motivos: MotivoImportacion[];
    advertencias: MotivoImportacion[];
}

export interface ColumnaIdentificada {
    encabezado: string;
    campo: CampoImportacion;
}

// ============================================================
// RESÚMENES Y RESULTADOS
// ============================================================

export interface ResumenPrevisualizacion {
    totalFilas: number;
    validas: number;
    invalidas: number;
    existentes: number;
    duplicadasEnArchivo: number;
    conflictosEmail: number;
    vacias: number;
    conAdvertencias: number;
}

export interface ResumenConfirmacion extends ResumenPrevisualizacion {
    candidatas: number;
    importadas: number;
    noImportadas: number;
}

export interface ResultadoPrevisualizacion {
    resumen: ResumenPrevisualizacion;
    hojaProcesada: string;
    hojasDisponibles: string[];
    columnasIdentificadas: ColumnaIdentificada[];
    columnasIgnoradas: string[];
    filas: FilaImportacion[];
}

export interface ResultadoConfirmacion {
    resumen: ResumenConfirmacion;
    hojaProcesada: string;
    hojasDisponibles: string[];
    columnasIdentificadas: ColumnaIdentificada[];
    columnasIgnoradas: string[];
    filas: FilaImportacion[];
}

// ============================================================
// SOLICITUD
// ============================================================

export interface ImportacionPacientesArchivo {
    archivo: File;
    hoja?: string;
}

// ============================================================
// RESPUESTAS HTTP
// ============================================================

export interface ImportacionPacientesResponse<T> {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: T;
}

export type PrevisualizacionImportacionResponse =
    ImportacionPacientesResponse<ResultadoPrevisualizacion>;

export type ConfirmacionImportacionResponse =
    ImportacionPacientesResponse<ResultadoConfirmacion>;

export interface HojasDisponiblesErrorData {
    hojasDisponibles: string[];
}

export interface TamanoMaximoErrorData {
    maximoBytes: number;
}

export interface MaximoFilasErrorData {
    filasDetectadas: number;
    maximoFilas: number;
}

export type ImportacionPacientesErrorData =
    | HojasDisponiblesErrorData
    | TamanoMaximoErrorData
    | MaximoFilasErrorData
    | null;

export interface ImportacionPacientesErrorResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: ImportacionPacientesErrorData;
}
