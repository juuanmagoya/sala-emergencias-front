import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createPaciente,
    deletePaciente,
    getPacientes,
    updatePaciente,
} from "@/api/pacientes.api";

import type {
    CreatePacienteData,
    UpdatePacienteData,
} from "@/types/paciente";

import { esDniValido } from "@/schemas/recepcion.schema";

const pacientesQueryKey = ["pacientes"];

/**
 * Obtener pacientes
 */
export function usePacientes() {
    return useQuery({
        queryKey: pacientesQueryKey,
        queryFn: () => getPacientes(),
    });
}

/**
 * Buscar un paciente por DNI.
 *
 * La consulta no se ejecuta hasta contar con un DNI válido.
 */
export function useBuscarPacientePorDni(dni: string) {
    const dniNormalizado = dni.trim();

    return useQuery({
        queryKey: [
            ...pacientesQueryKey,
            "busqueda-dni",
            dniNormalizado,
        ],
        queryFn: () =>
            getPacientes({ dni: dniNormalizado }),
        enabled: esDniValido(dniNormalizado),
        staleTime: 0,
        gcTime: 0,
    });
}

/**
 * Crear paciente
 */
export function useCreatePaciente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            paciente: CreatePacienteData
        ) => createPaciente(paciente),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: pacientesQueryKey,
            });
        },
    });
}

/**
 * Actualizar paciente
 */
export function useUpdatePaciente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            paciente,
        }: {
            id: string;
            paciente: UpdatePacienteData;
        }) =>
            updatePaciente(id, paciente),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: pacientesQueryKey,
            });
        },
    });
}

/**
 * Eliminar paciente
 */
export function useDeletePaciente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            deletePaciente(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: pacientesQueryKey,
            });
        },
    });
}