import { useState, useMemo } from 'react';
import type { Equipo } from '../types';
import { Encabezado } from '../components/Encabezado';
import { ListaEquipos } from '../components/ListaEquipos';
import { FormularioPrestamo } from '../components/FormularioPrestamo';
import { PrestamosActivos } from '../components/PrestamosActivos';
import { FiltrosInventario } from '../components/FiltrosInventario';
import { useEquipos } from '../hooks/useEquipos';
import {
  crearPrestamo,
  actualizarDisponibilidadEquipo,
  marcarPrestamoDevuelto,
} from '../services/api';

export const Inventario = () => {
  const {
    equipos,
    prestamos,
    cargando,
    error,
    reintentar,
    setEquipos,
    setPrestamos,
  } = useEquipos();

  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [devolviendoId, setDevolviendoId] = useState<number | null>(null);

  // Categorías fijas de la variante (Switch, Cable de red, Access Point)
  const categorias = useMemo(() => ['Switch', 'Cable de red', 'Access Point'], []);

  // Filtros combinados en tiempo real
  const equiposFiltrados = useMemo(() => {
    return equipos.filter((item) => {
      const coincideNombre = item.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
      const coincideCategoria = filtroCategoria ? item.categoria === filtroCategoria : true;
      return coincideNombre && coincideCategoria;
    });
  }, [equipos, filtroTexto, filtroCategoria]);

  const handleAbrirFormulario = (id: number) => {
    const seleccionado = equipos.find((e) => e.id === id) || null;
    setEquipoSeleccionado(seleccionado);
  };

  const handleGuardarPrestamo = async (datos: {
    solicitante: string;
    carne: string;
    fechaLimite: string;
  }) => {
    if (!equipoSeleccionado) return;
    setGuardando(true);

    try {
      // 1. Guardar préstamo en la API
      const nuevoPrestamo = await crearPrestamo({
        equipoId: equipoSeleccionado.id,
        solicitante: datos.solicitante,
        carne: datos.carne,
        fechaPrestamo: new Date().toISOString(),
        fechaLimite: datos.fechaLimite,
        devuelto: false,
      });

      // 2. Actualizar disponibilidad en la API
      await actualizarDisponibilidadEquipo(equipoSeleccionado.id, false);

      // 3. Sincronizar estado local de forma inmutable
      setPrestamos((prev) => [...prev, nuevoPrestamo]);
      setEquipos((prev) =>
        prev.map((eq) =>
          eq.id === equipoSeleccionado.id ? { ...eq, disponible: false } : eq
        )
      );

      setEquipoSeleccionado(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar el préstamo');
    } finally {
      setGuardando(false);
    }
  };

  const handleDevolver = async (prestamoId: number, equipoId: number) => {
    setDevolviendoId(prestamoId);
    try {
      // 1. Marcar devuelto en API
      await marcarPrestamoDevuelto(prestamoId);

      // 2. Restablecer disponibilidad del equipo en API
      await actualizarDisponibilidadEquipo(equipoId, true);

      // 3. Sincronizar estados locales inmutablemente
      setPrestamos((prev) =>
        prev.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
      );
      setEquipos((prev) =>
        prev.map((eq) => (eq.id === equipoId ? { ...eq, disponible: true } : eq))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al devolver el equipo');
    } finally {
      setDevolviendoId(null);
    }
  };

  if (cargando) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Cargando inventario...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Error al conectar con el servidor</h2>
        <p>{error}</p>
        <button
          onClick={reintentar}
          style={{ padding: '8px 16px', marginTop: '12px', cursor: 'pointer' }}
        >
          Reintentar
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Encabezado equipos={equipos} />

      <h2>Inventario de Equipos</h2>

      <FiltrosInventario
        busqueda={filtroTexto}
        onBusquedaChange={setFiltroTexto}
        categoria={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        categoriasDisponibles={categorias}
      />

      <ListaEquipos equipos={equiposFiltrados} onPrestar={handleAbrirFormulario} />

      <PrestamosActivos
        prestamos={prestamos}
        equipos={equipos}
        onDevolver={handleDevolver}
        devolviendoId={devolviendoId}
      />

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          onGuardar={handleGuardarPrestamo}
          onCancelar={() => setEquipoSeleccionado(null)}
          isSubmitting={guardando}
        />
      )}
    </main>
  );
};