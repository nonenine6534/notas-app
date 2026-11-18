import { useState, useEffect } from 'react'
import TarjetaNota from './components/TarjetaNota.jsx'
import './App.css'

// ============================================================
// App de Notas en React, con guardado en localStorage
//
// Cada nota es un objeto: { id, titulo, contenido, fecha }
// El mismo formulario sirve para crear notas y para editarlas:
// si "idEdicion" tiene un valor, estamos editando esa nota.
// ============================================================

const CLAVE = 'notas-app'

// Lee las notas guardadas en el navegador. Si no hay nada
// guardado o el dato está dañado, devuelve una lista vacía.
function cargarNotas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

export default function App() {
  // useState con función inicializadora: las notas se leen de
  // localStorage solo en el primer dibujo de la aplicación.
  const [notas, setNotas] = useState(cargarNotas)

  // Campos del formulario y del buscador (inputs controlados)
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // null = creando una nota nueva; un id = editando esa nota
  const [idEdicion, setIdEdicion] = useState(null)

  // useEffect: guarda las notas en localStorage tras cada cambio
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(notas))
  }, [notas])

  // Vuelve el formulario a modo "crear" y limpia los campos
  function limpiarFormulario() {
    setIdEdicion(null)
    setTitulo('')
    setContenido('')
  }

  // Guardar: crea una nota nueva o actualiza la que se edita
  function guardarNota(evento) {
    evento.preventDefault()
    const tituloLimpio = titulo.trim()
    const contenidoLimpio = contenido.trim()
    if (tituloLimpio === '' && contenidoLimpio === '') return // nota vacía

    if (idEdicion === null) {
      // Nota nueva: va al principio de la lista (unshift hecho
      // de forma inmutable: arreglo nuevo con la nota delante)
      const nueva = {
        id: Date.now(),
        titulo: tituloLimpio || 'Sin título',
        contenido: contenidoLimpio,
        fecha: new Date().toISOString(),
      }
      setNotas((previas) => [nueva, ...previas])
    } else {
      // Edición: .map() reemplaza solo la nota con ese id
      setNotas((previas) =>
        previas.map((nota) =>
          nota.id === idEdicion
            ? { ...nota, titulo: tituloLimpio || 'Sin título', contenido: contenidoLimpio, fecha: new Date().toISOString() }
            : nota
        )
      )
    }
    limpiarFormulario()
  }

  // Carga los datos de una nota en el formulario para editarla
  function empezarEdicion(nota) {
    setIdEdicion(nota.id)
    setTitulo(nota.titulo)
    setContenido(nota.contenido)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function borrarNota(id) {
    setNotas((previas) => previas.filter((nota) => nota.id !== id))
    if (idEdicion === id) limpiarFormulario()
  }

  // La búsqueda mira en el título y en el contenido,
  // sin distinguir mayúsculas de minúsculas.
  const consulta = busqueda.trim().toLowerCase()
  const visibles = notas.filter(
    (nota) =>
      nota.titulo.toLowerCase().includes(consulta) ||
      nota.contenido.toLowerCase().includes(consulta)
  )

  return (
    <main className="app">
      <h1>Mis notas</h1>

      <form className="form-nota" onSubmit={guardarNota}>
        <input
          type="text"
          placeholder="Título de la nota"
          autoComplete="off"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          rows="4"
          placeholder="Escribe tu nota..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <div className="form-botones">
          <button type="submit" id="btn-guardar">
            {idEdicion === null ? 'Guardar nota' : 'Guardar cambios'}
          </button>
          {idEdicion !== null && (
            <button type="button" id="btn-cancelar" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <input
        id="buscador"
        type="search"
        placeholder="Buscar notas por título o contenido..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <section className="notas">
        {visibles.map((nota) => (
          <TarjetaNota
            key={nota.id}
            nota={nota}
            onEditar={empezarEdicion}
            onBorrar={borrarNota}
          />
        ))}
      </section>

      {visibles.length === 0 && (
        <p className="sin-notas">Todavía no hay notas que mostrar.</p>
      )}
    </main>
  )
}
