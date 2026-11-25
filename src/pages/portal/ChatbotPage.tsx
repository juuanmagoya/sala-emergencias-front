
import { Bot, Info, MessageCircle, ShieldCheck } from "lucide-react";
import ChatbotUI from "@/components/portal/chatbot/ChatbotUI";

export default function ChatbotPage() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

            {/* Encabezado */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                            <Bot size={20} />
                        </div>

                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
                            Portal del paciente
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                        Asistente médico virtual
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                        Un espacio para resolver dudas sobre salud, conocer
                        recomendaciones generales y recibir orientación sobre
                        diferentes síntomas y cuidados.
                    </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2">
                    <MessageCircle size={17} className="text-cyan-700" />
                    <span className="text-xs font-medium text-cyan-800">
                        Hasta 3 consultas diarias
                    </span>
                </div>
            </div>

            {/* Información importante */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <Info size={19} className="mt-0.5 shrink-0 text-blue-600" />

                <div>
                    <h2 className="text-sm font-semibold text-blue-900">
                        ¿Cómo utilizar el asistente?
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-blue-800">
                        Escribí tu consulta con la mayor claridad posible.
                        Podés preguntar sobre síntomas frecuentes, prevención,
                        primeros auxilios y cuidados generales. El asistente
                        utiliza información de una base de conocimiento médica
                        para elaborar sus respuestas.
                    </p>
                </div>
            </div>

            {/* Chat */}
            <ChatbotUI />

            {/* Aviso */}
            <div className="flex items-start gap-2 px-1">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-slate-400" />

                <p className="text-xs leading-5 text-slate-400">
                    La información proporcionada es orientativa y no constituye
                    un diagnóstico ni reemplaza una consulta médica. No
                    suspendas ni inicies tratamientos basándote únicamente en
                    las respuestas del asistente.
                </p>
            </div>
        </div>
    );
}
