import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type {
    LoginData,
    Usuario,
} from "@/types/auth";

import { loginUsuario } from "@/api/auth.api";

import { AuthContext } from "./auth-context";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );

    const [usuario, setUsuario] = useState<Usuario | null>(
        () => {
            const usuarioGuardado =
                localStorage.getItem("usuario");

            if (!usuarioGuardado) {
                return null;
            }

            try {
                return JSON.parse(usuarioGuardado);
            } catch {
                localStorage.removeItem("usuario");
                return null;
            }
        }
    );

    const login = async (
        credentials: LoginData
    ) => {
        const response = await loginUsuario(
            credentials
        );

        const { token, usuario } = response.data;

        localStorage.setItem("token", token);

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        setToken(token);
        setUsuario(usuario);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setToken(null);
        setUsuario(null);
    };

    useEffect(() => {
        const handleSessionExpired = () => {
            logout();
        };

        window.addEventListener(
            "auth:session-expired",
            handleSessionExpired
        );

        return () => {
            window.removeEventListener(
                "auth:session-expired",
                handleSessionExpired
            );
        };
    }, []);

    const isAuthenticated =
        Boolean(token && usuario);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}