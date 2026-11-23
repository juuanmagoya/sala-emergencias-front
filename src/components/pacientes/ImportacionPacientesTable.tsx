
import type {
    EstadoFilaImportacion,
    FilaImportacion,
} from "@/types/importacionPacientes";

interface ImportacionPacientesTableProps {
    filas: FilaImportacion[];
}

const ESTADO_CONFIG: Record<
    EstadoFilaImportacion,
    { label: string; className: string }
> = {
    vacia: {
        label: "Vacía",
        className: "bg-slate-100 text-slate-600 ring-slate-200",
    },
    invalida: {
        label: "Inválida",
        className: "bg-red-50 text-red-700 ring-red-200",
    },
    duplicada_en_archivo: {
        label: "Duplicada",
        className: "bg-orange-50 text-orange-700 ring-orange-200",
    },
    existente: {
        label: "Existente",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    conflicto_email: {
        label: "Conflicto email",
        className: "bg-rose-50 text-rose-700 ring-rose-200",
    },
    valida: {
        label: "Válida",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    importada: {
        label: "Importada",
        className: "bg-teal-50 text-teal-700 ring-teal-200",
    },
};

function formatearTelefono(fila: FilaImportacion): string {
    const telefono = fila.datos.telefono;

    if (!telefono?.codigoArea && !telefono?.numero) {
        return "—";
    }

    return `${telefono.codigoArea ?? ""} ${telefono.numero ?? ""}`.trim();
}

function formatearObraSocial(fila: FilaImportacion): string {
    const obraSocial = fila.datos.obraSocial;

    if (!obraSocial?.nombre) {
        return "—";
    }

    return String(obraSocial.nombre);
}

function formatearDireccion(fila: FilaImportacion): string {
    const direccion = fila.datos.direccion;

    if (!direccion) {
        return "—";
    }

    const lineaPrincipal = [
        direccion.calle,
        direccion.numero,
    ]
        .filter(Boolean)
        .join(" ");

    const lineaSecundaria = [
        direccion.piso ? `Piso ${direccion.piso}` : "",
        direccion.departamento
            ? `Depto. ${direccion.departamento}`
            : "",
        direccion.barrio,
    ]
        .filter(Boolean)
        .join(" · ");

    return [lineaPrincipal, lineaSecundaria]
        .filter(Boolean)
        .join(" — ") || "—";
}

function EstadoBadge({
    estado,
}: {
    estado: EstadoFilaImportacion;
}) {
    const config = ESTADO_CONFIG[estado];

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
        >
            {config.label}
        </span>
    );
}

function DetallesFila({ fila }: { fila: FilaImportacion }) {
    const tieneMotivos = fila.motivos.length > 0;
    const tieneAdvertencias = fila.advertencias.length > 0;

    if (!tieneMotivos && !tieneAdvertencias) {
        return (
            <span className="text-sm text-slate-400">—</span>
        );
    }

    return (
        <div className="min-w-52 space-y-2">
            {tieneMotivos && (
                <ul className="space-y-1.5">
                    {fila.motivos.map((motivo, index) => (
                        <li
                            key={`motivo-${fila.numeroFila}-${index}`}
                            className="text-xs leading-relaxed text-red-700"
                        >
                            <span className="font-semibold">
                                {motivo.campo
                                    ? `${motivo.campo}: `
                                    : ""}
                            </span>
                            {motivo.mensaje}
                        </li>
                    ))}
                </ul>
            )}

            {tieneAdvertencias && (
                <ul className="space-y-1.5">
                    {fila.advertencias.map(
                        (advertencia, index) => (
                            <li
                                key={`advertencia-${fila.numeroFila}-${index}`}
                                className="text-xs leading-relaxed text-amber-700"
                            >
                                <span className="font-semibold">
                                    {advertencia.campo
                                        ? `${advertencia.campo}: `
                                        : ""}
                                </span>
                                {advertencia.mensaje}
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
}

export default function ImportacionPacientesTable({
    filas,
}: ImportacionPacientesTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="max-h-[480px] overflow-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr className="border-b border-slate-200">
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Fila
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Nombre
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                DNI
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Teléfono
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Email
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Obra social
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Dirección
                            </th>
                            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Estado
                            </th>
                            <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Motivos / Advertencias
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filas.map((fila) => (
                            <tr
                                key={fila.numeroFila}
                                className={`border-b border-slate-100 align-top transition-colors hover:bg-slate-50 ${
                                    fila.estado === "invalida" ||
                                    fila.estado === "conflicto_email"
                                        ? "bg-red-50/30"
                                        : fila.estado === "valida"
                                          ? "bg-emerald-50/20"
                                          : ""
                                }`}
                            >
                                <td className="px-3 py-3 font-medium text-slate-500">
                                    {fila.numeroFila}
                                </td>

                                <td className="max-w-56 px-3 py-3 font-medium text-slate-900">
                                    {fila.datos.nombre || "—"}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                                    {fila.datos.dni || "—"}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                                    {formatearTelefono(fila)}
                                </td>

                                <td className="max-w-56 px-3 py-3 text-slate-700 break-all">
                                    {fila.datos.email || "—"}
                                </td>

                                <td className="px-3 py-3 text-slate-700">
                                    {formatearObraSocial(fila)}
                                </td>

                                <td className="max-w-64 px-3 py-3 text-slate-600">
                                    {formatearDireccion(fila)}
                                </td>

                                <td className="px-3 py-3">
                                    <EstadoBadge estado={fila.estado} />
                                </td>

                                <td className="px-3 py-3">
                                    <DetallesFila fila={fila} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filas.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500">
                    El archivo no contiene filas para mostrar.
                </div>
            )}
        </div>
);
}
