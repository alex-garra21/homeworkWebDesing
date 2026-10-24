import type { Prestamo, Equipo } from '../types';

interface PrestamosActivosProps {
  prestamos: Prestamo[];
  equipos: Equipo[];
  onDevolver: (prestamoId: number, equipoId: number) => void;
}

export const PrestamosActivos = ({ prestamos, equipos, onDevolver }: PrestamosActivosProps) => {
  // Filtrar únicamente los préstamos no devueltos
  const prestamosPendientes = prestamos.filter((p) => !p.devuelto);

  // Regla de variante (8 o 9): Ordenar por fecha límite, el más próximo primero
  const prestamosOrdenados = [...prestamosPendientes].sort((a, b) => {
    return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
  });

  const hoy = new Date();

  const obtenerNombreEquipo = (equipoId: number) => {
    const eq = equipos.find((e) => e.id === equipoId);
    return eq ? eq.nombre : `Equipo #${equipoId}`;
  };

  return (
    <section style={{ marginTop: '32px' }}>
      <h2>Préstamos Activos</h2>
      {prestamosOrdenados.length === 0 ? (
        <p>No hay préstamos activos en este momento.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '8px' }}>Equipo</th>
              <th style={{ padding: '8px' }}>Solicitante</th>
              <th style={{ padding: '8px' }}>Carné</th>
              <th style={{ padding: '8px' }}>Fecha Límite</th>
              <th style={{ padding: '8px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {prestamosOrdenados.map((prestamo) => {
              const estaVencido = new Date(prestamo.fechaLimite) < hoy;

              return (
                <tr
                  key={prestamo.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: estaVencido ? '#ffe6e6' : 'transparent',
                    color: estaVencido ? '#900' : 'inherit',
                  }}
                >
                  <td style={{ padding: '8px' }}>{obtenerNombreEquipo(prestamo.equipoId)}</td>
                  <td style={{ padding: '8px' }}>{prestamo.solicitante}</td>
                  <td style={{ padding: '8px' }}>{prestamo.carne}</td>
                  <td style={{ padding: '8px' }}>
                    {new Date(prestamo.fechaLimite).toLocaleDateString()}
                    {estaVencido && (
                      <span style={{ fontWeight: 'bold', marginLeft: '6px' }}>(Vencido)</span>
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => onDevolver(prestamo.id, prestamo.equipoId)}
                      style={{ padding: '4px 8px', cursor: 'pointer' }}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};