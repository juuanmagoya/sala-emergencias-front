import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    confirmarImportacionPacientes,
    previsualizarImportacionPacientes,
} from "@/api/importacionPacientes.api";

import { pacientesQueryKey } from "@/hooks/usePacientes";

import type { ImportacionPacientesArchivo } from "@/types/importacionPacientes";

/**
 * Previsualizar un archivo de importación.
 *
 * No persiste pacientes ni invalida consultas. El archivo se envía
 * como variable de la mutación y no se guarda en la caché de queries.
 */
export function usePrevisualizarImportacionPacientes() {
    return useMutation({
        mutationFn: (datos: ImportacionPacientesArchivo) =>
            previsualizarImportacionPacientes(datos),
    });
}

/**
 * Confirmar una importación de pacientes.
 *
 * Si la confirmación importó al menos un paciente, se invalida la
 * consulta base de pacientes para reflejar los nuevos registros.
 */
export function useConfirmarImportacionPacientes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datos: ImportacionPacientesArchivo) =>
            confirmarImportacionPacientes(datos),

        onSuccess: (resultado) => {
            if (resultado.data.resumen.importadas === 0) {
                return;
            }

            queryClient.invalidateQueries({
                queryKey: pacientesQueryKey,
            });
        },
    });
}
