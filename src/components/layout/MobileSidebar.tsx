import { useEffect } from "react";

import { useLocation } from "react-router-dom";

import {
    HeartPulse,
    X,
} from "lucide-react";

import SidebarContent from "@/components/layout/SidebarContent";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "@/contexts/useSidebar";

export default function MobileSidebar() {
    const { mobileOpen, closeMobile } = useSidebar();

    // `key` cambia en cada navegación del router, incluso si el
    // pathname es el mismo. Cubre la navegación programática y el
    // botón "atrás", además del cierre al hacer clic en un enlace.
    const { key } = useLocation();

    useEffect(() => {
        closeMobile();
    }, [key, closeMobile]);

    return (
        <Sheet
            open={mobileOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeMobile();
                }
            }}
        >
            <SheetContent
                id="menu-movil"
                side="left"
                showCloseButton={false}
            >
                {/* Marca */}
                <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/5 px-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                        <HeartPulse size={21} strokeWidth={2.3} />
                    </div>

                    <div className="min-w-0">
                        <SheetTitle className="truncate text-sm font-semibold tracking-tight text-white">
                            Emergencias
                        </SheetTitle>

                        <p className="truncate text-[11px] text-slate-500">
                            Gestión sanitaria
                        </p>
                    </div>

                    <SheetClose
                        type="button"
                        className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        aria-label="Cerrar menú"
                    >
                        <X size={18} />
                    </SheetClose>
                </div>

                <SidebarContent
                    collapsed={false}
                    onNavigate={closeMobile}
                />
            </SheetContent>
        </Sheet>
    );
}
