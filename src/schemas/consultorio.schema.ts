import { z } from "zod";

export const alaConsultorioSchema = z.enum([
    "NORTE",
    "SUR",
    "ESTE",
    "OESTE",
    "CENTRAL",
]);

export const equipamientoConsultorioSchema =
    z.enum([
        "CAMILLA",
        "ELECTROCARDIOGRAFO",
        "NEBULIZADOR",
        "ECOGRAFO",
        "OTOSCOPIO",
        "OPHTALMOSCOPIO",
        "TENSIOMETRO",
        "BALANZA",
        "ESTETOSCOPIO",
    ]);

export const consultorioSchema = z.object({
    nombre: z
        .string()
        .min(
            1,
            "El nombre del consultorio es obligatorio"
        )
        .trim(),

    numero: z
        .string()
        .min(
            1,
            "El número de consultorio es obligatorio"
        )
        .trim(),

    piso: z
        .string()
        .min(
            1,
            "El piso es obligatorio"
        )
        .trim(),

    ala: alaConsultorioSchema,

    especialidades: z.array(
        z.string()
    ),

    equipamiento: z.array(
        equipamientoConsultorioSchema
    ),

    capacidad: z
        .number({
            message: "La capacidad debe ser un número",
        })
        .int(
            "La capacidad debe ser un número entero"
        )
        .min(
            1,
            "La capacidad mínima es 1"
        ),
});

export type ConsultorioFormData = z.infer<
    typeof consultorioSchema
>;