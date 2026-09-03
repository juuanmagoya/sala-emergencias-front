import { z } from "zod";

export const especialidadSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(
            2,
            "El nombre debe tener al menos 2 caracteres"
        )
        .max(
            100,
            "El nombre no puede superar los 100 caracteres"
        ),

    descripcion: z
        .string()
        .trim()
        .max(
            500,
            "La descripción no puede superar los 500 caracteres"
        )
        .optional()
        .or(z.literal("")),

    codigo: z
        .string()
        .trim()
        .regex(
            /^[A-Za-z]{2,5}$/,
            "El código debe tener entre 2 y 5 letras"
        )
        .optional()
        .or(z.literal("")),
});

export type EspecialidadFormData = z.infer<
    typeof especialidadSchema
>;