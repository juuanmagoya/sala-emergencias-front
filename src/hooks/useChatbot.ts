
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { consultarChatbot } from '@/api/chatbot.api';

import type {
    ConsultarChatbotData,
    ChatbotErrorResponse,
} from '@/types/chatbot';

// ============================================================
// HOOK CHATBOT
// ============================================================

export function useChatbot() {
    const mutation = useMutation({
        mutationFn: (datos: ConsultarChatbotData) =>
            consultarChatbot(datos),
    });

    // ========================================================
    // MANEJO DE ERRORES
    // ========================================================

    const errorAxios = axios.isAxiosError<ChatbotErrorResponse>(
        mutation.error
    )
        ? mutation.error
        : null;

    const errorData = errorAxios?.response?.data;

    const mensajeError =
        errorData?.message ??
        (mutation.error
            ? 'No se pudo procesar tu consulta. Intentá nuevamente.'
            : null);

    const limiteAlcanzado =
        errorAxios?.response?.status === 429;

    return {
        consultar: mutation.mutateAsync,

        respuesta: mutation.data?.data ?? null,

        cargando: mutation.isPending,

        error: mutation.error,

        mensajeError,

        limiteAlcanzado,

        consumo: mutation.data?.data.consumo ?? null,

        reiniciar: mutation.reset,
    };
}
