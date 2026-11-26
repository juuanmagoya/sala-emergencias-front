
import { useMutation } from "@tanstack/react-query";

import { registrarPaciente } from "@/api/registroPaciente.api";

import type {
    RegistrarPacienteData,
} from "@/types/registroPaciente";

export function useRegistroPaciente() {
    return useMutation({
        mutationFn: (
            paciente: RegistrarPacienteData
        ) => registrarPaciente(paciente),
    });
}
