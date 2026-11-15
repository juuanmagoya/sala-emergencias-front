import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { obtenerRutaInicio } from "@/lib/auth";

/**
 * Guard exclusivo del Portal del Paciente.
 *
 * - Sin sesión: vuelve al login.
 * - Usuario interno: vuelve a la ruta de inicio de su rol.
 * - Paciente: accede al portal.
 *
 * Es independiente de `ProtectedRoute` porque las rutas internas
 * trabajan con `RolUsuario`, que no incluye al paciente.
 */
export default function PacienteRoute() {
    const { isAuthenticated, identidad } = useAuth();

    // Verifica que exista una sesión válida.
    if (!isAuthenticated || !identidad) {
        return <Navigate to="/login" replace />;
    }

    // Los usuarios internos no acceden al portal del paciente.
    if (identidad.tipo !== "paciente") {
        return (
            <Navigate
                to={obtenerRutaInicio(identidad)}
                replace
            />
        );
    }

    return <Outlet />;
}
