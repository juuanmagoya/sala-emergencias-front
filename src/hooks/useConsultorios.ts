import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createConsultorio,
    deleteConsultorio,
    getConsultorios,
    updateConsultorio,
} from "@/api/consultorio.api";

import type {
    ConsultorioFilters,
} from "@/api/consultorio.api";

import type {
    CreateConsultorioData,
    UpdateConsultorioData,
} from "@/types/consultorio";

// ============================================
// OBTENER CONSULTORIOS
// ============================================

export function useConsultorios(
    filters?: ConsultorioFilters
) {
    return useQuery({
        queryKey: ["consultorios", filters],
        queryFn: () => getConsultorios(filters),
    });
}

// ============================================
// CREAR CONSULTORIO
// ============================================

export function useCreateConsultorio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            consultorio: CreateConsultorioData
        ) => createConsultorio(consultorio),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["consultorios"],
            });
        },
    });
}

// ============================================
// ACTUALIZAR CONSULTORIO
// ============================================

export function useUpdateConsultorio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            consultorio,
        }: {
            id: string;
            consultorio: UpdateConsultorioData;
        }) =>
            updateConsultorio(
                id,
                consultorio
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["consultorios"],
            });
        },
    });
}

// ============================================
// ELIMINAR CONSULTORIO
// ============================================

export function useDeleteConsultorio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            deleteConsultorio(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["consultorios"],
            });
        },
    });
}