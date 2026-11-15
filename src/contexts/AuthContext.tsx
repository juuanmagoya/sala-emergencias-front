import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import type {
    LoginData,
    LoginPacienteData,
    PacienteAutenticado,
    Usuario,
} from "@/types/auth";

import {
    loginPaciente as loginPacienteApi,
    loginUsuario,
} from "@/api/auth.api";

import {
    guardarSesion,
    limpiarSesion,
    obtenerSesionGuardada,
    type SesionGuardada,
} from "@/lib/auth";

import { AuthContext } from "./auth-context";

// Prefijos de las cachés personales del paciente. Se eliminan al
// cerrar sesión para no conservar datos de una identidad anterior
// en la misma pestaña.
const MI_HISTORIAL_QUERY_KEY = [
    "historias-clinicas",
    "mi-historial",
];

const MI_HISTORIAL_TURNOS_QUERY_KEY = [
    "turnos",
    "mi-historial",
];

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {

    const queryClient = useQueryClient();

    // Token e identidad se guardan juntos para que nunca queden
    // desincronizados.
    const [sesion, setSesion] =
        useState<SesionGuardada | null>(
            () => obtenerSesionGuardada()
        );

    const login = async (
        credentials: LoginData
    ) => {
        const response = await loginUsuario(
            credentials
        );

        const { token, usuario } = response.data;

        const identidad: Usuario = {
            ...usuario,
            tipo: "usuario",
            medico: usuario.medico ?? null,
        };

        guardarSesion(token, identidad);
        setSesion({ token, identidad });
    };

    const loginPaciente = async (
        credentials: LoginPacienteData
    ) => {
        const response = await loginPacienteApi(
            credentials
        );

        const { token, paciente } = response.data;

        const identidad: PacienteAutenticado = {
            ...paciente,
            tipo: "paciente",
        };

        guardarSesion(token, identidad);
        setSesion({ token, identidad });
    };

    const logout = () => {
        // La caché de React Query no se limpia automáticamente al
        // cerrar sesión. Se eliminan los historiales del paciente.
        queryClient.removeQueries({
            queryKey: MI_HISTORIAL_QUERY_KEY,
        });

        queryClient.removeQueries({
            queryKey: MI_HISTORIAL_TURNOS_QUERY_KEY,
        });

        limpiarSesion();
        setSesion(null);
    };

    useEffect(() => {
        const handleSessionExpired = () => {
            // Mismo resguardo que en logout(): un 401 también cierra
            // la sesión y no debe dejar datos personales en memoria.
            queryClient.removeQueries({
                queryKey: MI_HISTORIAL_QUERY_KEY,
            });

            queryClient.removeQueries({
                queryKey: MI_HISTORIAL_TURNOS_QUERY_KEY,
            });

            limpiarSesion();
            setSesion(null);
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
    }, [queryClient]);

    const identidad = sesion?.identidad ?? null;

    // `usuario` conserva la forma que ya consumían el sidebar y las
    // rutas protegidas. Para un paciente es null.
    const usuario =
        identidad?.tipo === "usuario" ? identidad : null;

    return (
        <AuthContext.Provider
            value={{
                identidad,
                usuario,
                token: sesion?.token ?? null,
                isAuthenticated: Boolean(sesion),
                login,
                loginPaciente,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
