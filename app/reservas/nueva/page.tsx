import { prisma } from "@/lib/prisma";
import { FormularioReserva } from "./formulario-reserva";

export default async function PaginaNuevaReservaServidor() {
  // Obtenemos solo los campos necesarios (id y nombre) de los servicios
  // para llenar el dropdown del formulario.
  const servicios = await prisma.servicio.findMany({
    select: {
      id: true,
      nombre: true,
      duracion: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return <FormularioReserva servicios={servicios as any} />;
}