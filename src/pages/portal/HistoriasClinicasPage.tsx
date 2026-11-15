import { useMemo } from "react";

import {
    AlertCircle,
    FileText,
    LoaderCircle,
    RotateCcw,
} from "lucide-react";

import HistoriaClinicaCard from "@/components/portal/HistoriaClinicaCard";

import { useMiHistorial } from "@/hooks/useHistoriaClinica";

export default function HistoriasClinicasPage() {
    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useMiHistorial();

    // El backend ya devuelve el historial ordenado. Se ordena también
    // acá para que la vista no dependa del orden de la respuesta.
    const historias = useMemo(() => {
        const registros = data?.data ?? [];

        return [...registros].sort((primera, segunda) => {
            const fechaPrimera = new Date(
                primera.fechaAtencion
            ).getTime();

            const fechaSegunda = new Date(
                segunda.fechaAtencion
            ).getTime();

            return fechaSegunda - fechaPrimera;
        });
    }, [data]);

    const total = historias.length;

    return (
        <div className="space-y-6">
            {/* ENCABEZADO */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                        <FileText size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Historias clínicas
                        </h1>

                        <p className="text-sm text-slate-500">
                            Consultá los registros de tus
                            atenciones médicas
                        </p>
                    </div>
                </div>

                {!isLoading && !isError && total > 0 && (
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 sm:self-auto">
                        <FileText size={14} />

                        {total}{" "}
                        {total === 1 ? "registro" : "registros"}
                    </span>
                )}
            </header>

            {/* CARGANDO */}
            {isLoading && (
                <div
                    role="status"
                    className="flex min-h-[320px] items-center justify-center"
                >
                    <div className="flex items-center gap-3 text-slate-500">
                        <LoaderCircle className="h-6 w-6 animate-spin" />

                        <span className="text-sm">
                            Cargando tus historias clínicas...
                        </span>
                    </div>
                </div>
            )}

            {/* ERROR */}
            {!isLoading && isError && (
                <div className="flex min-h-[320px] items-center justify-center px-4">
                    <div
                        role="alert"
                        className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
                    >
                        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

                        <h2 className="font-semibold text-red-800">
                            No pudimos cargar tus historias
                            clínicas
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-red-700">
                            Ocurrió un error al consultar tus
                            registros. Intentá nuevamente en
                            unos instantes.
                        </p>

                        <button
                            type="button"
                            onClick={() => void refetch()}
                            disabled={isFetching}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RotateCcw
                                size={16}
                                className={
                                    isFetching
                                        ? "animate-spin"
                                        : undefined
                                }
                            />

                            {isFetching
                                ? "Reintentando..."
                                : "Reintentar"}
                        </button>
                    </div>
                </div>
            )}

            {/* SIN REGISTROS */}
            {!isLoading && !isError && total === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                        <FileText size={26} />
                    </div>

                    <h2 className="text-base font-semibold text-slate-800">
                        Todavía no tenés historias clínicas
                    </h2>

                    <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                        Los registros de tus atenciones
                        aparecerán acá cuando estén
                        disponibles.
                    </p>
                </div>
            )}

            {/* CON REGISTROS */}
            {!isLoading && !isError && total > 0 && (
                <div className="space-y-4">
                    {historias.map((historia) => (
                        <HistoriaClinicaCard
                            key={historia.id}
                            historia={historia}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
