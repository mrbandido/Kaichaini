import { useState } from 'react';

// Input con error en línea y botón ver/ocultar contraseña
export default function Campo({ label, error, type = 'text', ...props }) {
  const [ver, setVer] = useState(false);
  const esPassword = type === 'password';
  const id = props.id || props.name;

  return (
    <div className={`campo ${error ? 'con-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="campo-input">
        <input id={id} type={esPassword && ver ? 'text' : type} {...props} />
        {esPassword && (
          <button type="button" className="ver-clave" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Ver contraseña'}>
            {ver ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <small className="error-texto">{error}</small>}
    </div>
  );
}