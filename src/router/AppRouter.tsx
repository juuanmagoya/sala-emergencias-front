import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";

import PacientesPage from "@/pages/pacientes/PacientesPage";
import EspecialidadesPage from "@/pages/especialidades/EspecialidadesPage";
import MedicosPage from "@/pages/medicos/MedicosPage";
import ConsultoriosPage from "@/pages/consultorios/ConsultoriosPage";
import TurnosPage from "@/pages/turnos/TurnosPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Ruta pública */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute />}>

                    <Route element={<DashboardLayout />}>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/pacientes"
                            element={<PacientesPage />}
                        />

                        <Route
                            path="/medicos"
                            element={<MedicosPage />}
                        />

                        <Route
                            path="/turnos"
                            element={<TurnosPage />}
                        />

                        <Route
                            path="/consultorios"
                            element={<ConsultoriosPage />}
                        />

                        <Route
                            path="/especialidades"
                            element={<EspecialidadesPage />}
                        />

                        <Route
                            path="/recepcion"
                            element={
                                <div>
                                    Recepción
                                </div>
                            }
                        />

                        <Route
                            path="/historias-clinicas"
                            element={
                                <div>
                                    Historias clínicas
                                </div>
                            }
                        />

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