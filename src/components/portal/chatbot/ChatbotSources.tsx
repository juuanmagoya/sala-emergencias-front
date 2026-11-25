
import { useState } from "react";

import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    FileText,
} from "lucide-react";

import type { FuenteChatbot } from "@/types/chatbot";

// ============================================================
// PROPS
// ============================================================

interface ChatbotSourcesProps {
    fuentes: FuenteChatbot[];
}

// ============================================================
// COMPONENTE
// ============================================================

export default function ChatbotSources({
    fuentes,
}: ChatbotSourcesProps) {
    const [abiertas, setAbiertas] = useState(false);

    if (fuentes.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <button
                type="button"
                onClick={() => setAbiertas(!abiertas)}
                aria-expanded={abiertas}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-100"
            >
                <span className="flex min-w-0 items-center gap-2">
                    <BookOpen
                        size={15}
                        className="shrink-0 text-cyan-600"
                    />

                    <span className="text-xs font-semibold text-slate-700">
                        Fuentes consultadas ({fuentes.length})
                    </span>
                </span>

                {abiertas ? (
                    <ChevronUp
                        size={15}
                        className="shrink-0 text-slate-400"
                    />
                ) : (
                    <ChevronDown
                        size={15}
                        className="shrink-0 text-slate-400"
                    />
                )}
            </button>

            {abiertas && (
                <div className="space-y-2 border-t border-slate-200 p-3">
                    {fuentes.map((fuente) => (
                        <div
                            key={fuente.chunkId}
                            className="flex items-start gap-2 rounded-lg bg-white p-3"
                        >
                            <FileText
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <div className="min-w-0">
                                <p className="break-words text-xs font-medium leading-5 text-slate-700">
                                    {fuente.titulo}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">
                                    Artículo: {fuente.articuloId}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
