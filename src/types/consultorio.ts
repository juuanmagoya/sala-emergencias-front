export type AlaConsultorio =
    | "NORTE"
    | "SUR"
    | "ESTE"
    | "OESTE"
    | "CENTRAL";

export type EquipamientoConsultorio =
    | "CAMILLA"
    | "ELECTROCARDIOGRAFO"
    | "NEBULIZADOR"
    | "ECOGRAFO"
    | "OTOSCOPIO"
    | "OPHTALMOSCOPIO"
    | "TENSIOMETRO"
    | "BALANZA"
    | "ESTETOSCOPIO";

// ============================================
// ESPECIALIDAD
// ============================================

export interface ConsultorioEspecialidad {
    id: string;
    nombre: string;
    descripcion?: string;
    codigo?: string;
}

// ============================================
// CONSULTORIO
// ============================================

export interface Consultorio {
    id: string;
    nombre: string;
    numero: string;
    piso: string;
    ala: AlaConsultorio;
    especialidades: ConsultorioEspecialidad[];
    equipamiento: EquipamientoConsultorio[];
    capacidad: number;
    activo?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// CREAR CONSULTORIO
// ============================================

export interface CreateConsultorioData {
    nombre: string;
    numero: string;
    piso: string;
    ala?: AlaConsultorio;
    especialidades?: string[];
    equipamiento?: EquipamientoConsultorio[];
    capacidad?: number;
}

// ============================================
// ACTUALIZAR CONSULTORIO
// ============================================

export interface UpdateConsultorioData {
    nombre?: string;
    numero?: string;
    piso?: string;
    ala?: AlaConsultorio;
    especialidades?: string[];
    equipamiento?: EquipamientoConsultorio[];
    capacidad?: number;
}