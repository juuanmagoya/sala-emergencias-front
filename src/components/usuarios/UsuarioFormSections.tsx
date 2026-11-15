import {
    Mail,
    Stethoscope,
    UserRound,
    ShieldCheck,
    LockKeyhole,
} from "lucide-react";

import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type { CrearUsuarioSchema } from "@/schemas/usuario.schema";

import type { Medico } from "@/types/medico";

// ============================================
// PROPS
// ============================================

interface UsuarioFormSectionProps {
    register: UseFormRegister<CrearUsuarioSchema>;
    errors: FieldErrors<CrearUsuarioSchema>;
    medicos: Medico[];
    mostrarPassword?: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function UsuarioFormSection({
    register,
    errors,
    medicos,
    mostrarPassword = true,
}: UsuarioFormSectionProps) {
    return (
        <section className="space-y-5">

            {/* DATOS PERSONALES */}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                        Datos del usuario
                    </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    {/* NOMBRE */}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Nombre completo
                        </label>

                        <input
                            {...register("nombre")}
                            type="text"
                            placeholder="Ingresá el nombre completo"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {errors.nombre && (
                            <p className="text-xs text-red-600">
                                {errors.nombre.message}
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Correo electrónico
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                {...register("email")}
                                type="email"
                                placeholder="usuario@correo.com"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            {/* CREDENCIALES */}

            {mostrarPassword && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <LockKeyhole className="h-4 w-4 text-blue-600" />
                        <h3 className="text-sm font-semibold text-slate-800">
                            Credenciales de acceso
                        </h3>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Contraseña
                        </label>

                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Ingresá una contraseña"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {errors.password && (
                            <p className="text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}

                        <p className="text-xs text-slate-400">
                            La contraseña debe tener al menos 8 caracteres.
                        </p>
                    </div>
                </div>
            )}

            {/* ASIGNACIÓN DE ROL */}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                        Permisos y asignación
                    </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    {/* ROL */}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Rol del usuario
                        </label>

                        <select
                            {...register("rol")}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Seleccioná un rol</option>
                            <option value="medico">Médico</option>
                            <option value="recepcionista">Recepcionista</option>
                        </select>

                        {errors.rol && (
                            <p className="text-xs text-red-600">
                                {errors.rol.message}
                            </p>
                        )}
                    </div>

                    {/* MÉDICO ASOCIADO */}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Médico asociado
                        </label>

                        <div className="relative">
                            <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                {...register("medico")}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Seleccioná un médico</option>

                                {medicos.map((medico) => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nombre} {medico.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errors.medico && (
                            <p className="text-xs text-red-600">
                                {errors.medico.message}
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}