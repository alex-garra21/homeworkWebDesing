import type { Equipo } from '../types';

export interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (id: number) => void;
}

export const TarjetaEquipo = ({ equipo, onPrestar }: TarjetaEquipoProps) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px' }}>
      <h3>{equipo.nombre}</h3>
      <p><strong>Categoría:</strong> {equipo.categoria}</p>
      
      <p>
        <strong>Estado: </strong>
        {equipo.disponible ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>Disponible</span>
        ) : (
          <span style={{ color: 'red', fontWeight: 'bold' }}>Prestado</span>
        )}
      </p>

      <button 
        disabled={!equipo.disponible} 
        onClick={() => onPrestar(equipo.id)}
      >
        Prestar
      </button>
    </div>
  );
};