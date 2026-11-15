import { z } from "zod";

// ============================================================
// MEDICAMENTO RECETADO
// ============================================================

export const medicamentoRecetadoSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre del medicamento es obligatorio"),

    dosis: z
        .string()
        .trim()
        .min(1, "La dosis del medicamento es obligatoria"),

    frecuencia: z
        .string()
        .trim()
        .min(1, "La frecuencia del medicamento es obligatoria"),

    duracion: z
        .string()
        .trim()
        .optional(),

    indicaciones: z
        .string()
        .trim()
        .optional(),
});

// ============================================================
// CREAR HISTORIA CLÍNICA
// ============================================================

export const crearHistoriaClinicaSchema = z.object({
    paciente: z
        .string()
        .regex(/^[a-f\d]{24}$/i, "El paciente seleccionado no es válido"),

    medico: z
        .string()
        .regex(/^[a-f\d]{24}$/i, "El médico seleccionado no es válido"),

    fechaAtencion: z
        .string()
        .optional(),

    observaciones: z
        .string()
        .trim()
        .min(1, "Las observaciones son obligatorias")
        .max(2000, "Las observaciones no pueden superar los 2000 caracteres"),

    recetario: z
        .array(medicamentoRecetadoSchema)
        .optional(),
});

// ============================================================
// ACTUALIZAR HISTORIA CLÍNICA
// ============================================================

export const actualizarHistoriaClinicaSchema = z.object({
    fechaAtencion: z
        .string()
        .optional(),

    observaciones: z
        .string()
        .trim()
        .min(1, "Las observaciones son obligatorias")
        .max(2000, "Las observaciones no pueden superar los 2000 caracteres")
        .optional(),

    recetario: z
        .array(medicamentoRecetadoSchema)
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debés proporcionar al menos un campo para actualizar",
    }
);

// ============================================================
// TIPOS INFERIDOS
// ============================================================

export type MedicamentoRecetadoSchema = z.infer<
    typeof medicamentoRecetadoSchema
>;

export type CrearHistoriaClinicaSchema = z.infer<
    typeof crearHistoriaClinicaSchema
>;

export type ActualizarHistoriaClinicaSchema = z.infer<
    typeof actualizarHistoriaClinicaSchema
>;