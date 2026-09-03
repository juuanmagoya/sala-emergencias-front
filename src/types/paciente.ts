// src/types/paciente.ts

export type TipoTelefono = "CELULAR" | "FIJO" | "TRABAJO";

export type ObraSocialNombre =
    | "PAMI"
    | "OSPEL"
    | "OSDE"
    | "SANCOR"
    | "OSECAC"
    | "SWISS MEDICAL"
    | "GALENO"
    | "MEDICUS"
    | "OMINT"
    | "FEMEBA"
    | "OTRAS"
    | "NINGUNA";

export interface Direccion {
    calle: string;
    numero: string;
    piso?: string;
    departamento?: string;
    barrio?: string;
}

export interface Telefono {
    tipo: TipoTelefono;  // Ahora es obligatorio con default "CELULAR"
    codigoArea: string;
    numero: string;
}

export interface ObraSocial {
    nombre: ObraSocialNombre;
    numeroAfiliado?: string;
}

export interface Paciente {
    id: string;
    nombre: string;
    dni: string;
    direccion: Direccion;
    email: string;
    telefono: Telefono;
    obraSocial: ObraSocial;
    createdAt?: string;
    updatedAt?: string;
}

export type CreatePacienteData = Omit<
    Paciente,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdatePacienteData = Partial<CreatePacienteData>;