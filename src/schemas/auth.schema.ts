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
 * Validaciones de la modalidad Paciente.
 *
 * Solo se exige que ambos campos estén presentes. El formato y la
 * validez definitiva de las credenciales los resuelve el backend.
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
