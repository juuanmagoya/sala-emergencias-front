
import { createContext } from "react";

import type {
    IdentidadAutenticada,
    LoginData,
    LoginPacienteData,
    SolicitudOtpPacienteResponse,
    Usuario,
    VerificarOtpPacienteData,
} from "@/types/auth";

interface AuthContextType {
    identidad: IdentidadAutenticada | null;

    usuario: Usuario | null;

    token: string | null;

    isAuthenticated: boolean;

    login: (credentials: LoginData) => Promise<void>;

    solicitarCodigoPaciente: (
        credentials: LoginPacienteData
    ) => Promise<SolicitudOtpPacienteResponse>;

    verificarCodigoPaciente: (
        credentials: VerificarOtpPacienteData
    ) => Promise<void>;

    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );
