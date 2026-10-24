import { useState, useEffect, useCallback } from 'react';
import type { Equipo, Prestamo } from '../types';
import { obtenerEquipos, obtenerPrestamosActivos } from '../services/api';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [equiposData, prestamosData] = await Promise.all([
        obtenerEquipos(),
        obtenerPrestamosActivos(),
      ]);
      setEquipos(equiposData);
      setPrestamos(prestamosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    equipos,
    prestamos,
    cargando,
    error,
    reintentar: cargarDatos,
    setEquipos,
    setPrestamos,
  };
};