import {
    Bell,
    Search,
} from "lucide-react";

export default function Header() {
    return (
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6">

            <div>

                <p className="text-xs font-medium text-slate-400">
                    Martes, 18 de agosto
                </p>

                <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                    Buenos días, Administrador
                </h1>

            </div>

            <div className="flex items-center gap-3">

                {/* Search */}
                <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    <Search size={19} />
                </button>

                {/* Notifications */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">

                    <Bell size={19} />

                    <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />

                </button>

                <div className="mx-1 h-7 w-px bg-slate-200" />

                {/* User */}
                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        AD
                    </div>

                    <div className="hidden sm:block">

                        <p className="text-xs font-semibold text-slate-800">
                            Administrador
                        </p>

                        <p className="text-[10px] text-slate-400">
                            Sistema
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}