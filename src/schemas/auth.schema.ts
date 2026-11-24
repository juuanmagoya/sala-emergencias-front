
import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "El email es obligatorio")
        .email("Ingresá un email válido"),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Validaciones de las credenciales iniciales del paciente.
 */
export const loginPacienteSchema = z.object({
    dni: z
        .string()
        .trim()
        .min(1, "El DNI es obligatorio"),

    telefono: z
        .string()
        .trim()
        .min(1, "El teléfono es obligatorio"),
});

export type LoginPacienteFormData = z.infer<
    typeof loginPacienteSchema
>;

/**
 * Validación del código OTP enviado al correo.
 */
export const verificarOtpPacienteSchema = z.object({
    codigo: z
        .string()
        .trim()
        .length(6, "El código debe tener 6 dígitos")
        .regex(
            /^\d{6}$/,
            "El código debe contener únicamente números"
        ),
});

export type VerificarOtpPacienteFormData = z.infer<
    typeof verificarOtpPacienteSchema
>;
