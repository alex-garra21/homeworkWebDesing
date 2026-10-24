import { useState } from 'react';
import type { Equipo, Prestamo } from '../types';
import { Encabezado } from '../components/Encabezado';
import { ListaEquipos } from '../components/ListaEquipos';
import { FormularioPrestamo } from '../components/FormularioPrestamo';

const EQUIPOS_INICIALES: Equipo[] = [
  { id: 1, nombre: 'Switch Cisco 2960 24 Puertos', categoria: 'Switch', disponible: true },
  { id: 2, nombre: 'Switch TP-Link Gigabit 8 Puertos', categoria: 'Switch', disponible: true },
  { id: 3, nombre: 'Switch Administrable Ubiquiti 16P', categoria: 'Switch', disponible: false },
  { id: 4, nombre: 'Cable de Red UTP Cat 6 (5m)', categoria: 'Cable de red', disponible: true },
  { id: 5, nombre: 'Cable de Red UTP Cat 6 (10m)', categoria: 'Cable de red', disponible: true },
  { id: 6, nombre: 'Bobina Cable de Red Cat 5e (15m)', categoria: 'Cable de red', disponible: false },
  { id: 7, nombre: 'Access Point Ubiquiti UniFi AC-Lite', categoria: 'Access Point', disponible: true },
  { id: 8, nombre: 'Access Point TP-Link Omada EAP225', categoria: 'Access Point', disponible: true },
];

export const Inventario = () => {
  const [equipos, setEquipos] = useState<Equipo[]>(EQUIPOS_INICIALES);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);

  const handleAbrirFormulario = (id: number) => {
    const seleccionado = equipos.find((e) => e.id === id) || null;
    setEquipoSeleccionado(seleccionado);
  };

  // 2. Procesar el préstamo de forma inmutable
  const handleGuardarPrestamo = (datos: { solicitante: string; carne: string; fechaLimite: string }) => {
    if (!equipoSeleccionado) return;

    // Crear el nuevo objeto de préstamo
    const nuevoPrestamo: Prestamo = {
      id: Date.now(), // ID numérico único local
      equipoId: equipoSeleccionado.id,
      solicitante: datos.solicitante,
      carne: datos.carne,
      fechaPrestamo: new Date().toISOString(),
      fechaLimite: datos.fechaLimite,
      devuelto: false,
    };

    // Actualización inmutable del arreglo de préstamos con spread operator
    setPrestamos((prevPrestamos) => [...prevPrestamos, nuevoPrestamo]);

    // Actualización inmutable de equipos con .map() (equipo pasa a disponible: false)
    setEquipos((prevEquipos) =>
      prevEquipos.map((item) =>
        item.id === equipoSeleccionado.id
          ? { ...item, disponible: false }
          : item
      )
    );

    // Cerrar el modal
    setEquipoSeleccionado(null);
  };

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Encabezado equipos={equipos} />
      <ListaEquipos equipos={equipos} onPrestar={handleAbrirFormulario} />

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          onGuardar={handleGuardarPrestamo}
          onCancelar={() => setEquipoSeleccionado(null)}
        />
      )}
    </main>
  );
};