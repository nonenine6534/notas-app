import { useState, useEffect } from 'react'
import {
  COLORES,
  contarPalabras,
  contarCaracteres,
  textoAEtiquetas,
  etiquetasATexto,
} from '../utils/notas.js'

// ============================================================
// Componente EditorNota: el formulario para crear y editar.
//
// Es un componente "controlado": cada campo vive en un estado
// y React redibuja el input con ese valor en cada tecla.
//
// Props que recibe:
//   - notaEnEdicion: la nota que se está editando, o null si
//     estamos creando una nota nueva.
//   - onGuardar(datos): se llama al enviar el formulario con
//     un objeto { titulo, contenido, etiquetas, color, fijada }.
//   - onCancelar(): se llama si se cancela la edición.
//
// El estado del formulario vive AQUÍ (no en App) porque solo
// este componente lo necesita. App solo recibe el resultado
// final cuando se pulsa "Guardar".
// ============================================================

export default function EditorNota({ notaEnEdicion, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  // Las etiquetas se escriben como texto separado por comas.
  // Es más simple para el usuario que un sistema complejo de chips
  // con botón "añadir": escribe, separa por comas y listo.
  const [etiquetasTexto, setEtiquetasTexto] = useState('')
  const [color, setColor] = useState('amarillo')
  const [fijada, setFijada] = useState(false)

  // Cuando App pone una nota en edición, este efecto copia sus
  // datos a los campos. Cuando notaEnEdicion vuelve a null,
  // el formulario se limpia para crear la siguiente nota.
  useEffect(() => {
    if (notaEnEdicion) {
      setTitulo(notaEnEdicion.titulo)
      setContenido(notaEnEdicion.contenido)
      setEtiquetasTexto(etiquetasATexto(notaEnEdicion.etiquetas))
      setColor(notaEnEdicion.color || 'amarillo')
      setFijada(Boolean(notaEnEdicion.fijada))
    } else {
      setTitulo('')
      setContenido('')
      setEtiquetasTexto('')
      setColor('amarillo')
      setFijada(false)
    }
  }, [notaEnEdicion])

  // Vista previa de las etiquetas como chips, en vivo.
  // Se calcula en cada render a partir del texto escrito.
  const etiquetasVistaPrevia = textoAEtiquetas(etiquetasTexto)

  // Contadores en vivo para el pie del editor.
  const palabras = contarPalabras(contenido)
  const caracteres = contarCaracteres(contenido)

  function manejarEnvio(evento) {
    evento.preventDefault()
    const tituloLimpio = titulo.trim()
    const contenidoLimpio = contenido.trim()
    // No guardamos notas completamente vacías.
    if (tituloLimpio === '' && contenidoLimpio === '') return

    onGuardar({
      titulo: tituloLimpio || 'Sin título',
      contenido: contenidoLimpio,
      etiquetas: etiquetasVistaPrevia,
      color,
      fijada,
    })
  }

  const estaEditando = notaEnEdicion !== null

  return (
    <form className="form-nota" onSubmit={manejarEnvio}>
      <h2 className="form-titulo">
        {estaEditando ? 'Editar nota' : 'Nueva nota'}
      </h2>

      <input
        type="text"
        placeholder="Título de la nota"
        autoComplete="off"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        rows="5"
        placeholder="Escribe tu nota..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />

      {/* Contador de palabras y caracteres, se actualiza al escribir */}
      <div className="contador" aria-live="polite">
        {palabras} {palabras === 1 ? 'palabra' : 'palabras'} · {caracteres}{' '}
        {caracteres === 1 ? 'carácter' : 'caracteres'}
      </div>

      <input
        type="text"
        placeholder="Etiquetas separadas por comas: trabajo, ideas, estudio"
        autoComplete="off"
        value={etiquetasTexto}
        onChange={(e) => setEtiquetasTexto(e.target.value)}
      />

      {/* Chips de vista previa: lo que escribes se ve al instante */}
      {etiquetasVistaPrevia.length > 0 && (
        <div className="chips-vista-previa">
          {etiquetasVistaPrevia.map((etiqueta) => (
            <span key={etiqueta} className="chip">
              #{etiqueta}
            </span>
          ))}
        </div>
      )}

      {/* Selector de color: un botón circular por cada color.
          El elegido se marca con la clase "seleccionado". */}
      <div className="selector-color">
        <span className="selector-color-etiqueta">Color:</span>
        <div className="colores">
          {COLORES.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              className={`btn-color ${color === opcion.id ? 'seleccionado' : ''}`}
              style={{ backgroundColor: opcion.fondo, borderColor: opcion.borde }}
              title={opcion.nombre}
              aria-label={`Color ${opcion.nombre}`}
              aria-pressed={color === opcion.id}
              onClick={() => setColor(opcion.id)}
            >
              {color === opcion.id ? '✓' : ''}
            </button>
          ))}
        </div>

        {/* Interruptor simple para fijar la nota al crearla/editarla */}
        <label className="check-fijar">
          <input
            type="checkbox"
            checked={fijada}
            onChange={(e) => setFijada(e.target.checked)}
          />
          📌 Fijar arriba
        </label>
      </div>

      <div className="form-botones">
        <button type="submit" id="btn-guardar">
          {estaEditando ? 'Guardar cambios' : 'Guardar nota'}
        </button>
        {estaEditando && (
          <button type="button" id="btn-cancelar" onClick={onCancelar}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  )
}
