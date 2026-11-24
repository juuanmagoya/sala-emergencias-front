
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PacienteLayout from "@/components/layout/PacienteLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PacienteRoute from "@/components/auth/PacienteRoute";
import LoginPage from "@/pages/auth/LoginPage";

import PacientesPage from "@/pages/pacientes/PacientesPage";
import EspecialidadesPage from "@/pages/especialidades/EspecialidadesPage";
import MedicosPage from "@/pages/medicos/MedicosPage";
import ConsultoriosPage from "@/pages/consultorios/ConsultoriosPage";
import TurnosPage from "@/pages/turnos/TurnosPage";
import RecepcionPage from "@/pages/recepcion/RecepcionPage";
import UsuariosPage from "@/pages/usuarios/UsuariosPage";
import AgendaMedicoPage from "@/pages/agendaMedica/AgendaMedicoPage";
import PortalInicioPage from "@/pages/portal/PortalInicioPage";
import HistoriasClinicasPage from "@/pages/portal/HistoriasClinicasPage";
import ReservarTurnoPage from "@/pages/portal/ReservarTurnoPage";
import MisTurnosPage from "@/pages/portal/MisTurnosPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Ruta pública */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Portal del Paciente: exclusivo para pacientes */}
                <Route element={<PacienteRoute />}>
                    <Route element={<PacienteLayout />}>
                        <Route
                            path="/portal"
                            element={<PortalInicioPage />}
                        />

                        <Route
                            path="/portal/reservar-turno"
                            element={<ReservarTurnoPage />}
                        />

                        <Route
                            path="/portal/historias-clinicas"
                            element={<HistoriasClinicasPage />}
                        />

                        <Route
                            path="/portal/mis-turnos"
                            element={<MisTurnosPage />}
                        />

                        {/* Cualquier subruta desconocida vuelve al inicio. */}
                        <Route
                            path="/portal/*"
                            element={
                                <Navigate
                                    to="/portal"
                                    replace
                                />
                            }
                        />
                    </Route>
                </Route>

                {/* Rutas para cualquier usuario autenticado */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>

                        {/* Dashboard: solamente administrador */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin"]} />}>
                            <Route
                                path="/"
                                element={<Dashboard />}
                            />
                        </Route>


                        {/* Recepción: administrador y recepcionista */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin", "recepcionista"]} />}>
                            <Route
                                path="/recepcion"
                                element={<RecepcionPage />}
                            />
                        </Route>
                        
                        {/* Pacientes: todos los roles */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin", "recepcionista"]} />}>
                            <Route
                                path="/pacientes"
                                element={<PacientesPage />}
                            />
                        </Route>

                        {/* Médicos: administrador y recepción */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin", "recepcionista"]} />}>
                            <Route
                                path="/medicos"
                                element={<MedicosPage />}
                            />
                        </Route>

                        {/* Turnos: administrador y recepción */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin", "recepcionista"]} />}>
                            <Route
                                path="/turnos"
                                element={<TurnosPage />}
                            />
                        </Route>

                        {/* Agenda: administrador y médico */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin", "medico"]} />}>
                            <Route
                                path="/mis-turnos"
                                element={<AgendaMedicoPage />}
                            />
                        </Route>

                        {/* Administración: solamente administrador */}
                        <Route element={<ProtectedRoute rolesPermitidos={["admin"]} />}>
                            <Route
                                path="/consultorios"
                                element={<ConsultoriosPage />}
                            />

                            <Route
                                path="/especialidades"
                                element={<EspecialidadesPage />}
                            />

                            <Route
                                path="/usuarios"
                                element={<UsuariosPage />}
                            />
                        </Route>


                    </Route>
                </Route>

                {/* Ruta inexistente */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}
