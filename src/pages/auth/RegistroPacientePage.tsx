
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    HeartPulse,
    ShieldCheck,
} from "lucide-react";

import RegistroPacienteForm from "@/components/registro-paciente/RegistroPacienteForm";

import imagenLogin from "@/assets/login/sala-espera.jpg";

export default function RegistroPacientePage() {
    return (
        <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[45%_55%]">
            {/* =====================================================
                SECTOR VISUAL
            ===================================================== */}

            <section className="relative isolate h-56 overflow-hidden sm:h-72 lg:h-auto lg:min-h-screen">
                <img
                    src={imagenLogin}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/70 to-slate-950/60" />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-12">
                    {/* MARCA */}

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25">
                            <HeartPulse
                                size={22}
                                strokeWidth={2.3}
                            />
                        </div>

                        <div>
                            <p className="text-sm font-semibold tracking-tight text-white">
                                Emergencias
                            </p>

                            <p className="text-[11px] text-slate-300">
                                Gestión sanitaria
                            </p>
                        </div>
                    </div>

                    {/* MENSAJE */}

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-cyan-100 backdrop-blur-sm">
                            <ShieldCheck size={14} />
                            Atención al paciente
                        </span>

                        <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight tracking-tight text-white lg:text-3xl">
                            Tu salud, más cerca de vos.
                        </h2>

                        <p className="mt-3 hidden max-w-sm text-sm leading-6 text-slate-200 sm:block">
                            Creá tu cuenta para acceder a los servicios
                            digitales de la Sala de Emergencias y
                            gestionar tus consultas desde un mismo lugar.
                        </p>
                    </div>

                    <p className="hidden text-xs text-slate-300 lg:block">
                        Sala de Emergencias · Gestión sanitaria
                    </p>
                </div>
            </section>

            {/* =====================================================
                SECTOR DEL FORMULARIO
            ===================================================== */}

            <main className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
                <div className="w-full max-w-lg">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                        {/* ENCABEZADO */}

                        <div>
                            <Link
                                to="/login"
                                className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-cyan-700"
                            >
                                <ArrowLeft size={15} />
                                Volver al inicio de sesión
                            </Link>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                                Registro de pacientes
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                                Crear una cuenta
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Completá tus datos para registrarte
                                en el sistema de la Sala de Emergencias.
                            </p>
                        </div>

                        {/* FORMULARIO */}

                        <div className="mt-7">
                            <RegistroPacienteForm />
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Sistema de gestión · Sala de Emergencias
                    </p>
                </div>
            </main>
        </div>
    );
}
