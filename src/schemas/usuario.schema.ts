
import { z } from "zod";

// ============================================================
// CONSTANTES
// ============================================================

const ROLES_GESTIONABLES = [
    "medico",
    "recepcionista",
] as const;

// ============================================================
// VALIDACIONES REUTILIZABLES
// ============================================================

const nombreSchema = z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres");

const emailSchema = z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresá un correo electrónico válido");

const passwordSchema = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres");

const rolSchema = z.enum(ROLES_GESTIONABLES, {
    error: "Seleccioná un rol válido",
});

const medicoSchema = z
    .string()
    .regex(
        /^[a-f\d]{24}$/i,
        "El identificador del médico no es válido"
    )
    .nullable();

// ============================================================
// CREAR USUARIO
// ============================================================

export const crearUsuarioSchema = z
    .object({
        nombre: nombreSchema,
        email: emailSchema,
        password: passwordSchema,
        rol: rolSchema,
        medico: medicoSchema.optional(),
    })
    .superRefine((data, ctx) => {
        // Si es médico, debe seleccionar un médico existente.
        if (data.rol === "medico" && !data.medico) {
            ctx.addIssue({
                code: "custom",
                path: ["medico"],
                message: "Debés seleccionar un médico",
            });
        }

        // Un recepcionista no puede tener un médico asociado.
        if (data.rol === "recepcionista" && data.medico) {
            ctx.addIssue({
                code: "custom",
                path: ["medico"],
                message: "Un recepcionista no puede tener un médico asociado",
            });
        }
    });

// ============================================================
// ACTUALIZAR USUARIO
// ============================================================

export const actualizarUsuarioSchema = z
    .object({
        nombre: nombreSchema.optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional(),
        rol: rolSchema.optional(),
        medico: medicoSchema.optional(),
    })
    .superRefine((data, ctx) => {
        // Si se modifica el rol a médico, debe enviarse su asociación.
        if (data.rol === "medico" && !data.medico) {
            ctx.addIssue({
                code: "custom",
                path: ["medico"],
                message: "Debés seleccionar un médico",
            });
        }

        // Un recepcionista no puede tener un médico asociado.
        if (data.rol === "recepcionista" && data.medico) {
            ctx.addIssue({
                code: "custom",
                path: ["medico"],
                message: "Un recepcionista no puede tener un médico asociado",
            });
        }

        // Evitar solicitudes de actualización vacías.
        if (Object.keys(data).length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Debés proporcionar al menos un campo para actualizar",
            });
        }
    });

// ============================================================
// TIPOS INFERIDOS
// ============================================================

export type CrearUsuarioSchema = z.infer<typeof crearUsuarioSchema>;

export type ActualizarUsuarioSchema = z.infer<typeof actualizarUsuarioSchema>;
