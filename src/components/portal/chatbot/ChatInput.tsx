
import { useState, type KeyboardEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { consultarChatbotSchema } from "@/schemas/chatbot.schema";

interface ChatInputProps {
    onEnviar: (pregunta: string) => void;
    deshabilitado?: boolean;
    cargando?: boolean;
    limiteAlcanzado?: boolean;
}

export default function ChatInput({
    onEnviar,
    deshabilitado = false,
    cargando = false,
    limiteAlcanzado = false,
}: ChatInputProps) {
    const [pregunta, setPregunta] = useState("");
    const [errorValidacion, setErrorValidacion] = useState("");

    const enviarPregunta = () => {
        const resultado = consultarChatbotSchema.safeParse({
            pregunta,
        });

        if (!resultado.success) {
            setErrorValidacion(
                resultado.error.issues[0]?.message ?? "Ingresá una pregunta válida."
            );
            return;
        }

        if (deshabilitado || cargando || limiteAlcanzado) return;

        setErrorValidacion("");
        setPregunta("");
        onEnviar(resultado.data.pregunta);
    };

    const manejarTecla = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            enviarPregunta();
        }
    };

    const bloqueado = deshabilitado || cargando || limiteAlcanzado;
    const puedeEnviar = pregunta.trim().length > 0 && !bloqueado;

    return (
        <div className="border-t border-slate-200 bg-white p-4">
            <div className="mx-auto max-w-4xl">
                <div
                    className={`relative rounded-2xl border bg-slate-50 transition ${
                        errorValidacion
                            ? "border-red-300 focus-within:border-red-400"
                            : "border-slate-200 focus-within:border-cyan-400"
                    }`}
                >
                    <textarea
                        value={pregunta}
                        onChange={(event) => {
                            setPregunta(event.target.value);
                            if (errorValidacion) setErrorValidacion("");
                        }}
                        onKeyDown={manejarTecla}
                        placeholder={
                            limiteAlcanzado
                                ? "Alcanzaste el límite diario de consultas"
                                : "Escribí tu consulta médica..."
                        }
                        disabled={bloqueado}
                        maxLength={1000}
                        rows={2}
                        aria-label="Escribí tu consulta"
                        aria-describedby="chat-input-info"
                        className="max-h-36 min-h-20 w-full resize-none bg-transparent px-4 pt-4 pb-2 pr-14 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                        type="button"
                        onClick={enviarPregunta}
                        disabled={!puedeEnviar}
                        aria-label="Enviar consulta"
                        className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {cargando ? (
                            <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                            <Send size={17} />
                        )}
                    </button>
                </div>

                <div
                    id="chat-input-info"
                    className="mt-2 flex items-center justify-between gap-3 px-1"
                >
                    <div>
                        {errorValidacion ? (
                            <p className="text-xs text-red-500">
                                {errorValidacion}
                            </p>
                        ) : limiteAlcanzado ? (
                            <p className="text-xs text-amber-600">
                                Podrás volver a consultar cuando se renueve tu límite diario.
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400">
                                Enter para enviar · Shift + Enter para nueva línea
                            </p>
                        )}
                    </div>

                    <span
                        className={`shrink-0 text-xs ${
                            pregunta.length >= 900
                                ? "text-amber-600"
                                : "text-slate-400"
                        }`}
                    >
                        {pregunta.length}/1000
                    </span>
                </div>
            </div>
        </div>
    );
}
