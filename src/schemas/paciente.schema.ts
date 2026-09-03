import { z } from "zod";

export const pacienteSchema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    dni: z
        .string()
        .regex(/^[0-9]{7,8}$/, "El DNI debe tener entre 7 y 8 dígitos"),

    email: z
        .string()
        .email("El correo electrónico no es válido"),

    direccion: z.object({
        calle: z
            .string()
            .min(1, "La calle es obligatoria"),

        numero: z
            .string()
            .min(1, "El número es obligatorio"),

        piso: z.string(),

        departamento: z.string(),

        barrio: z.string(),
    }),

    telefono: z.object({
        tipo: z.enum(["CELULAR", "FIJO", "TRABAJO"]),

        codigoArea: z
            .string()
            .regex(
                /^[0-9]{2,5}$/,
                "El código de área no es válido"
            ),

        numero: z
            .string()
            .regex(
                /^[0-9]{7,10}$/,
                "El número de teléfono no es válido"
            ),
    }),

    obraSocial: z.object({
        nombre: z.enum([
            "PAMI",
            "OSPEL",
            "OSDE",
            "SANCOR",
            "OSECAC",
            "SWISS MEDICAL",
            "GALENO",
            "MEDICUS",
            "OMINT",
            "FEMEBA",
            "OTRAS",
            "NINGUNA",
        ]),

        numeroAfiliado: z.string(),
    }),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;