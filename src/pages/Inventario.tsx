import { useState } from 'react';
import type { Equipo, Prestamo } from '../types';
import { Encabezado } from '../components/Encabezado';
import { ListaEquipos } from '../components/ListaEquipos';
import { FormularioPrestamo } from '../components/FormularioPrestamo';
import { PrestamosActivos } from '../components/PrestamosActivos';

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

  const handleGuardarPrestamo = (datos: { solicitante: string; carne: string; fechaLimite: string }) => {
    if (!equipoSeleccionado) return;

    const nuevoPrestamo: Prestamo = {
      id: Date.now(),
      equipoId: equipoSeleccionado.id,
      solicitante: datos.solicitante,
      carne: datos.carne,
      fechaPrestamo: new Date().toISOString(),
      fechaLimite: datos.fechaLimite,
      devuelto: false,
    };

    setPrestamos((prevPrestamos) => [...prevPrestamos, nuevoPrestamo]);

    setEquipos((prevEquipos) =>
      prevEquipos.map((item) =>
        item.id === equipoSeleccionado.id ? { ...item, disponible: false } : item
      )
    );

    setEquipoSeleccionado(null);
  };

  const handleDevolver = (prestamoId: number, equipoId: number) => {
    // 1. Marcar préstamo como devuelto inmutablemente
    setPrestamos((prevPrestamos) =>
      prevPrestamos.map((p) =>
        p.id === prestamoId ? { ...p, devuelto: true } : p
      )
    );

    // 2. Marcar equipo nuevamente como disponible
    setEquipos((prevEquipos) =>
      prevEquipos.map((eq) =>
        eq.id === equipoId ? { ...eq, disponible: true } : eq
      )
    );
  };

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Encabezado equipos={equipos} />
      
      <h2>Inventario de Equipos</h2>
      <ListaEquipos equipos={equipos} onPrestar={handleAbrirFormulario} />

      <PrestamosActivos
        prestamos={prestamos}
        equipos={equipos}
        onDevolver={handleDevolver}
      />

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