import {
    ChevronLeft,
    ChevronRight,
    HeartPulse,
} from "lucide-react";

import { useSidebar } from "@/contexts/useSidebar";

import SidebarContent from "./SidebarContent";

export default function Sidebar() {
    const { collapsed, toggleSidebar } = useSidebar();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-950 text-slate-300 transition-all duration-300 lg:flex ${
                collapsed ? "w-[76px]" : "w-[260px]"
            }`}
        >
            {/* Header */}
            <div
                className={`flex h-[72px] items-center border-b border-white/5 ${
                    collapsed ? "justify-center px-3" : "px-5"
                }`}
            >
                <div
                    className={`flex items-center ${
                        collapsed ? "" : "gap-3"
                    }`}
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                        <HeartPulse size={21} strokeWidth={2.3} />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold tracking-tight text-white">
                                Emergencias
                            </p>

                            <p className="text-[11px] text-slate-500">
                                Gestión sanitaria
                            </p>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="ml-auto rounded-lg p-1.5 text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
                        aria-label="Contraer menú"
                    >
                        <ChevronLeft size={17} />
                    </button>
                )}

                {collapsed && (
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-lg transition hover:text-white"
                        aria-label="Expandir menú"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>

            <SidebarContent collapsed={collapsed} />
        </aside>
    );
}
