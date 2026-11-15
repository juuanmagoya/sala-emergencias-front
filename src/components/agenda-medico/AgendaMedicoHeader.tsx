import { CalendarDays, CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

// ============================================================
// PROPS
// ============================================================

interface AgendaMedicoHeaderProps {
    fechaSeleccionada: string;
    onFechaChange: (fecha: string) => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AgendaMedicoHeader({
    fechaSeleccionada,
    onFechaChange,
}: AgendaMedicoHeaderProps) {

    /**
     * Obtener la fecha actual en formato YYYY-MM-DD
     * utilizando la zona horaria local del navegador.
     */
    const obtenerFechaActual = (): string => {
        const fecha = new Date();

        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    };

    /**
     * Seleccionar la fecha actual.
     */
    const handleTurnosHoy = () => {
        onFechaChange(obtenerFechaActual());
    };

    const esHoy = fechaSeleccionada === obtenerFechaActual();

    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* INFORMACIÓN */}

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <CalendarDays className="h-5 w-5" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Mi agenda médica
                    </h1>
                </div>

                <p className="text-sm text-slate-500">
                    Consultá tus turnos y registrá la atención de tus pacientes.
                </p>
            </div>

            {/* ACCIONES */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                {/* SELECTOR DE FECHA */}

                <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => onFechaChange(e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[170px]"
                    />
                </div>

                {/* BOTÓN TURNOS HOY */}

                <Button
                    type="button"
                    onClick={handleTurnosHoy}
                    variant={esHoy ? "default" : "outline"}
                    className="h-10 gap-2"
                >
                    <CalendarCheck className="h-4 w-4" />
                    Turnos hoy
                </Button>
            </div>
        </div>
    );
}