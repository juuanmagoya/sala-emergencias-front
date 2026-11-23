import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .optional()
    .transform((valor) => (valor ? valor : undefined))
    .pipe(
        z
            .string()
            .email("El correo electrónico no es válido")
            .optional()
    );

const direccionSchema = z
    .object({
        calle: z.string().trim(),
        numero: z.string().trim(),
        piso: z.string().trim(),
        departamento: z.string().trim(),
        barrio: z.string().trim(),
    })
    .optional()
    .superRefine((direccion, ctx) => {
        if (!direccion) return;

        const tieneDatos = Object.values(direccion).some(
            (valor) => valor.trim() !== ""
        );

        if (!tieneDatos) return;

        if (direccion.calle.trim() === "") {
            ctx.addIssue({
                code: "custom",
                path: ["calle"],
                message: "La calle es obligatoria",
            });
        }

        if (direccion.numero.trim() === "") {
            ctx.addIssue({
                code: "custom",
                path: ["numero"],
                message: "El número es obligatorio",
            });
        }
    })
    .transform((direccion) => {
        if (!direccion) return undefined;

        const tieneDatos = Object.values(direccion).some(
            (valor) => valor.trim() !== ""
        );

        return tieneDatos ? direccion : undefined;
    })
    .optional();

export const pacienteSchema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    dni: z
        .string()
        .regex(/^[0-9]{7,8}$/, "El DNI debe tener entre 7 y 8 dígitos"),

    email: emailSchema,

    direccion: direccionSchema,

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