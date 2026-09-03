import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createEspecialidad,
    deleteEspecialidadPermanente,
    getEspecialidad,
    getEspecialidades,
    toggleActivoEspecialidad,
    updateEspecialidad,
    type EspecialidadFilters,
} from "@/api/especialidades.api";

import type {
    CreateEspecialidadData,
    UpdateEspecialidadData,
} from "@/types/especialidad";

const especialidadesQueryKey = ["especialidades"];

/**
 * Obtener especialidades
 */
export function useEspecialidades(
    filters?: EspecialidadFilters
) {
    return useQuery({
        queryKey: [
            ...especialidadesQueryKey,
            filters,
        ],

        queryFn: () =>
            getEspecialidades(filters),
    });
}

/**
 * Obtener una especialidad por ID
 */
export function useEspecialidad(id: string) {
    return useQuery({
        queryKey: [...especialidadesQueryKey, id],
        queryFn: () => getEspecialidad(id),
        enabled: Boolean(id),
    });
}

/**
 * Crear especialidad
 */
export function useCreateEspecialidad() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            especialidad: CreateEspecialidadData
        ) => createEspecialidad(especialidad),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: especialidadesQueryKey,
            });
        },
    });
}

/**
 * Actualizar especialidad
 */
export function useUpdateEspecialidad() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            especialidad,
        }: {
            id: string;
            especialidad: UpdateEspecialidadData;
        }) =>
            updateEspecialidad(
                id,
                especialidad
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: especialidadesQueryKey,
            });
        },
    });
}

/**
 * Activar / desactivar especialidad
 */
export function useToggleActivoEspecialidad() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            toggleActivoEspecialidad(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: especialidadesQueryKey,
            });
        },
    });
}

/**
 * Borrado físico
 */
export function useDeleteEspecialidadFisica() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            deleteEspecialidadPermanente(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: especialidadesQueryKey,
            });
        },
    });
}