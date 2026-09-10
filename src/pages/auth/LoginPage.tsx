import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            await login({
                email,
                password,
            });
        } catch {
            setError(
                "Email o contraseña incorrectos"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Sala de Emergencias
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Ingresá al sistema de gestión
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            Iniciar sesión
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Ingresá tus credenciales para continuar
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="admin@ejemplo.com"
                                    autoComplete="email"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Contraseña
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading
                                ? "Ingresando..."
                                : "Iniciar sesión"}
                        </button>

                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Sistema interno de gestión
                </p>

            </div>
        </div>
    );
}