
import { z } from "zod";

export const registroPacienteSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, "Ingresá tu nombre completo")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    dni: z
        .string()
        .trim()
        .regex(
            /^[0-9]{7,8}$/,
            "El DNI debe tener entre 7 y 8 dígitos"
        ),

    email: z
        .string()
        .trim()
        .email("Ingresá un correo electrónico válido"),

    telefono: z.object({
        codigoArea: z
            .string()
            .trim()
            .regex(
                /^[0-9]{2,5}$/,
                "El código de área debe tener entre 2 y 5 dígitos"
            ),

        numero: z
            .string()
            .trim()
            .regex(
                /^[0-9]{7,10}$/,
                "El número debe tener entre 7 y 10 dígitos"
            ),
    }),
});

export type RegistroPacienteFormData = z.infer<
    typeof registroPacienteSchema
>;
