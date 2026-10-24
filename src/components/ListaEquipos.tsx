import type { Equipo } from '../types';
import { TarjetaEquipo } from './TarjetaEquipo';

interface ListaEquiposProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export const ListaEquipos = ({ equipos, onPrestar }: ListaEquiposProps) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
      {equipos.map((equipo) => (
        <TarjetaEquipo 
          key={equipo.id} 
          equipo={equipo} 
          onPrestar={onPrestar} 
        />
      ))}
    </div>
  );
};