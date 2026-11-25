
// ============================================================
// CONSULTA
// ============================================================

export interface ConsultarChatbotData {
    pregunta: string;
}

// ============================================================
// FUENTES
// ============================================================

export interface FuenteChatbot {
    articuloId: string;
    chunkId: string;
    titulo: string;
}

// ============================================================
// CONSUMO DIARIO
// ============================================================

export interface ConsumoChatbot {
    consultas: number;
    restantes: number;
    limiteDiario: number;
    fecha: string;
}

// ============================================================
// RESPUESTA
// ============================================================

export interface ChatbotData {
    pregunta: string;
    respuesta: string;
    modeloUtilizado: string | null;
    fuentes: FuenteChatbot[];
    consumo: ConsumoChatbot;
}

export interface ChatbotResponse {
    success: boolean;
    message: string;
    data: ChatbotData;
}

// ============================================================
// ERROR DE LÍMITE DIARIO
// ============================================================

export interface ChatbotErrorResponse {
    success: false;
    message: string;
    data?: {
        consultas: number;
        restantes: number;
        fecha: string;
    };
}
