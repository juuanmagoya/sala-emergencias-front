import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createMedico,
    deleteMedicoPermanente,
    getMedico,
    getMedicos,
    toggleActivoMedico,
    updateMedico,
    type MedicoFilters,
} from "@/api/medicos.api";

import type {
    CreateMedicoData,
    UpdateMedicoData,
} from "@/types/medico";

// ============================================
// QUERY KEYS
// ============================================

const medicosQueryKey = ["medicos"];

// ============================================
// OBTENER MÉDICOS
// ============================================

export function useMedicos(
    filters?: MedicoFilters
) {
    return useQuery({
        queryKey: [
            ...medicosQueryKey,
            filters,
        ],

        queryFn: () =>
            getMedicos(filters),
    });
}

// ============================================
// OBTENER MÉDICO POR ID
// ============================================

export function useMedico(id: string) {
    return useQuery({
        queryKey: [
            ...medicosQueryKey,
            id,
        ],

        queryFn: () =>
            getMedico(id),

        enabled: Boolean(id),
    });
}

// ============================================
// CREAR MÉDICO
// ============================================

export function useCreateMedico() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            medico: CreateMedicoData
        ) =>
            createMedico(medico),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: medicosQueryKey,
            });
        },
    });
}

// ============================================
// ACTUALIZAR MÉDICO
// ============================================

export function useUpdateMedico() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            medico,
        }: {
            id: string;
            medico: UpdateMedicoData;
        }) =>
            updateMedico(
                id,
                medico
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: medicosQueryKey,
            });
        },
    });
}

// ============================================
// ACTIVAR / DESACTIVAR
// ============================================

export function useToggleActivoMedico() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            toggleActivoMedico(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: medicosQueryKey,
            });
        },
    });
}

// ============================================
// ELIMINAR PERMANENTEMENTE
// ============================================

export function useDeleteMedicoPermanente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            deleteMedicoPermanente(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: medicosQueryKey,
            });
        },
    });
}