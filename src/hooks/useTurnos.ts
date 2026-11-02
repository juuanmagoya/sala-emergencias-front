
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createTurno,
    deleteTurno,
    getDisponibilidad,
    getMisTurnos,
    getTurnos,
} from "@/api/turnos.api";

import type { CrearTurnoData } from "@/types/turno";

// ============================================
// QUERY KEYS
// ============================================

const turnosQueryKey = ["turnos"];

const disponibilidadQueryKey = [
    ...turnosQueryKey,
    "disponibilidad",
];

const misTurnosQueryKey = [
    ...turnosQueryKey,
    "mis-turnos",
];

// ============================================
// OBTENER TURNOS
// ============================================

export function useTurnos() {
    return useQuery({
        queryKey: turnosQueryKey,

        queryFn: getTurnos,
    });
}

// ============================================
// OBTENER DISPONIBILIDAD
// ============================================

export function useDisponibilidad(
    medicoId: string,
    fecha: string
) {
    return useQuery({
        queryKey: [
            ...disponibilidadQueryKey,
            medicoId,
            fecha,
        ],

        queryFn: () =>
            getDisponibilidad(
                medicoId,
                fecha
            ),

        enabled: Boolean(medicoId && fecha),
    });
}

// ============================================
// OBTENER MIS TURNOS
// ============================================

export function useMisTurnos() {
    return useQuery({
        queryKey: misTurnosQueryKey,

        queryFn: getMisTurnos,
    });
}

// ============================================
// CREAR TURNO
// ============================================

export function useCreateTurno() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            turno: CrearTurnoData
        ) =>
            createTurno(turno),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: turnosQueryKey,
            });
        },
    });
}

// ============================================
// CANCELAR TURNO
// ============================================

export function useDeleteTurno() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            deleteTurno(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: turnosQueryKey,
            });
        },
    });
}
