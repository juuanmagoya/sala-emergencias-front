import { createContext } from "react";

import type {
    LoginData,
    Usuario,
} from "@/types/auth";

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginData) => Promise<void>;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );