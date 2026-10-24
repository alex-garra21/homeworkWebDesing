import type { Equipo } from '../types';

interface EncabezadoProps {
  equipos: Equipo[];
}

export const Encabezado = ({ equipos }: EncabezadoProps) => {
  const disponibles = equipos.filter((e) => e.disponible).length;
  const total = equipos.length;

  return (
    <header style={{ marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
      <h1>Préstamos Lab - 0902-20-698</h1>
      <p style={{ fontSize: '1.1rem' }}>
        <strong>{disponibles}</strong> de <strong>{total}</strong> equipos disponibles
      </p>
    </header>
  );
};