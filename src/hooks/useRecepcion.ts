import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { registrarIngresoRecepcion } from "@/api/recepcion.api";

import type { CrearIngresoRecepcionData } from "@/types/recepcion";

const pacientesQueryKey = ["pacientes"];
const turnosQueryKey = ["turnos"];

/**
 * Registrar un ingreso de paciente nuevo desde Recepción.
 *
 * El alta crea un paciente y un turno. Se invalidan ambas consultas
 * para que las pantallas administrativas reflejen el cambio.
 */
export function useRegistrarIngresoRecepcion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            datos: CrearIngresoRecepcionData
        ) => registrarIngresoRecepcion(datos),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: pacientesQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: turnosQueryKey,
            });
        },
    });
}
