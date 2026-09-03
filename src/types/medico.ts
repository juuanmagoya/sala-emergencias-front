/**
 * Tipo de teléfono del médico
 */
export type TipoTelefono =
    | "CELULAR"
    | "FIJO"
    | "TRABAJO";

/**
 * Teléfono del médico
 */
export interface TelefonoMedico {
    tipo: TipoTelefono;
    codigoArea: string;
    numero: string;
}

/**
 * Días disponibles para atención
 */
export type DiaSemana =
    | "LUNES"
    | "MARTES"
    | "MIERCOLES"
    | "JUEVES"
    | "VIERNES"
    | "SABADO";

/**
 * Especialidad que devuelve el backend
 * mediante populate()
 */
export interface MedicoEspecialidad {
    id: string;
    nombre: string;
    codigo?: string;
    descripcion?: string;
    activo: boolean;
}

/**
 * Consultorio que devuelve el backend
 * mediante populate()
 */
export interface MedicoConsultorio {
    id: string;
    nombre?: string;
    numero?: string;
    piso?: string;
    activo?: boolean;
}

/**
 * Horario de atención
 *
 * Un médico puede tener múltiples horarios,
 * incluso varios horarios el mismo día.
 *
 * Ejemplo:
 *
 * LUNES 08:00 - 12:00
 * LUNES 16:00 - 20:00
 */
export interface HorarioAtencion {
    dia: DiaSemana;
    horaInicio: string;
    horaFin: string;
}

/**
 * Médico
 */
export interface Medico {
    id: string;

    nombre: string;

    apellido: string;

    matricula: string;

    especialidad: MedicoEspecialidad;

    email: string;

    telefono: TelefonoMedico;

    consultorios: MedicoConsultorio[];

    horariosAtencion: HorarioAtencion[];

    /**
     * Duración de cada turno en minutos.
     *
     * Ejemplo:
     * 15 = turnos de 15 minutos
     * 30 = turnos de 30 minutos
     * 60 = turnos de 1 hora
     */
    duracionTurno: number;

    activo: boolean;

    createdAt?: string;

    updatedAt?: string;
}

/**
 * Datos para crear un médico
 */
export interface CreateMedicoData {
    nombre: string;

    apellido: string;

    matricula: string;

    especialidad: string;

    email: string;

    telefono: TelefonoMedico;

    consultorios?: string[];

    horariosAtencion: HorarioAtencion[];

    duracionTurno: number;
}

/**
 * Datos para actualizar un médico
 */
export interface UpdateMedicoData {
    nombre?: string;

    apellido?: string;

    matricula?: string;

    especialidad?: string;

    email?: string;

    telefono?: TelefonoMedico;

    consultorios?: string[];

    horariosAtencion?: HorarioAtencion[];

    duracionTurno?: number;
}