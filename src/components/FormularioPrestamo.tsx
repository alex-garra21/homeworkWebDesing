import { useState } from 'react';
import type { Equipo } from '../types';

interface FormularioPrestamoProps {
  equipo: Equipo;
  onGuardar: (datos: { solicitante: string; carne: string; fechaLimite: string }) => Promise<void>;
  onCancelar: () => void;
  isSubmitting?: boolean;
}

interface ErroresFormulario {
  solicitante?: string;
  carne?: string;
  fechaLimite?: string;
}

export const FormularioPrestamo = ({
  equipo,
  onGuardar,
  onCancelar,
  isSubmitting = false,
}: FormularioPrestamoProps) => {
  const [solicitante, setSolicitante] = useState('');
  const [carne, setCarne] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const validar = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};

    if (!solicitante.trim()) {
      nuevosErrores.solicitante = 'El nombre del solicitante es obligatorio.';
    } else if (solicitante.trim().length < 5) {
      nuevosErrores.solicitante = 'Debe tener al menos 5 caracteres.';
    }

    const regexCarne = /^\d{4}-\d{2}-\d{5}$/;
    if (!carne.trim()) {
      nuevosErrores.carne = 'El carné es obligatorio.';
    } else if (!regexCarne.test(carne)) {
      nuevosErrores.carne = 'Formato inválido. Debe ser 0000-00-00000.';
    }

    if (!fechaLimite) {
      nuevosErrores.fechaLimite = 'La fecha límite es obligatoria.';
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const [anio, mes, dia] = fechaLimite.split('-').map(Number);
      const fechaSeleccionada = new Date(anio, mes - 1, dia);

      const maxFecha = new Date(hoy);
      maxFecha.setDate(maxFecha.getDate() + 4);

      if (fechaSeleccionada < hoy) {
        nuevosErrores.fechaLimite = 'La fecha límite no puede ser anterior a hoy.';
      } else if (fechaSeleccionada > maxFecha) {
        nuevosErrores.fechaLimite = 'No puede superar el máximo permitido de 4 días.';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validar() && !isSubmitting) {
      await onGuardar({
        solicitante: solicitante.trim(),
        carne: carne.trim(),
        fechaLimite: new Date(fechaLimite).toISOString(),
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ background: '#fff', color: '#333', padding: '24px', borderRadius: '8px', width: '380px' }}>
        <h3>Prestar Equipo</h3>
        <p><strong>Equipo:</strong> {equipo.nombre}</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Solicitante:</label>
            <input
              type="text"
              disabled={isSubmitting}
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Nombre completo"
            />
            {errores.solicitante && (
              <span style={{ color: 'red', fontSize: '0.85rem' }}>{errores.solicitante}</span>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Carné:</label>
            <input
              type="text"
              disabled={isSubmitting}
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="0000-00-00000"
            />
            {errores.carne && (
              <span style={{ color: 'red', fontSize: '0.85rem' }}>{errores.carne}</span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Fecha límite:</label>
            <input
              type="date"
              disabled={isSubmitting}
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            {errores.fechaLimite && (
              <span style={{ color: 'red', fontSize: '0.85rem', display: 'block' }}>{errores.fechaLimite}</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" disabled={isSubmitting} onClick={onCancelar} style={{ padding: '8px 12px' }}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 12px',
                backgroundColor: isSubmitting ? '#999' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};