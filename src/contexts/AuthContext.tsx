
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
    SolicitudOtpPacienteResponse,
    Usuario,
    VerificarOtpPacienteData,
} from "@/types/auth";

import {
    loginUsuario,
    solicitarCodigoPaciente as solicitarCodigoPacienteApi,
    verificarCodigoPaciente as verificarCodigoPacienteApi,
} from "@/api/auth.api";

import {
    guardarSesion,
    limpiarSesion,
    obtenerSesionGuardada,
    type SesionGuardada,
} from "@/lib/auth";

import { AuthContext } from "./auth-context";

// Prefijos de las cachés personales del paciente.
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

    // Token e identidad se guardan juntos.
    const [sesion, setSesion] =
        useState<SesionGuardada | null>(
            () => obtenerSesionGuardada()
        );

    /**
     * Login de usuarios internos.
     * Mantiene el comportamiento anterior.
     */
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

    /**
     * Primer paso del acceso del paciente.
     *
     * Solicita el OTP, pero NO crea una sesión.
     */
    const solicitarCodigoPaciente = async (
        credentials: LoginPacienteData
    ): Promise<SolicitudOtpPacienteResponse> => {
        const response =
            await solicitarCodigoPacienteApi(
                credentials
            );

        return response.data;
    };

    /**
     * Segundo paso del acceso del paciente.
     *
     * Verifica el OTP y recién entonces guarda el JWT.
     */
    const verificarCodigoPaciente = async (
        credentials: VerificarOtpPacienteData
    ) => {
        const response =
            await verificarCodigoPacienteApi(
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

    const usuario =
        identidad?.tipo === "usuario"
            ? identidad
            : null;

    return (
        <AuthContext.Provider
            value={{
                identidad,
                usuario,
                token: sesion?.token ?? null,
                isAuthenticated: Boolean(sesion),
                login,
                solicitarCodigoPaciente,
                verificarCodigoPaciente,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
