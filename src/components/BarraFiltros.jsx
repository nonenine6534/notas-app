// ============================================================
// Componente BarraFiltros: buscador + filtro por etiquetas.
//
// Es un componente de presentación: no guarda estado, solo
// muestra los controles y avisa a App de cada cambio.
// Así App sigue siendo el único dueño de los filtros.
//
// Props:
//   - busqueda y onCambiarBusqueda(texto)
//   - etiquetas: todas las etiquetas distintas que existen
//   - etiquetaSeleccionada: la activa, o null si no hay filtro
//   - onSeleccionarEtiqueta(etiqueta | null)
// ============================================================

export default function BarraFiltros({
  busqueda,
  onCambiarBusqueda,
  etiquetas,
  etiquetaSeleccionada,
  onSeleccionarEtiqueta,
}) {
  return (
    <div className="barra-filtros">
      <input
        id="buscador"
        type="search"
        placeholder="Buscar por título o contenido..."
        value={busqueda}
        onChange={(e) => onCambiarBusqueda(e.target.value)}
      />

      {/* Filtro por etiqueta: una fila de chips.
          "Todas" limpia el filtro; cada etiqueta lo activa. */}
      {etiquetas.length > 0 && (
        <div className="filtro-etiquetas">
          <span className="filtro-etiqueta-titulo">Etiquetas:</span>
          <button
            type="button"
            className={`chip chip-clicable ${etiquetaSeleccionada === null ? 'chip-activo' : ''}`}
            onClick={() => onSeleccionarEtiqueta(null)}
          >
            Todas
          </button>
          {etiquetas.map((etiqueta) => (
            <button
              key={etiqueta}
              type="button"
              className={`chip chip-clicable ${etiquetaSeleccionada === etiqueta ? 'chip-activo' : ''}`}
              onClick={() =>
                onSeleccionarEtiqueta(
                  // Pulsar la etiqueta activa de nuevo quita el filtro
                  etiquetaSeleccionada === etiqueta ? null : etiqueta
                )
              }
            >
              #{etiqueta}
            </button>
          ))}
          {etiquetaSeleccionada && (
            <button
              type="button"
              className="btn-limpiar-filtro"
              onClick={() => onSeleccionarEtiqueta(null)}
            >
              Quitar filtro ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
