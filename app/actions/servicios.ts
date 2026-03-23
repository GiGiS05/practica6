"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Esquema de validación para el formulario de servicio.
// z.coerce.number() convierte el string del formulario a número antes de validar.
const EsquemaServicio = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  descripcion: z.string().optional(),
  duracion: z.coerce.number().positive("La duración debe ser mayor a cero."),
});

// Crea un nuevo servicio en la base de datos.
// _estadoPrevio es requerido por useActionState pero no se utiliza en esta función.
export async function crearServicio(_estadoPrevio: any, formData: FormData) {
  const campos = EsquemaServicio.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    duracion: formData.get("duracion"),
  });

  // Si la validación falla, se retorna el objeto de errores al componente.
  // El componente usa estado.errores para mostrar los mensajes bajo cada campo.
  if (!campos.success) {
    return {
      errores: campos.error.flatten().fieldErrors,
      mensaje: "Error de validación.",
    };
  }

  await prisma.servicio.create({ data: campos.data });

  // Invalida la caché de /servicios para que el listado muestre el nuevo registro.
  // redirect debe llamarse fuera del try/catch porque lanza una excepción internamente.
  revalidatePath("/servicios");
  redirect("/servicios");
}

// Elimina un servicio por ID.
// Retorna un objeto de resultado para que el componente pueda mostrar un error si falla.
export async function eliminarServicio(id: number) {
  try {
    await prisma.servicio.delete({ where: { id } });
    revalidatePath("/servicios");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo eliminar el servicio." };
  }
}