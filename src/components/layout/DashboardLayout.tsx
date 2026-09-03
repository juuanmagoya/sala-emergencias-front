import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { SidebarProvider } from "@/contexts/SidebarProvider";
import { useSidebar } from "@/contexts/useSidebar";

function DashboardLayoutContent() {
    const { collapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar />

            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed
                        ? "lg:pl-[76px]"
                        : "lg:pl-[260px]"
                }`}
            >
                <Header />

                <main>
                    <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

        </div>
    );
}

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <DashboardLayoutContent />
        </SidebarProvider>
    );
}