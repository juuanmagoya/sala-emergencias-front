
import {
    Bot,
    UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { FuenteChatbot } from "@/types/chatbot";

import ChatbotSources from "./ChatbotSources";

// ============================================================
// PROPS
// ============================================================

interface ChatMessageProps {
    tipo: "usuario" | "asistente";
    contenido: string;
    fuentes?: FuenteChatbot[];
    hora?: string;
}

// ============================================================
// COMPONENTE
// ============================================================

export default function ChatMessage({
    tipo,
    contenido,
    fuentes = [],
    hora,
}: ChatMessageProps) {
    const esUsuario = tipo === "usuario";

    return (
        <div
            className={cn(
                "flex w-full gap-3",
                esUsuario && "flex-row-reverse"
            )}
        >
            {/* AVATAR */}
            <div
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    esUsuario
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-slate-900 text-white"
                )}
                aria-hidden="true"
            >
                {esUsuario ? (
                    <UserRound size={17} />
                ) : (
                    <Bot size={18} />
                )}
            </div>

            {/* MENSAJE */}
                <div className={cn("flex min-w-0 max-w-[95%] flex-col gap-2 sm:max-w-[90%] lg:max-w-[85%]", esUsuario && "items-end")}>
                <div className={cn("rounded-2xl px-5 py-4 text-sm leading-7 sm:text-[15px]", esUsuario ? "rounded-tr-sm bg-cyan-600 text-white" : "rounded-tl-sm border border-slate-200 bg-white text-slate-700 shadow-sm")}>
                    <p className="whitespace-pre-wrap break-words">
                        {contenido}
                    </p>
                </div>

                {/* FUENTES */}
                {!esUsuario && fuentes.length > 0 && (
                    <ChatbotSources fuentes={fuentes} />
                )}

                {/* HORA */}
                {hora && (
                    <span className="px-1 text-[10px] text-slate-400">
                        {hora}
                    </span>
                )}
            </div>
        </div>
    );
}
