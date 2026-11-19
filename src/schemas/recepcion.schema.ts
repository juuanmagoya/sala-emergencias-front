import { z } from "zod";

// ============================================================
// VALIDACIONES BÁSICAS
// ============================================================

export const dniSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9]{7,8}$/,
        "El DNI debe tener entre 7 y 8 dígitos"
    );

export const nombreSchema = z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(
        100,
        "El nombre no puede superar los 100 caracteres"
    );

export const codigoAreaSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9]{2,5}$/,
        "El código de área no es válido"
    );

export const numeroTelefonoSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9]{7,10}$/,
        "El número de teléfono no es válido"
    );

// ============================================================
// BÚSQUEDA POR DNI
// ============================================================

export const busquedaDniSchema = z.object({
    dni: dniSchema,
});

export type BusquedaDniFormData = z.infer<
    typeof busquedaDniSchema
>;

// ============================================================
// PACIENTE NUEVO - DATOS MÍNIMOS
// ============================================================

export const pacienteMinimoSchema = z.object({
    nombre: nombreSchema,

    dni: dniSchema,

    telefono: z.object({
        codigoArea: codigoAreaSchema,
        numero: numeroTelefonoSchema,
    }),
});

export type PacienteMinimoFormData = z.infer<
    typeof pacienteMinimoSchema
>;

/**
 * Verifica si un DNI puede utilizarse en la búsqueda.
 *
 * Se comparte con el hook para no duplicar la regla de validación.
 */
export function esDniValido(dni: string): boolean {
    return dniSchema.safeParse(dni).success;
}
