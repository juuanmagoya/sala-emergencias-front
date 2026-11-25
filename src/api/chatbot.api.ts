
import api from '@/api/axios';

import type {
    ConsultarChatbotData,
    ChatbotResponse,
} from '@/types/chatbot';

// ============================================================
// CONSULTAR CHATBOT
// ============================================================

/**
 * Enviar una pregunta al chatbot médico.
 *
 * La identidad del paciente se obtiene desde el JWT.
 * El backend controla el límite de 3 consultas diarias.
 */
export async function consultarChatbot(
    datos: ConsultarChatbotData
): Promise<ChatbotResponse> {
    const response = await api.post<ChatbotResponse>(
        '/chatbot/consultar',
        {
            pregunta: datos.pregunta,
        }
    );

    return response.data;
}
