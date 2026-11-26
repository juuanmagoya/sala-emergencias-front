
import type {
    InputHTMLAttributes,
    ReactNode,
} from "react";

import type {
    UseFormRegisterReturn,
} from "react-hook-form";


import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// =====================================================
// SECCIÓN DEL FORMULARIO
// =====================================================

interface FormSectionProps {
    titulo: string;
    descripcion: string;
    icono: LucideIcon;
    children: ReactNode;
}

export function FormSection({
    titulo,
    descripcion,
    icono: Icon,
    children,
}: FormSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Icon size={20} />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        {titulo}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {descripcion}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
}

// =====================================================
// CAMPO DE TEXTO
// =====================================================

interface FormInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "className" | "id"
    > {
    id: string;
    label: string;
    icono: LucideIcon;
    registro: UseFormRegisterReturn;
    error?: string;
}

export function FormInput({
    id,
    label,
    icono: Icon,
    registro,
    error,
    ...props
}: FormInputProps) {
    const errorId = `${id}-error`;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    id={id}
                    {...registro}
                    {...props}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? errorId : undefined
                    }
                    className={cn(
                        "h-12 w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 hover:border-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    )}
                />
            </div>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

