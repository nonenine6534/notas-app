import { buscarColor, crearExtracto, formatearFechaHora } from '../utils/notas.js'

// ============================================================
// Componente Papelera: la vista de notas eliminadas.
//
// Aquí el borrado es en dos pasos (patrón "papelera" o
// soft delete, muy común en apps reales como Gmail o Drive):
//   1. Borrar una nota solo la MUEVE aquí, no la destruye.
//   2. Desde aquí se puede RESTAURAR o ELIMINAR para siempre.
//
// Props:
//   - papelera: arreglo de notas eliminadas.
//   - onRestaurar(id): devuelve la nota a la lista principal.
//   - onEliminarDefinitivo(id): borra esa nota sin vuelta atrás.
//   - onVaciar(): borra TODAS las notas de la papelera.
// ============================================================

export default function Papelera({
  papelera,
  onRestaurar,
  onEliminarDefinitivo,
  onVaciar,
}) {
  // Pedimos confirmación antes de una acción irreversible.
  // window.confirm es simple y suficiente para este proyecto.
  function confirmarVaciar() {
    if (papelera.length === 0) return
    const seguro = window.confirm(
      `¿Vaciar la papelera? Se eliminarán ${papelera.length} nota(s) para siempre. Esta acción no se puede deshacer.`
    )
    if (seguro) onVaciar()
  }

  function confirmarEliminar(nota) {
    const seguro = window.confirm(
      `¿Eliminar definitivamente "${nota.titulo}"? Esta acción no se puede deshacer.`
    )
    if (seguro) onEliminarDefinitivo(nota.id)
  }

  if (papelera.length === 0) {
    return (
      <section className="papelera">
        <p className="sin-notas">
          La papelera está vacía. Las notas que borres aparecerán aquí y
          podrás recuperarlas.
        </p>
      </section>
    )
  }

  return (
    <section className="papelera">
      <div className="papelera-cabecera">
        <p className="papelera-aviso">
          {papelera.length}{' '}
          {papelera.length === 1 ? 'nota en la papelera' : 'notas en la papelera'}.
          Restaurarlas las devuelve a tus notas.
        </p>
        <button type="button" className="btn-vaciar" onClick={confirmarVaciar}>
          Vaciar papelera
        </button>
      </div>

      <div className="notas">
        {papelera.map((nota) => {
          const color = buscarColor(nota.color)
          return (
            <article
              key={nota.id}
              className="nota nota-en-papelera"
              style={{ backgroundColor: color.fondo, borderColor: color.borde }}
            >
              <h3>{nota.titulo}</h3>

              {nota.contenido ? (
                <p className="nota-extracto">{crearExtracto(nota.contenido, 140)}</p>
              ) : (
                <p className="nota-extracto nota-sin-contenido">Sin contenido</p>
              )}

              {nota.etiquetas && nota.etiquetas.length > 0 && (
                <div className="nota-etiquetas">
                  {nota.etiquetas.map((etiqueta) => (
                    <span key={etiqueta} className="chip">
                      #{etiqueta}
                    </span>
                  ))}
                </div>
              )}

              <div className="nota-meta">
                <span className="fecha">
                  Eliminada: {formatearFechaHora(nota.fechaEliminacion)}
                </span>
              </div>

              <div className="acciones">
                <button type="button" onClick={() => onRestaurar(nota.id)}>
                  Restaurar
                </button>
                <button
                  type="button"
                  className="btn-borrar-nota"
                  onClick={() => confirmarEliminar(nota)}
                >
                  Eliminar definitivamente
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
