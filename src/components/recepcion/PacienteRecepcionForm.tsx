import { useEffect } from "react";

import {
    ArrowRight,
    Phone,
    UserRound,
    X,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
    FormInput,
    FormSection,
} from "@/components/pacientes/PacienteFormSections";

import {
    pacienteMinimoSchema,
    type PacienteMinimoFormData,
} from "@/schemas/recepcion.schema";

import type { PacienteMinimoData } from "@/types/recepcion";

// ============================================================
// TIPOS
// ============================================================

export interface PacienteRecepcionFormProps {
    dni: string;
    datosIniciales?: PacienteMinimoData | null;
    textoCancelar?: string;
    onDatosListos: (datos: PacienteMinimoData) => void;
    onCancelar: () => void;
}

// ============================================================
// COMPONENTE
// ============================================================

export default function PacienteRecepcionForm({
    dni,
    datosIniciales = null,
    textoCancelar = "Cancelar y buscar otro DNI",
    onDatosListos,
    onCancelar,
}: PacienteRecepcionFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PacienteMinimoFormData>({
        resolver: zodResolver(pacienteMinimoSchema),
        defaultValues: {
            nombre: datosIniciales?.nombre ?? "",
            dni,
            telefono: {
                codigoArea:
                    datosIniciales?.telefono.codigoArea ?? "",
                numero:
                    datosIniciales?.telefono.numero ?? "",
            },
        },
    });

    useEffect(() => {
        setValue("dni", dni);

        if (!datosIniciales) {
            return;
        }

        setValue("nombre", datosIniciales.nombre);
        setValue(
            "telefono.codigoArea",
            datosIniciales.telefono.codigoArea
        );
        setValue(
            "telefono.numero",
            datosIniciales.telefono.numero
        );
    }, [datosIniciales, dni, setValue]);

    const handleFormSubmit = (
        datos: PacienteMinimoFormData
    ) => {
        onDatosListos({
            nombre: datos.nombre.trim().toUpperCase(),
            dni: datos.dni.trim(),
            telefono: {
                codigoArea:
                    datos.telefono.codigoArea.trim(),
                numero: datos.telefono.numero.trim(),
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            className="space-y-5"
        >
            <FormSection
                icon={UserRound}
                title="Datos del paciente nuevo"
                description="Solo se solicitan los datos mínimos para identificarlo."
                color="blue"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        id="nombre-recepcion"
                        label="Nombre completo"
                        required
                        error={errors.nombre}
                        color="blue"
                        register={register("nombre")}
                        placeholder="Ej. Juan Pérez"
                        maxLength={100}
                        autoComplete="off"
                        autoFocus
                        className="md:col-span-2"
                    />

                    <div className="[&_input]:cursor-not-allowed [&_input]:border-slate-200 [&_input]:bg-slate-100 [&_input]:text-slate-500">
                        <FormInput
                            id="dni-recepcion-form"
                            label="DNI"
                            required
                            error={errors.dni}
                            color="blue"
                            register={register("dni")}
                            readOnly
                            inputMode="numeric"
                            maxLength={8}
                            title="El DNI se toma de la búsqueda y no puede modificarse."
                        />
                    </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                    El DNI se toma de la búsqueda y no puede
                    modificarse durante el alta.
                </p>
            </FormSection>

            <FormSection
                icon={Phone}
                title="Teléfono de contacto"
                description="Número con el que el paciente podrá identificarse."
                color="purple"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <FormInput
                        id="codigo-area-recepcion"
                        label="Código de área"
                        required
                        error={errors.telefono?.codigoArea}
                        color="purple"
                        register={register(
                            "telefono.codigoArea"
                        )}
                        placeholder="Ej. 3777"
                        inputMode="numeric"
                        maxLength={5}
                        autoComplete="off"
                    />

                    <FormInput
                        id="numero-telefono-recepcion"
                        label="Número de teléfono"
                        required
                        error={errors.telefono?.numero}
                        color="purple"
                        register={register(
                            "telefono.numero"
                        )}
                        placeholder="Ej. 123456"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="off"
                    />
                </div>
            </FormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancelar}
                    className="h-11 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <X size={16} />
                    {textoCancelar}
                </Button>

                <Button
                    type="submit"
                    className="h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                    Continuar
                    <ArrowRight size={16} />
                </Button>
            </div>
        </form>
    );
}
