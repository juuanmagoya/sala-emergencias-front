
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createUsuario,
    desactivarUsuario,
    getUsuarioById,
    getUsuarios,
    updateUsuario,
} from "@/api/usuario.api";

import type {
    CrearUsuarioData,
    ActualizarUsuarioData,
} from "@/types/usuario";

// ============================================
// QUERY KEYS
// ============================================

const usuariosQueryKey = ["usuarios"];

// ============================================
// OBTENER USUARIOS
// ============================================

export function useUsuarios() {
    return useQuery({
        queryKey: usuariosQueryKey,

        queryFn: getUsuarios,
    });
}

// ============================================
// OBTENER USUARIO POR ID
// ============================================

export function useUsuarioById(id: string) {
    return useQuery({
        queryKey: [
            ...usuariosQueryKey,
            id,
        ],

        queryFn: () => getUsuarioById(id),

        enabled: Boolean(id),
    });
}

// ============================================
// CREAR USUARIO
// ============================================

export function useCreateUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (usuario: CrearUsuarioData) =>
            createUsuario(usuario),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: usuariosQueryKey,
            });
        },
    });
}

// ============================================
// ACTUALIZAR USUARIO
// ============================================

export function useUpdateUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            usuario,
        }: {
            id: string;
            usuario: ActualizarUsuarioData;
        }) => updateUsuario(id, usuario),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: usuariosQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ...usuariosQueryKey,
                    variables.id,
                ],
            });
        },
    });
}

// ============================================
// DESACTIVAR USUARIO
// ============================================

export function useDesactivarUsuario() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            desactivarUsuario(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: usuariosQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ...usuariosQueryKey,
                    id,
                ],
            });
        },
    });
}
