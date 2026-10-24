import { useState } from 'react';
import type { Equipo } from '../types';
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
  const [equipos] = useState<Equipo[]>(EQUIPOS_INICIALES);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);

  const handleAbrirFormulario = (id: number) => {
    const seleccionado = equipos.find((e) => e.id === id) || null;
    setEquipoSeleccionado(seleccionado);
  };

  const handleGuardarTemporal = (datos: { solicitante: string; carne: string; fechaLimite: string }) => {
    console.log('Datos recibidos del formulario:', datos);
    setEquipoSeleccionado(null);
  };

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Encabezado equipos={equipos} />
      <ListaEquipos equipos={equipos} onPrestar={handleAbrirFormulario} />

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          onGuardar={handleGuardarTemporal}
          onCancelar={() => setEquipoSeleccionado(null)}
        />
      )}
    </main>
  );
};