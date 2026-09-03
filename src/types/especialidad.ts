export interface Especialidad {
    id: string;
    nombre: string;
    descripcion?: string;
    codigo?: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateEspecialidadData {
    nombre: string;
    descripcion?: string;
    codigo?: string;
}

export interface UpdateEspecialidadData {
    nombre?: string;
    descripcion?: string;
    codigo?: string;
}

export interface EspecialidadesResponse {
    success: boolean;
    timestamp: string;
    message: string;
    total: number;
    data: Especialidad[];
}

export interface EspecialidadFilters {
    nombre?: string;
    codigo?: string;
    id?: string;
    estado?: "todos" | "activos" | "inactivos";
}