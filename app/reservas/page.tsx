import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonEliminarReserva } from "./boton-eliminar";
import { BotonConfirmarReserva } from "./boton-confirmar";
import { tarjeta } from "@/app/lib/estilos";

// Mapping for status badge styles based on the 'estado' field.
const etiquetaEstado: Record<string, string> = {
  pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-gray-100 text-gray-500 border-gray-200",
};

export default async function PaginaReservas({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;

  // Fetch all reservations ordered by date, including the related service name.
  const reservas = await prisma.reserva.findMany({
    where: estado ? { estado } : undefined,
    orderBy: { fecha: "asc" },
    include: { servicio: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Reservas</h1>
        <Link
          href="/reservas/nueva"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          Nueva reserva
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Link href="/reservas" className={`px-3 py-1 rounded text-sm ${!estado ? "bg-gray-200 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>Todas</Link>
        <Link href="/reservas?estado=pendiente" className={`px-3 py-1 rounded text-sm ${estado === "pendiente" ? "bg-yellow-100 text-yellow-800 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>Pendientes</Link>
        <Link href="/reservas?estado=confirmada" className={`px-3 py-1 rounded text-sm ${estado === "confirmada" ? "bg-green-100 text-green-800 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>Confirmadas</Link>
        <Link href="/reservas?estado=cancelada" className={`px-3 py-1 rounded text-sm ${estado === "cancelada" ? "bg-gray-200 text-gray-800 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>Canceladas</Link>
      </div>

      {reservas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay reservas registradas.</p>
      ) : (
        <ul className="space-y-3">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`${tarjeta} flex items-start justify-between`}
            >
              <div>
                <p className="font-medium text-sm text-gray-600">{reserva.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {reserva.servicio.nombre} —{" "}
                  {new Date(reserva.fecha).toLocaleString("es-SV")}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${
                    etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente
                  }`}
                >
                  {reserva.estado}
                </span>
              </div>
              <div className="flex gap-2">
                {reserva.estado === "pendiente" && (
                  <BotonConfirmarReserva id={reserva.id} />
                )}
                {reserva.estado !== "cancelada" && (
                  <BotonEliminarReserva id={reserva.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}