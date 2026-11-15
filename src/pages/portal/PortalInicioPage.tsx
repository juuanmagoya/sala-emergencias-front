import { Link } from "react-router-dom";

import {
    ArrowRight,
    CalendarClock,
    CalendarPlus,
    HeartPulse,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function PortalInicioPage() {
    const { identidad } = useAuth();

    // El guard ya garantiza que la identidad sea de tipo paciente.
    const nombre =
        identidad?.tipo === "paciente"
            ? identidad.nombre
            : "";

    const nombrePila =
        nombre.trim().split(/\s+/)[0] || "paciente";

    return (
        <div className="space-y-6">
            {/* Bienvenida */}
            <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-cyan-600 via-cyan-500 to-teal-400 p-6 text-white shadow-xl shadow-cyan-500/20 sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-teal-200/20 blur-2xl"
                />

                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
                        <Sparkles size={13} />
                        Portal del Paciente
                    </span>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                        Hola, {nombrePila}
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
                        Te damos la bienvenida a tu espacio
                        personal de salud. Desde acá vas a
                        poder acceder a tus servicios cuando
                        estén disponibles.
                    </p>
                </div>
            </section>

            {/* Acceso directo a la reserva */}
            <section className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <CalendarPlus size={22} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Reservá tu próximo turno
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Elegí especialidad, profesional y
                            horario desde tu portal.
                        </p>
                    </div>
                </div>

                <Link
                    to="/portal/reservar-turno"
                    className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:mt-0"
                >
                    Reservar turno
                    <ArrowRight size={16} />
                </Link>
            </section>

            {/* Acceso al historial de turnos */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CalendarClock size={22} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Consultá tus turnos
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Revisá tus próximos turnos, los
                            anteriores y los cancelados.
                        </p>
                    </div>
                </div>

                <Link
                    to="/portal/mis-turnos"
                    className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 sm:mt-0"
                >
                    Ver mis turnos
                    <ArrowRight size={16} />
                </Link>
            </section>

            {/* Información */}
            <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <HeartPulse size={22} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                        Un espacio pensado para vos
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Estamos preparando este portal para
                        que puedas gestionar tus servicios de
                        salud de forma simple, clara y segura.
                    </p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <ShieldCheck size={22} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                        Tu información, protegida
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Tu sesión es personal y te identifica
                        como paciente. No tenés acceso al
                        panel interno de la Sala Médica.
                    </p>
                </section>
            </div>

            {/* Próximamente */}
            <section className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/60 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Muy pronto vas a poder hacer más
                        desde acá
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        A medida que sumemos funciones, las
                        vas a encontrar disponibles en el
                        menú de tu portal.
                    </p>
                </div>

                <span className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm sm:mt-0">
                    <Sparkles size={14} />
                    Próximamente
                </span>
            </section>
        </div>
    );
}
