
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    crearMiTurno,
    createTurno,
    deleteTurno,
    getDisponibilidad,
    getMiHistorialTurnos,
    getMisTurnos,
    getTurnos,
    updateEstadoTurno,
} from "@/api/turnos.api";

import { useAuth } from "@/hooks/useAuth";

import type {
    CrearMiTurnoData,
    CrearTurnoData,
    EstadoTurno,
} from "@/types/turno";

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

const miHistorialTurnosQueryKey = [
    ...turnosQueryKey,
    "mi-historial",
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

interface UseDisponibilidadOptions {
    staleTime?: number;
}

export function useDisponibilidad(
    medicoId: string,
    fecha: string,
    options?: UseDisponibilidadOptions
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

        // Sin opciones se conserva el staleTime global del panel
        // interno. La reserva puede pedir datos frescos con
        // { staleTime: 0 }.
        ...(options?.staleTime !== undefined
            ? { staleTime: options.staleTime }
            : {}),
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
// OBTENER MI HISTORIAL DE TURNOS
// ============================================

export function useMiHistorialTurnos() {
    const { identidad } = useAuth();

    const pacienteId =
        identidad?.tipo === "paciente"
            ? identidad.id
            : "";

    return useQuery({
        // El ID se usa solo para aislar la caché entre sesiones.
        // No se envía al backend: la identidad sale del JWT.
        queryKey: [
            ...miHistorialTurnosQueryKey,
            pacienteId,
        ],

        queryFn: getMiHistorialTurnos,

        enabled: Boolean(pacienteId),

        // Información personal: no reutilizar ni retener datos de
        // consultas anteriores.
        staleTime: 0,
        gcTime: 0,
    });
}

// ============================================
// CREAR MI TURNO
// ============================================

export function useCrearMiTurno() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (datos: CrearMiTurnoData) =>
            crearMiTurno(datos),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: disponibilidadQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: miHistorialTurnosQueryKey,
            });
        },
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

// ============================================
// ACTUALIZAR ESTADO DEL TURNO
// ============================================

export function useUpdateEstadoTurno() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            estado,
        }: {
            id: string;
            estado: EstadoTurno;
        }) =>
            updateEstadoTurno(id, estado),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: turnosQueryKey,
            });
        },
    });
}
