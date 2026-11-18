import {
  buscarColor,
  contarPalabras,
  contarCaracteres,
  crearExtracto,
  formatearFecha,
} from '../utils/notas.js'

// ============================================================
// Componente TarjetaNota: dibuja la tarjeta de UNA nota.
//
// No guarda estado propio: todo lo recibe por props y avisa
// hacia arriba (a App) con callbacks cuando el usuario pulsa
// un botón. Este patrón se llama "levantar el estado".
//
// Props:
//   - nota: el objeto completo de la nota.
//   - onEditar(nota): carga la nota en el editor.
//   - onMoverAPapelera(id): borrado suave (no elimina aún).
//   - onAlternarFijada(id): fija o desfija la nota.
//   - onFiltrarEtiqueta(etiqueta): filtra la lista por esa etiqueta.
// ============================================================

export default function TarjetaNota({
  nota,
  onEditar,
  onMoverAPapelera,
  onAlternarFijada,
  onFiltrarEtiqueta,
}) {
  const color = buscarColor(nota.color)
  const palabras = contarPalabras(nota.contenido)
  const caracteres = contarCaracteres(nota.contenido)
  const extracto = crearExtracto(nota.contenido)

  // ¿La nota fue editada después de crearla? Comparamos las fechas.
  const fueEditada = nota.fechaEdicion !== nota.fechaCreacion

  return (
    <article
      className={`nota ${nota.fijada ? 'nota-fijada' : ''}`}
      style={{ backgroundColor: color.fondo, borderColor: color.borde }}
    >
      {/* Cabecera: distintivo de fijada + botón de pin */}
      <div className="nota-cabecera">
        {nota.fijada ? (
          <span className="distintivo-fijada">📌 Fijada</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="btn-pin"
          title={nota.fijada ? 'Desfijar nota' : 'Fijar nota arriba'}
          aria-label={nota.fijada ? 'Desfijar nota' : 'Fijar nota'}
          onClick={() => onAlternarFijada(nota.id)}
        >
          {nota.fijada ? '📌' : '📍'}
        </button>
      </div>

      <h3>{nota.titulo}</h3>

      {/* Vista previa: solo un extracto, no todo el contenido.
          Así la rejilla se mantiene ordenada aunque la nota sea larga. */}
      {extracto ? (
        <p className="nota-extracto">{extracto}</p>
      ) : (
        <p className="nota-extracto nota-sin-contenido">Sin contenido</p>
      )}

      {/* Etiquetas como chips clicables: al pulsar una, se filtra */}
      {nota.etiquetas && nota.etiquetas.length > 0 && (
        <div className="nota-etiquetas">
          {nota.etiquetas.map((etiqueta) => (
            <button
              key={etiqueta}
              type="button"
              className="chip chip-clicable"
              title={`Filtrar por #${etiqueta}`}
              onClick={() => onFiltrarEtiqueta(etiqueta)}
            >
              #{etiqueta}
            </button>
          ))}
        </div>
      )}

      {/* Metadatos: fechas y tamaño de la nota */}
      <div className="nota-meta">
        <span className="fecha">Creada: {formatearFecha(nota.fechaCreacion)}</span>
        {fueEditada && (
          <span className="fecha">Editada: {formatearFecha(nota.fechaEdicion)}</span>
        )}
        <span className="conteo">
          {palabras} {palabras === 1 ? 'palabra' : 'palabras'} · {caracteres} car.
        </span>
      </div>

      <div className="acciones">
        <button type="button" onClick={() => onEditar(nota)}>
          Editar
        </button>
        <button
          type="button"
          className="btn-borrar-nota"
          onClick={() => onMoverAPapelera(nota.id)}
        >
          A la papelera
        </button>
      </div>
    </article>
  )
}
