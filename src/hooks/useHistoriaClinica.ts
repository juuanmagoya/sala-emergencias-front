import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createHistoriaClinica,
    getHistoriasClinicas,
    getHistorialPaciente,
    getMiHistorial,
    getHistoriaClinicaById,
    updateHistoriaClinica,
} from "@/api/historia-clinica.api";

import { useAuth } from "@/hooks/useAuth";

import type {
    CrearHistoriaClinicaData,
    ActualizarHistoriaClinicaData,
} from "@/types/historia-clinica";

// ============================================
// QUERY KEYS
// ============================================

const historiasClinicasQueryKey = ["historias-clinicas"];

const historialPacienteQueryKey = [
    ...historiasClinicasQueryKey,
    "paciente",
];

const miHistorialQueryKey = [
    ...historiasClinicasQueryKey,
    "mi-historial",
];

const historiaClinicaQueryKey = [
    ...historiasClinicasQueryKey,
    "detalle",
];

// ============================================
// OBTENER HISTORIAS CLÍNICAS
// ============================================

export function useHistoriasClinicas() {
    return useQuery({
        queryKey: historiasClinicasQueryKey,

        queryFn: getHistoriasClinicas,
    });
}

// ============================================
// OBTENER HISTORIAL CLÍNICO DE UN PACIENTE
// ============================================

export function useHistorialPaciente(pacienteId: string) {
    return useQuery({
        queryKey: [
            ...historialPacienteQueryKey,
            pacienteId,
        ],

        queryFn: () => getHistorialPaciente(pacienteId),

        enabled: Boolean(pacienteId),
    });
}

// ============================================
// OBTENER EL HISTORIAL DEL PACIENTE AUTENTICADO
// ============================================

export function useMiHistorial() {
    const { identidad } = useAuth();

    const pacienteId =
        identidad?.tipo === "paciente"
            ? identidad.id
            : "";

    return useQuery({
        // El ID del paciente se usa exclusivamente para aislar la
        // caché entre sesiones. No se envía al backend.
        queryKey: [...miHistorialQueryKey, pacienteId],

        queryFn: getMiHistorial,

        enabled: Boolean(pacienteId),

        // Información clínica sensible: no reutilizar ni retener
        // datos de consultas anteriores.
        staleTime: 0,
        gcTime: 0,
    });
}

// ============================================
// OBTENER HISTORIA CLÍNICA POR ID
// ============================================

export function useHistoriaClinicaById(id: string) {
    return useQuery({
        queryKey: [
            ...historiaClinicaQueryKey,
            id,
        ],

        queryFn: () => getHistoriaClinicaById(id),

        enabled: Boolean(id),
    });
}

// ============================================
// CREAR HISTORIA CLÍNICA
// ============================================

export function useCreateHistoriaClinica() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            historiaClinica: CrearHistoriaClinicaData
        ) => createHistoriaClinica(historiaClinica),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: historiasClinicasQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ...historialPacienteQueryKey,
                    variables.paciente,
                ],
            });
        },
    });
}

// ============================================
// ACTUALIZAR HISTORIA CLÍNICA
// ============================================

export function useUpdateHistoriaClinica() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            historiaClinica,
        }: {
            id: string;
            historiaClinica: ActualizarHistoriaClinicaData;
        }) => updateHistoriaClinica(id, historiaClinica),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: historiasClinicasQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: historiaClinicaQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: historialPacienteQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ...historiaClinicaQueryKey,
                    variables.id,
                ],
            });
        },
    });
}