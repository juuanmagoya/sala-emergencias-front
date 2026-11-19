import api from "@/api/axios";

import type {
    CrearIngresoRecepcionData,
    RecepcionResponse,
} from "@/types/recepcion";

/**
 * Registrar un ingreso desde Recepción.
 *
 * El servidor crea el paciente y el turno en una misma transacción.
 * El body se construye explícitamente para no enviar `fechaFin`,
 * `estado`, `activo`, `duracionTurno` ni `paciente`.
 */
export async function registrarIngresoRecepcion(
    datos: CrearIngresoRecepcionData
): Promise<RecepcionResponse> {
    const observaciones = datos.observaciones?.trim();

    const response = await api.post<RecepcionResponse>(
        "/recepcion",
        {
            datosPaciente: {
                nombre: datos.datosPaciente.nombre,
                dni: datos.datosPaciente.dni,
                telefono: {
                    codigoArea:
                        datos.datosPaciente.telefono.codigoArea,
                    numero:
                        datos.datosPaciente.telefono.numero,
                    ...(datos.datosPaciente.telefono.tipo
                        ? {
                              tipo: datos.datosPaciente
                                  .telefono.tipo,
                          }
                        : {}),
                },
            },
            especialidad: datos.especialidad,
            medico: datos.medico,
            fechaTurno: datos.fechaTurno,
            ...(observaciones
                ? { observaciones }
                : {}),
        }
    );

    return response.data;
}
