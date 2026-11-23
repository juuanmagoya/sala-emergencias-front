import api from "@/api/axios";

import type {
    ConfirmacionImportacionResponse,
    ImportacionPacientesArchivo,
    PrevisualizacionImportacionResponse,
} from "@/types/importacionPacientes";

const URL_PREVISUALIZAR = "/pacientes/importar/previsualizar";
const URL_CONFIRMAR = "/pacientes/importar";

/**
 * Construye el multipart/form-data que espera el backend.
 *
 * `hoja` solo se adjunta cuando el usuario seleccionó una hoja. El
 * backend la ignora si el archivo tiene una única hoja.
 */
function construirFormData({
    archivo,
    hoja,
}: ImportacionPacientesArchivo): FormData {
    const formData = new FormData();

    formData.append("archivo", archivo);

    const hojaNormalizada = hoja?.trim();

    if (hojaNormalizada) {
        formData.append("hoja", hojaNormalizada);
    }

    return formData;
}

/**
 * Previsualizar una importación sin persistir pacientes.
 *
 * Se elimina el Content-Type JSON heredado de la instancia Axios para
 * que el navegador agregue el boundary de multipart/form-data.
 */
export async function previsualizarImportacionPacientes(
    datos: ImportacionPacientesArchivo
): Promise<PrevisualizacionImportacionResponse> {
    const response = await api.post<PrevisualizacionImportacionResponse>(
        URL_PREVISUALIZAR,
        construirFormData(datos),
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );

    return response.data;
}

/**
 * Confirmar la importación y persistir las filas válidas.
 *
 * La respuesta puede contener resultados parciales.
 */
export async function confirmarImportacionPacientes(
    datos: ImportacionPacientesArchivo
): Promise<ConfirmacionImportacionResponse> {
    const response = await api.post<ConfirmacionImportacionResponse>(
        URL_CONFIRMAR,
        construirFormData(datos),
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );

    return response.data;
}
