import type { Equipo, Prestamo } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error en la petición: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const obtenerEquipos = async (): Promise<Equipo[]> => {
  const res = await fetch(`${API_URL}/equipos`);
  return handleResponse<Equipo[]>(res);
};

export const obtenerPrestamosActivos = async (): Promise<Prestamo[]> => {
  const res = await fetch(`${API_URL}/prestamos?devuelto=false`);
  return handleResponse<Prestamo[]>(res);
};

export const crearPrestamo = async (prestamo: Omit<Prestamo, 'id'>): Promise<Prestamo> => {
  const res = await fetch(`${API_URL}/prestamos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prestamo),
  });
  return handleResponse<Prestamo>(res);
};

export const actualizarDisponibilidadEquipo = async (id: number, disponible: boolean): Promise<Equipo> => {
  const res = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disponible }),
  });
  return handleResponse<Equipo>(res);
};

export const marcarPrestamoDevuelto = async (id: number): Promise<Prestamo> => {
  const res = await fetch(`${API_URL}/prestamos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ devuelto: true }),
  });
  return handleResponse<Prestamo>(res);
};