
import {
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";

import axios from "axios";

import {
    AlertCircle,
    CircleCheck,
    FileSpreadsheet,
    LoaderCircle,
    RefreshCw,
    Table2,
    UploadCloud,
    X,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    usePrevisualizarImportacionPacientes,
    useConfirmarImportacionPacientes,
} from "@/hooks/useImportacionPacientes";

import ImportacionPacientesTable from "@/components/pacientes/ImportacionPacientesTable";

import type {
    ImportacionPacientesErrorResponse,
    ResultadoPrevisualizacion,
    ResultadoConfirmacion,
} from "@/types/importacionPacientes";

const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;

interface ImportarPacientesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function validarArchivo(archivo: File): string | null {
    if (!archivo.name.toLowerCase().endsWith(".xlsx")) {
        return "Solo se aceptan archivos con extensión .xlsx.";
    }

    if (archivo.size === 0) {
        return "El archivo está vacío. Seleccioná un Excel con pacientes.";
    }

    if (archivo.size > TAMANO_MAXIMO_BYTES) {
        return "El archivo supera el tamaño máximo permitido de 5 MB.";
    }

    return null;
}

function formatearTamano(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kilobytes = bytes / 1024;

    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(1).replace(".", ",")} KB`;
    }

    return `${(kilobytes / 1024).toFixed(2).replace(".", ",")} MB`;
}

function obtenerHojasDisponibles(error: unknown): string[] {
    if (
        !axios.isAxiosError<ImportacionPacientesErrorResponse>(
            error
        )
    ) {
        return [];
    }

    const data = error.response?.data?.data;

    if (!data || !("hojasDisponibles" in data)) {
        return [];
    }

    return Array.isArray(data.hojasDisponibles)
        ? data.hojasDisponibles.filter(
              (hoja): hoja is string =>
                  typeof hoja === "string" && hoja.trim() !== ""
          )
        : [];
}

function obtenerMensajeError(
    error: unknown,
    accion: "analizar" | "importar"
): string {
    const mensajeGenerico =
        accion === "analizar"
            ? "Ocurrió un error inesperado al analizar el archivo. Intentá nuevamente."
            : "Ocurrió un error inesperado al importar los pacientes.";

    if (
        !axios.isAxiosError<ImportacionPacientesErrorResponse>(
            error
        )
    ) {
        return mensajeGenerico;
    }

    if (!error.response) {
        return "No pudimos comunicarnos con el servidor. Revisá la conexión e intentá nuevamente.";
    }

    const mensaje = error.response.data?.message;

    return typeof mensaje === "string" && mensaje.trim()
        ? mensaje.trim()
        : mensajeGenerico;
}

interface ResumenItemProps {
    etiqueta: string;
    valor: number;
    color?: string;
}

function ResumenItem({
    etiqueta,
    valor,
    color = "text-slate-900",
}: ResumenItemProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {etiqueta}
            </p>
            <p className={`mt-1 text-lg font-semibold ${color}`}>
                {valor.toLocaleString("es-AR")}
            </p>
        </div>
    );
}

export default function ImportarPacientesDialog({
    open,
    onOpenChange,
}: ImportarPacientesDialogProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const previewMutation =
        usePrevisualizarImportacionPacientes();

    const confirmMutation =
        useConfirmarImportacionPacientes();

    const [archivo, setArchivo] = useState<File | null>(null);

    const [hojaSeleccionada, setHojaSeleccionada] =
        useState("");

    const [hojasDisponibles, setHojasDisponibles] =
        useState<string[]>([]);

    const [previsualizacion, setPrevisualizacion] =
        useState<ResultadoPrevisualizacion | null>(null);

    const [resultadoConfirmacion, setResultadoConfirmacion] =
        useState<ResultadoConfirmacion | null>(null);

    const [errorArchivo, setErrorArchivo] =
        useState<string | null>(null);

    const [errorAnalisis, setErrorAnalisis] =
        useState<string | null>(null);

    const [errorConfirmacion, setErrorConfirmacion] =
        useState<string | null>(null);

    const [arrastrando, setArrastrando] = useState(false);

    const isPending = previewMutation.isPending;
    const isConfirming = confirmMutation.isPending;

    const estaProcesando = isPending || isConfirming;

    const requiereSeleccionarHoja =
        hojasDisponibles.length > 0;

    const puedeAnalizar =
        Boolean(archivo) &&
        !estaProcesando &&
        (!requiereSeleccionarHoja || Boolean(hojaSeleccionada));

    const candidatas =
        previsualizacion?.resumen.validas ?? 0;

    const puedeImportar =
        Boolean(archivo) &&
        Boolean(previsualizacion) &&
        candidatas > 0 &&
        !estaProcesando &&
        !resultadoConfirmacion;

    const limpiarEstado = () => {
        setArchivo(null);
        setHojaSeleccionada("");
        setHojasDisponibles([]);
        setPrevisualizacion(null);
        setResultadoConfirmacion(null);
        setErrorArchivo(null);
        setErrorAnalisis(null);
        setErrorConfirmacion(null);
        setArrastrando(false);

        previewMutation.reset();
        confirmMutation.reset();
    };

    const handleOpenChange = (nuevoOpen: boolean) => {
        if (!nuevoOpen && estaProcesando) {
            return;
        }

        if (!nuevoOpen) {
            limpiarEstado();
        }

        onOpenChange(nuevoOpen);
    };

    const seleccionarArchivo = (nuevoArchivo: File) => {
        const error = validarArchivo(nuevoArchivo);

        if (error) {
            setArchivo(null);
            setHojaSeleccionada("");
            setHojasDisponibles([]);
            setPrevisualizacion(null);
            setResultadoConfirmacion(null);
            setErrorAnalisis(null);
            setErrorConfirmacion(null);
            setErrorArchivo(error);

            previewMutation.reset();
            confirmMutation.reset();

            return;
        }

        setArchivo(nuevoArchivo);
        setHojaSeleccionada("");
        setHojasDisponibles([]);
        setPrevisualizacion(null);
        setResultadoConfirmacion(null);
        setErrorArchivo(null);
        setErrorAnalisis(null);
        setErrorConfirmacion(null);

        previewMutation.reset();
        confirmMutation.reset();
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const nuevoArchivo = event.target.files?.[0];

        if (nuevoArchivo) {
            seleccionarArchivo(nuevoArchivo);
        }

        // Permite volver a seleccionar el mismo archivo.
        event.target.value = "";
    };

    const abrirSelectorArchivo = () => {
        if (!estaProcesando) {
            inputRef.current?.click();
        }
    };

    const handleDragOver = (
        event: DragEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();

        if (estaProcesando) {
            return;
        }

        event.dataTransfer.dropEffect = "copy";
        setArrastrando(true);
    };

    const handleDragLeave = () => {
        setArrastrando(false);
    };

    const handleDrop = (
        event: DragEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        setArrastrando(false);

        if (estaProcesando) {
            return;
        }

        const archivos = event.dataTransfer.files;

        if (archivos.length === 0) {
            return;
        }

        if (archivos.length > 1) {
            setErrorArchivo(
                "Seleccioná un solo archivo .xlsx por importación."
            );
            return;
        }

        seleccionarArchivo(archivos[0]);
    };

    const quitarArchivo = () => {
        if (estaProcesando) {
            return;
        }

        limpiarEstado();
    };

    const analizarArchivo = async () => {
        if (!archivo || !puedeAnalizar) {
            return;
        }

        setErrorAnalisis(null);
        setErrorConfirmacion(null);
        setPrevisualizacion(null);
        setResultadoConfirmacion(null);

        confirmMutation.reset();

        try {
            const respuesta =
                await previewMutation.mutateAsync({
                    archivo,
                    ...(hojaSeleccionada
                        ? { hoja: hojaSeleccionada }
                        : {}),
                });

            setPrevisualizacion(respuesta.data);
            setHojasDisponibles([]);

            setHojaSeleccionada(
                respuesta.data.hojaProcesada
            );
        } catch (error: unknown) {
            const hojas = obtenerHojasDisponibles(error);

            if (hojas.length > 0) {
                setHojasDisponibles(hojas);
                setHojaSeleccionada("");
                setErrorAnalisis(null);
                return;
            }

            setErrorAnalisis(
                obtenerMensajeError(error, "analizar")
            );
        }
    };

    const confirmarImportacion = async () => {
        if (!archivo || !puedeImportar || !previsualizacion) {
            return;
        }

        setErrorConfirmacion(null);

        try {
            const respuesta =
                await confirmMutation.mutateAsync({
                    archivo,
                    hoja: previsualizacion.hojaProcesada,
                });

            setResultadoConfirmacion(respuesta.data);
        } catch (error: unknown) {
            setErrorConfirmacion(
                obtenerMensajeError(error, "importar")
            );
        }
    };

    const resumen = previsualizacion?.resumen;
    const resumenFinal = resultadoConfirmacion?.resumen;

    const filasMostradas =
        resultadoConfirmacion?.filas ??
        previsualizacion?.filas ??
        [];

    const importacionFinalizada =
        resultadoConfirmacion !== null;

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent
                size="5xl"
                showCloseButton={!estaProcesando}
                className="max-h-[95vh] overflow-y-auto p-0"
            >
                <div className="sticky top-0 z-10 rounded-t-2xl bg-linear-to-r from-emerald-600 to-teal-600 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                            <FileSpreadsheet
                                size={24}
                                className="text-emerald-100"
                            />
                            Importar pacientes desde Excel
                        </DialogTitle>

                        <DialogDescription className="mt-1 text-emerald-100">
                            Subí un archivo .xlsx para revisar la
                            información antes de importarla.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="space-y-5 bg-slate-50/60 p-6">
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="hidden"
                        onChange={handleInputChange}
                    />

                    {!archivo ? (
                        <button
                            type="button"
                            onClick={abrirSelectorArchivo}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            disabled={estaProcesando}
                            className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                                arrastrando
                                    ? "border-emerald-500 bg-emerald-100/80 shadow-inner"
                                    : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-50"
                            } ${estaProcesando ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md ring-1 ring-emerald-100">
                                <UploadCloud size={26} />
                            </div>

                            <p className="mt-4 text-base font-semibold text-slate-800">
                                Arrastrá tu Excel acá
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                o hacé clic para seleccionarlo
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                                <span className="rounded-full bg-white/90 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                                    .xlsx
                                </span>

                                <span className="rounded-full bg-white/90 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                                    Máximo 5 MB
                                </span>

                                <span className="rounded-full bg-white/90 px-3 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
                                    Hasta 1000 filas
                                </span>
                            </div>
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <FileSpreadsheet size={24} />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="truncate text-sm font-semibold text-slate-900"
                                        title={archivo.name}
                                    >
                                        {archivo.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {formatearTamano(archivo.size)} ·
                                        Archivo Excel (.xlsx)
                                    </p>
                                </div>
                            </div>

                            {!importacionFinalizada && (
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={abrirSelectorArchivo}
                                        disabled={estaProcesando}
                                        className="rounded-lg"
                                    >
                                        <RefreshCw />
                                        Reemplazar
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={quitarArchivo}
                                        disabled={estaProcesando}
                                        className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <X />
                                        Quitar
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {errorArchivo && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <p>{errorArchivo}</p>
                        </div>
                    )}

                    {requiereSeleccionarHoja && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <Table2 size={20} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-amber-900">
                                        El archivo contiene varias hojas
                                    </h3>

                                    <p className="mt-1 text-sm text-amber-700">
                                        Elegí la hoja que querés analizar
                                        y volvé a ejecutar la previsualización.
                                    </p>

                                    <label
                                        htmlFor="hoja-importacion"
                                        className="mt-4 block text-xs font-semibold uppercase tracking-wide text-amber-800"
                                    >
                                        Hoja a analizar
                                    </label>

                                    <select
                                        id="hoja-importacion"
                                        value={hojaSeleccionada}
                                        onChange={(event) => {
                                            setHojaSeleccionada(
                                                event.target.value
                                            );
                                            setErrorAnalisis(null);
                                        }}
                                        disabled={estaProcesando}
                                        className="mt-2 w-full rounded-xl border-2 border-amber-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <option value="">
                                            Seleccioná una hoja
                                        </option>

                                        {hojasDisponibles.map(
                                            (hoja) => (
                                                <option
                                                    key={hoja}
                                                    value={hoja}
                                                >
                                                    {hoja}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {errorAnalisis && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                            <div>
                                <p className="font-semibold">
                                    No se pudo analizar el archivo
                                </p>

                                <p className="mt-1 text-red-600">
                                    {errorAnalisis}
                                </p>
                            </div>
                        </div>
                    )}

                    {errorConfirmacion && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                            <div>
                                <p className="font-semibold">
                                    No se pudo completar la importación
                                </p>

                                <p className="mt-1 text-red-600">
                                    {errorConfirmacion}
                                </p>
                            </div>
                        </div>
                    )}

                    {isPending && (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-sm text-emerald-700"
                        >
                            <LoaderCircle className="h-5 w-5 animate-spin" />

                            Analizando el archivo. Esto puede demorar
                            unos segundos.
                        </div>
                    )}

                    {isConfirming && (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700"
                        >
                            <LoaderCircle className="h-5 w-5 animate-spin" />

                            Importando pacientes. No cierres esta ventana
                            mientras se procesa el archivo.
                        </div>
                    )}

                    {/* RESUMEN DE LA PREVISUALIZACIÓN */}
                    {previsualizacion && resumen && !importacionFinalizada && (
                        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <CircleCheck size={24} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">
                                            Análisis completado
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Hoja procesada:{" "}
                                            <span className="font-medium text-slate-700">
                                                {previsualizacion.hojaProcesada}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                                    {previsualizacion.columnasIdentificadas.length}{" "}
                                    columnas reconocidas
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                <ResumenItem
                                    etiqueta="Filas analizadas"
                                    valor={resumen.totalFilas}
                                />

                                <ResumenItem
                                    etiqueta="Válidas"
                                    valor={resumen.validas}
                                    color="text-emerald-600"
                                />

                                <ResumenItem
                                    etiqueta="Inválidas"
                                    valor={resumen.invalidas}
                                    color="text-red-600"
                                />

                                <ResumenItem
                                    etiqueta="Existentes"
                                    valor={resumen.existentes}
                                    color="text-amber-600"
                                />

                                <ResumenItem
                                    etiqueta="Conflictos email"
                                    valor={resumen.conflictosEmail}
                                    color="text-rose-600"
                                />

                                <ResumenItem
                                    etiqueta="Con advertencias"
                                    valor={resumen.conAdvertencias}
                                    color="text-violet-600"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                                <span>
                                    Duplicadas en archivo:{" "}
                                    {resumen.duplicadasEnArchivo}
                                </span>

                                <span>
                                    Vacías: {resumen.vacias}
                                </span>

                                <span>
                                    Columnas ignoradas:{" "}
                                    {previsualizacion.columnasIgnoradas.length}
                                </span>
                            </div>

                            {candidatas === 0 ? (
                                <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                    No hay pacientes candidatos para importar.
                                    Revisá los motivos indicados en la tabla.
                                </p>
                            ) : (
                                <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                                    Hay {candidatas} pacientes candidatos.
                                    Revisá los datos y confirmá la importación
                                    cuando estés listo.
                                </p>
                            )}
                        </div>
                    )}

                    {/* RESULTADO DEFINITIVO */}
                    {resultadoConfirmacion && resumenFinal && (
                        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                    <CircleCheck size={24} />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Importación finalizada
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Hoja procesada:{" "}
                                        <span className="font-medium text-slate-700">
                                            {resultadoConfirmacion.hojaProcesada}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <ResumenItem
                                    etiqueta="Candidatas"
                                    valor={resumenFinal.candidatas}
                                />

                                <ResumenItem
                                    etiqueta="Importadas"
                                    valor={resumenFinal.importadas}
                                    color="text-emerald-600"
                                />

                                <ResumenItem
                                    etiqueta="No importadas"
                                    valor={resumenFinal.noImportadas}
                                    color="text-red-600"
                                />
                            </div>

                            <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
                                {resumenFinal.importadas > 0
                                    ? `Se importaron ${resumenFinal.importadas} pacientes correctamente.`
                                    : "La importación finalizó sin incorporar pacientes."}
                            </div>
                        </div>
                    )}

                    {/* TABLA DE FILAS */}
                    {(previsualizacion || resultadoConfirmacion) && (
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {importacionFinalizada
                                            ? "Resultado de las filas"
                                            : "Detalle de filas"}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {importacionFinalizada
                                            ? "Estados definitivos devueltos por el servidor."
                                            : "Revisá los datos detectados y los motivos de validación antes de continuar."}
                                    </p>
                                </div>

                                <span className="text-xs text-slate-500">
                                    {filasMostradas.length} filas
                                </span>
                            </div>

                            <ImportacionPacientesTable
                                filas={filasMostradas}
                            />
                        </div>
                    )}

                    <DialogFooter className="border-t border-slate-200 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={estaProcesando}
                            className="h-11 w-full rounded-xl border-2 px-5 font-medium sm:w-auto"
                        >
                            {importacionFinalizada ? "Cerrar" : "Cancelar"}
                        </Button>

                        {!importacionFinalizada && (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        void analizarArchivo();
                                    }}
                                    disabled={!puedeAnalizar}
                                    className="h-11 w-full rounded-xl bg-slate-700 px-5 font-medium text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
                                >
                                    {isPending ? (
                                        <LoaderCircle className="animate-spin" />
                                    ) : previsualizacion ? (
                                        <RefreshCw />
                                    ) : (
                                        <UploadCloud />
                                    )}

                                    {isPending
                                        ? "Analizando..."
                                        : previsualizacion
                                          ? "Volver a analizar"
                                          : requiereSeleccionarHoja
                                            ? "Analizar hoja seleccionada"
                                            : "Analizar archivo"}
                                </Button>

                                {previsualizacion && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            void confirmarImportacion();
                                        }}
                                        disabled={!puedeImportar}
                                        className="h-11 w-full rounded-xl bg-emerald-600 px-5 font-medium text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50 sm:w-auto"
                                    >
                                        {isConfirming ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            <CircleCheck />
                                        )}

                                        {isConfirming
                                            ? "Importando..."
                                            : `Importar ${candidatas} pacientes`}
                                    </Button>
                                )}
                            </>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
