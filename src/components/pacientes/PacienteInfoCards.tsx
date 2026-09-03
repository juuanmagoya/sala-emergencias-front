import type { ReactNode } from "react";

// ============================================
// COMPONENTES DE INFORMACIÓN
// ============================================

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
}

export function InfoCard({ icon, label, value }: InfoCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wide">
                    {label}
                </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800">
                {value}
            </p>
        </div>
    );
}

// ============================================
// SECCIÓN DE ENCABEZADO
// ============================================

interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function SectionHeader({ icon, title, description }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </div>
    );
}