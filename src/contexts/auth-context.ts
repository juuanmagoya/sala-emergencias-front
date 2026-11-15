import { createContext } from "react";

import type {
    IdentidadAutenticada,
    LoginData,
    LoginPacienteData,
    Usuario,
} from "@/types/auth";

interface AuthContextType {
    /**
     * Identidad activa. El discriminante `tipo` permite distinguir
     * entre un usuario interno y un paciente.
     */
    identidad: IdentidadAutenticada | null;

    /**
     * Usuario interno derivado de `identidad`.
     *
     * Es `null` cuando la sesión pertenece a un paciente.
     */
    usuario: Usuario | null;

    token: string | null;
    isAuthenticated: boolean;

    login: (credentials: LoginData) => Promise<void>;
    loginPaciente: (
        credentials: LoginPacienteData
    ) => Promise<void>;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );
