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

const pacientesQueryKey = ["pacientes"];

/**
 * Obtener pacientes
 */
export function usePacientes() {
    return useQuery({
        queryKey: pacientesQueryKey,
        queryFn: getPacientes,
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