import { CreditCard, FileText, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import type { Paciente } from "@/types/paciente";
import { InfoCard, SectionHeader } from "@/components/pacientes/PacienteInfoCards";
import { formatDate } from "@/components/shared/formatDate";

// ... resto del código permanece igual

interface PacienteDetailProps {
    paciente: Paciente;
}

export default function PacienteDetail({ paciente }: PacienteDetailProps) {
    const iniciales = paciente.nombre
        .split(" ")
        .slice(0, 2)
        .map((parte) => parte.charAt(0))
        .join("")
        .toUpperCase();

    const telefono = paciente.telefono
        ? `${paciente.telefono.codigoArea} ${paciente.telefono.numero}`
        : "No registrado";

    const direccion = paciente.direccion
        ? [paciente.direccion.calle, paciente.direccion.numero].filter(Boolean).join(" ")
        : "No registrada";

    const ubicacion = [
        paciente.direccion?.barrio,
        paciente.direccion?.piso ? `Piso ${paciente.direccion.piso}` : null,
        paciente.direccion?.departamento ? `Depto. ${paciente.direccion.departamento}` : null,
    ].filter(Boolean).join(" · ");

    return (
        <div className="space-y-6">
            {/* Perfil */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-bold text-cyan-700">
                        {iniciales}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                                {paciente.nombre}
                            </h2>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Paciente
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <CreditCard className="h-4 w-4" />
                                DNI {paciente.dni}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {paciente.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de contacto */}
            <section className="space-y-3">
                <SectionHeader
                    icon={<User className="h-4 w-4" />}
                    title="Información de contacto"
                    description="Datos utilizados para contactar al paciente."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard icon={<Mail className="h-4 w-4" />} label="Correo electrónico" value={paciente.email} />
                    <InfoCard icon={<Phone className="h-4 w-4" />} label="Teléfono" value={telefono} />
                </div>
            </section>

            {/* Dirección */}
            <section className="space-y-3">
                <SectionHeader
                    icon={<MapPin className="h-4 w-4" />}
                    title="Dirección"
                    description="Información del domicilio del paciente."
                />
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-800">{direccion}</p>
                            {ubicacion && <p className="mt-1 text-xs text-slate-500">{ubicacion}</p>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Obra social */}
            <section className="space-y-3">
                <SectionHeader
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Cobertura médica"
                    description="Información de obra social y afiliación."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<ShieldCheck className="h-4 w-4" />}
                        label="Obra social"
                        value={paciente.obraSocial?.nombre ?? "No registrada"}
                    />
                    <InfoCard
                        icon={<CreditCard className="h-4 w-4" />}
                        label="Número de afiliado"
                        value={paciente.obraSocial?.numeroAfiliado || "No registrado"}
                    />
                </div>
            </section>

            {/* Historia clínica */}
            <section className="space-y-3">
                <SectionHeader
                    icon={<FileText className="h-4 w-4" />}
                    title="Historia clínica"
                    description="Registro de antecedentes y consultas médicas."
                />
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">Historia clínica</p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                La información de consultas, diagnósticos y tratamientos se
                                gestionará desde el módulo de Historia Clínica.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fechas */}
            <section className="border-t border-slate-100 pt-4">
                <div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                        <span>Registrado: {formatDate(paciente.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                        <span>Última actualización: {formatDate(paciente.updatedAt)}</span>
                    </div>
                </div>
            </section>
        </div>
    );
}