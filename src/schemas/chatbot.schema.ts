
import { z } from 'zod';

// ============================================================
// SCHEMA DE CONSULTA DEL CHATBOT
// ============================================================

export const consultarChatbotSchema = z.object({
    pregunta: z
        .string({
            error: 'La pregunta debe ser un texto',
        })
        .trim()
        .min(1, 'Escribí una pregunta para continuar')
        .max(1000, 'La pregunta no puede superar los 1000 caracteres'),
});

// ============================================================
// TIPOS INFERIDOS
// ============================================================

export type ConsultarChatbotFormData = z.infer<
    typeof consultarChatbotSchema
>;
