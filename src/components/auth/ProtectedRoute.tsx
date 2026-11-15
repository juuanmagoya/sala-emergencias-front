import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { obtenerRutaInicio } from "@/lib/auth";

import type { RolUsuario } from "@/types/auth";

interface ProtectedRouteProps {
    rolesPermitidos?: RolUsuario[];
}

export default function ProtectedRoute({
    rolesPermitidos,
}: ProtectedRouteProps) {
    const { isAuthenticated, identidad } = useAuth();

    // Verifica que exista una sesión válida.
    if (!isAuthenticated || !identidad) {
        return <Navigate to="/login" replace />;
    }

    // Un paciente puede estar autenticado, pero no accede a las rutas
    // internas de la Sala Médica. Se lo redirige a su portal.
    if (identidad.tipo === "paciente") {
        return (
            <Navigate
                to={obtenerRutaInicio(identidad)}
                replace
            />
        );
    }

    // Verifica si el rol del usuario tiene acceso a la ruta.
    if (
        rolesPermitidos &&
        !rolesPermitidos.includes(identidad.rol)
    ) {
        return (
            <Navigate
                to={obtenerRutaInicio(identidad)}
                replace
            />
        );
    }

    return <Outlet />;
}
