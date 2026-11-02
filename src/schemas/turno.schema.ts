
import { z } from "zod";

// ============================================
// TURNO
// ============================================

export const turnoSchema = z.object({
    paciente: z
        .string()
        .min(1, "Debe seleccionar un paciente"),

    especialidad: z
        .string()
        .min(1, "Debe seleccionar una especialidad"),

    medico: z
        .string()
        .min(1, "Debe seleccionar un médico"),

    fechaTurno: z
        .string()
        .min(1, "La fecha y hora del turno son obligatorias")
        .refine(
            (fecha) => !Number.isNaN(Date.parse(fecha)),
            "La fecha y hora del turno no son válidas"
        ),

    observaciones: z
        .string()
        .max(500, "Las observaciones no pueden superar los 500 caracteres")
        .optional(),
});

export type TurnoFormData = z.infer<typeof turnoSchema>;
