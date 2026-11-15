// ============================================================
// MEDICAMENTO RECETADO
// ============================================================

export interface MedicamentoRecetado {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion?: string;
    indicaciones?: string;
}

// ============================================================
// DATOS POBLADOS POR EL BACKEND
// ============================================================

export interface HistoriaClinicaPaciente {
    id: string;
    nombre: string;
    dni?: string;
}

export interface HistoriaClinicaMedico {
    id: string;
    nombre: string;
    apellido: string;
    matricula?: string;
}

// ============================================================
// HISTORIA CLÍNICA
// ============================================================

export interface HistoriaClinica {
    id: string;
    paciente: HistoriaClinicaPaciente | null;
    medico: HistoriaClinicaMedico | null;
    fechaAtencion: string;
    observaciones?: string;
    recetario?: MedicamentoRecetado[];
    createdAt?: string;
    updatedAt?: string;
}

// ============================================================
// HISTORIA CLÍNICA DEL PACIENTE AUTENTICADO
// ============================================================

/**
 * Contrato de GET /historias-clinicas/mi-historial.
 *
 * El backend no popula `paciente`, por lo que este tipo no expone
 * datos del perfil. El médico puede ser null si la referencia no
 * pudo resolverse.
 */
export interface MiHistoriaClinica {
    id: string;
    fechaAtencion: string;
    observaciones?: string;
    recetario?: MedicamentoRecetado[];
    medico: HistoriaClinicaMedico | null;
}

// ============================================================
// DATOS PARA CREAR UNA HISTORIA CLÍNICA
// ============================================================

export interface CrearHistoriaClinicaData {
    paciente: string;
    medico: string;
    fechaAtencion?: string;
    observaciones: string;
    recetario?: MedicamentoRecetado[];
}

// ============================================================
// DATOS PARA ACTUALIZAR UNA HISTORIA CLÍNICA
// ============================================================

export interface ActualizarHistoriaClinicaData {
    fechaAtencion?: string;
    observaciones?: string;
    recetario?: MedicamentoRecetado[];
}