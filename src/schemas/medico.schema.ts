import { z } from "zod";

// ============================================
// HORARIOS
// ============================================

const horarioSchema = z
    .object({
        dia: z.enum([
            "LUNES",
            "MARTES",
            "MIERCOLES",
            "JUEVES",
            "VIERNES",
            "SABADO",
        ]),

        horaInicio: z
            .string()
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                "Formato de hora inválido"
            ),

        horaFin: z
            .string()
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                "Formato de hora inválido"
            ),
    })
    .refine(
        (horario) => horario.horaInicio < horario.horaFin,
        {
            message: "La hora de inicio debe ser anterior a la hora de fin",
            path: ["horaFin"],
        }
    );

// ============================================
// MÉDICO
// ============================================

export const medicoSchema = z.object({
    nombre: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    apellido: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede superar los 100 caracteres"),

    matricula: z
        .string()
        .regex(
            /^[0-9]{6,8}$/,
            "La matrícula debe tener entre 6 y 8 dígitos"
        ),

    especialidad: z
        .string()
        .min(1, "La especialidad es obligatoria"),

    email: z
        .string()
        .email("El email no es válido"),

    telefono: z.object({
        tipo: z.enum([
            "CELULAR",
            "FIJO",
            "TRABAJO",
        ]),

        codigoArea: z
            .string()
            .regex(
                /^[0-9]{2,5}$/,
                "El código de área debe tener entre 2 y 5 dígitos"
            ),

        numero: z
            .string()
            .regex(
                /^[0-9]{7,10}$/,
                "El número debe tener entre 7 y 10 dígitos"
            ),
    }),

    // ============================================
    // HORARIOS DE ATENCIÓN
    // ============================================

    horariosAtencion: z
        .array(horarioSchema)
        .min(1, "Debe agregar al menos un horario de atención"),

    // ============================================
    // DURACIÓN DE LOS TURNOS
    // ============================================

    duracionTurno: z
        .number({
            message: "La duración del turno es obligatoria",
        })
        .int("La duración debe ser un número entero")
        .min(5, "La duración mínima es de 5 minutos")
        .max(240, "La duración máxima es de 240 minutos"),
});

export type MedicoFormData = z.infer<typeof medicoSchema>;