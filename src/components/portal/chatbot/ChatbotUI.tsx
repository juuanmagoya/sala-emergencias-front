
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, ShieldCheck } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatbot } from "@/hooks/useChatbot";

import type {
    FuenteChatbot,
    ConsumoChatbot,
    ChatbotErrorResponse,
} from "@/types/chatbot";

interface MensajeChat {
    id: string;
    tipo: "usuario" | "asistente";
    contenido: string;
    fuentes?: FuenteChatbot[];
    hora: string;
}

function obtenerHora(): string {
    return new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ChatbotUI() {
    const { consultar, cargando, reiniciar } = useChatbot();

    const [mensajes, setMensajes] = useState<MensajeChat[]>(() => [
        {
            id: crypto.randomUUID(),
            tipo: "asistente",
            contenido:
                "¡Hola! Soy el asistente virtual de orientación médica. Puedo ayudarte a resolver dudas sobre síntomas, cuidados generales, prevención y primeros auxilios.\n\n¿En qué puedo ayudarte hoy?",
            hora: obtenerHora(),
        },
    ]);

    const [consumo, setConsumo] = useState<ConsumoChatbot | null>(null);

    const mensajesRef = useRef<HTMLDivElement>(null);
    const enviandoRef = useRef(false);

    const limiteAlcanzado = consumo?.restantes === 0;

    useEffect(() => {
        mensajesRef.current?.scrollTo({
            top: mensajesRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [mensajes, cargando]);

    const agregarMensaje = (
        tipo: MensajeChat["tipo"],
        contenido: string,
        fuentes?: FuenteChatbot[]
    ) => {
        const nuevoMensaje: MensajeChat = {
            id: crypto.randomUUID(),
            tipo,
            contenido,
            fuentes,
            hora: obtenerHora(),
        };

        setMensajes((actuales) => [...actuales, nuevoMensaje]);
    };

    const enviarPregunta = async (pregunta: string) => {
        if (enviandoRef.current || limiteAlcanzado) return;

        enviandoRef.current = true;
        reiniciar();

        agregarMensaje("usuario", pregunta);

        try {
            const resultado = await consultar({ pregunta });

            agregarMensaje(
                "asistente",
                resultado.data.respuesta,
                resultado.data.fuentes
            );

            setConsumo(resultado.data.consumo);
        } catch (error: unknown) {
            let mensajeError =
                "No pudimos procesar tu consulta. Intentá nuevamente más tarde.";

            if (axios.isAxiosError<ChatbotErrorResponse>(error)) {
                const respuestaError = error.response?.data;

                if (respuestaError?.message) {
                    mensajeError = respuestaError.message;
                }

                if (
                    error.response?.status === 429 &&
                    respuestaError?.data
                ) {
                    setConsumo({
                        consultas: respuestaError.data.consultas,
                        restantes: respuestaError.data.restantes,
                        limiteDiario: 3,
                        fecha: respuestaError.data.fecha,
                    });
                }
            }

            agregarMensaje("asistente", mensajeError);
        } finally {
            enviandoRef.current = false;
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Encabezado */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                        <Bot size={23} />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">
                            Asistente médico virtual
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Orientación y consultas generales
                        </p>
                    </div>
                </div>

                <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">
                        Disponible
                    </span>
                </div>
            </div>

            {/* Consumo diario */}
            {consumo && (
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-2.5">
                    <span className="text-xs text-slate-500">
                        Consultas utilizadas hoy
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                        {consumo.consultas} de {consumo.limiteDiario}
                        {" · "}
                        {consumo.restantes} restantes
                    </span>
                </div>
            )}

            {/* Mensajes */}
            <div
                ref={mensajesRef}
                className="flex-1 space-y-6 overflow-y-auto bg-slate-50/70 px-4 py-8 sm:px-8 lg:px-10"
                aria-live="polite"
                aria-label="Conversación con el asistente"
            >
                {mensajes.map((mensaje) => (
                    <ChatMessage
                        key={mensaje.id}
                        tipo={mensaje.tipo}
                        contenido={mensaje.contenido}
                        fuentes={mensaje.fuentes}
                        hora={mensaje.hora}
                    />
                ))}

                {cargando && (
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Bot size={18} />
                        </div>

                        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
                                </span>

                                <span className="text-xs text-slate-400">
                                    Preparando respuesta...
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Aviso de límite */}
            {limiteAlcanzado && (
                <div className="border-t border-amber-200 bg-amber-50 px-5 py-3">
                    <p className="text-center text-xs font-medium text-amber-800">
                        Alcanzaste el límite diario de consultas del asistente.
                    </p>
                </div>
            )}

            {/* Entrada */}
            <ChatInput
                onEnviar={enviarPregunta}
                cargando={cargando}
                limiteAlcanzado={Boolean(limiteAlcanzado)}
            />

            {/* Aviso médico */}
            <div className="flex items-start justify-center gap-2 border-t border-slate-100 bg-white px-4 py-3">
                <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                />
                <p className="max-w-2xl text-center text-[10px] leading-4 text-slate-400">
                    Este asistente brinda información orientativa y no reemplaza
                    la evaluación de un profesional de la salud. Ante una
                    emergencia, acudí a un centro de salud.
                </p>
            </div>
        </div>
    );
}
