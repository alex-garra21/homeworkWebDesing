interface FiltrosInventarioProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoria: string;
  onCategoriaChange: (valor: string) => void;
  categoriasDisponibles: string[];
}

export const FiltrosInventario = ({
  busqueda,
  onBusquedaChange,
  categoria,
  onCategoriaChange,
  categoriasDisponibles,
}: FiltrosInventarioProps) => {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar por nombre..."
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ width: '220px' }}>
        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        >
          <option value="">Todas las categorías</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};