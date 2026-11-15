import { useState } from "react";

import { Outlet } from "react-router-dom";

import PacienteHeader from "@/components/layout/PacienteHeader";
import PacienteSidebar from "@/components/layout/PacienteSidebar";

export default function PacienteLayout() {
    // En móvil el sidebar se muestra como panel deslizante.
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <PacienteSidebar
                abierto={menuAbierto}
                onCerrar={() => setMenuAbierto(false)}
            />

            <div className="flex min-h-screen flex-col lg:pl-[272px]">
                <PacienteHeader
                    onAbrirMenu={() => setMenuAbierto(true)}
                />

                <main className="flex-1">
                    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
