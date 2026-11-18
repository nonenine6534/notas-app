import { useState, useEffect, useMemo } from 'react'
import EditorNota from './components/EditorNota.jsx'
import TarjetaNota from './components/TarjetaNota.jsx'
import BarraFiltros from './components/BarraFiltros.jsx'
import Papelera from './components/Papelera.jsx'
import { normalizarNota } from './utils/notas.js'
import './App.css'

// ============================================================
// App de Notas en React — componente principal
//
// App es el "dueño" del estado global:
//   - notas:     las notas activas
//   - papelera:  las notas con borrado suave (soft delete)
//   - vista:     qué pantalla se ve, 'notas' o 'papelera'
//   - filtros:   texto de búsqueda y etiqueta seleccionada
//   - notaEnEdicion: la nota que el editor está editando
//
// Los demás componentes solo reciben datos por props y avisan
// con callbacks. Este patrón facilita razonar la app: si algo
// cambia, cambia aquí.
//
// Modelo de una nota:
// {
//   id, titulo, contenido,
//   etiquetas: string[],
//   color: id de la paleta (ej. 'azul'),
//   fijada: boolean,
//   fechaCreacion: ISO, fechaEdicion: ISO,
//   fechaEliminacion: ISO | null (solo en la papelera)
// }
// ============================================================

const CLAVE_NOTAS = 'notas-app'
const CLAVE_PAPELERA = 'notas-app-papelera'

// Lee un arreglo guardado en localStorage de forma segura.
// Si no hay nada o el JSON está dañado, devuelve [].
function cargarArreglo(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave))
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function cargarNotas() {
  // normalizarNota adapta notas del formato antiguo al nuevo
  return cargarArreglo(CLAVE_NOTAS).map(normalizarNota)
}

function cargarPapelera() {
  return cargarArreglo(CLAVE_PAPELERA).map(normalizarNota)
}

export default function App() {
  // Inicialización perezosa: la función se ejecuta solo una vez,
  // en el primer render, para leer localStorage.
  const [notas, setNotas] = useState(cargarNotas)
  const [papelera, setPapelera] = useState(cargarPapelera)

  const [vista, setVista] = useState('notas') // 'notas' | 'papelera'
  const [busqueda, setBusqueda] = useState('')
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState(null)
  const [notaEnEdicion, setNotaEnEdicion] = useState(null)

  // Persistencia: cada vez que cambian notas o papelera,
  // se guarda una copia en localStorage. Son dos efectos
  // separados porque son dos datos independientes.
  useEffect(() => {
    localStorage.setItem(CLAVE_NOTAS, JSON.stringify(notas))
  }, [notas])

  useEffect(() => {
    localStorage.setItem(CLAVE_PAPELERA, JSON.stringify(papelera))
  }, [papelera])

  // ---- Acciones sobre notas --------------------------------

  // Crea una nota nueva o actualiza la que está en edición.
  // Recibe los datos ya limpios desde EditorNota.
  function guardarNota(datos) {
    const ahora = new Date().toISOString()

    if (notaEnEdicion === null) {
      const nueva = {
        id: Date.now(),
        ...datos,
        fechaCreacion: ahora,
        fechaEdicion: ahora,
        fechaEliminacion: null,
      }
      // Inmutable: arreglo nuevo con la nota al principio
      setNotas((previas) => [nueva, ...previas])
    } else {
      setNotas((previas) =>
        previas.map((nota) =>
          nota.id === notaEnEdicion.id
            ? { ...nota, ...datos, fechaEdicion: ahora }
            : nota
        )
      )
    }
    setNotaEnEdicion(null)
  }

  function empezarEdicion(nota) {
    setNotaEnEdicion(nota)
    setVista('notas')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicion() {
    setNotaEnEdicion(null)
  }

  // Fijar / desfijar: invertimos el booleano de esa nota.
  function alternarFijada(id) {
    setNotas((previas) =>
      previas.map((nota) =>
        nota.id === id ? { ...nota, fijada: !nota.fijada } : nota
      )
    )
  }

  // Borrado suave: la nota sale de `notas` y entra en `papelera`
  // con su fecha de eliminación. No se pierde ningún dato.
  function moverAPapelera(id) {
    const nota = notas.find((n) => n.id === id)
    if (!nota) return
    const enPapelera = {
      ...nota,
      fijada: false,
      fechaEliminacion: new Date().toISOString(),
    }
    setNotas((previas) => previas.filter((n) => n.id !== id))
    setPapelera((previas) => [enPapelera, ...previas])
    if (notaEnEdicion?.id === id) setNotaEnEdicion(null)
  }

  // ---- Acciones sobre la papelera --------------------------

  function restaurarNota(id) {
    const nota = papelera.find((n) => n.id === id)
    if (!nota) return
    const restaurada = { ...nota, fechaEliminacion: null }
    setPapelera((previas) => previas.filter((n) => n.id !== id))
    setNotas((previas) => [restaurada, ...previas])
  }

  function eliminarDefinitivo(id) {
    setPapelera((previas) => previas.filter((n) => n.id !== id))
  }

  function vaciarPapelera() {
    setPapelera([])
  }

  // ---- Datos derivados (se calculan en cada render) --------

  // Todas las etiquetas distintas, ordenadas alfabéticamente.
  // useMemo evita recalcular si `notas` no cambió; en una app
  // pequeña no es imprescindible, pero es un buen hábito.
  const todasEtiquetas = useMemo(() => {
    const conjunto = new Set()
    notas.forEach((nota) => nota.etiquetas.forEach((e) => conjunto.add(e)))
    return [...conjunto].sort()
  }, [notas])

  // Lista visible: primero filtra, después ordena.
  const visibles = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase()

    const filtradas = notas.filter((nota) => {
      // Filtro 1: búsqueda por título o contenido (sin mayúsculas)
      const coincideBusqueda =
        consulta === '' ||
        nota.titulo.toLowerCase().includes(consulta) ||
        nota.contenido.toLowerCase().includes(consulta) ||
        nota.etiquetas.some((e) => e.includes(consulta))

      // Filtro 2: etiqueta seleccionada (si hay alguna)
      const coincideEtiqueta =
        etiquetaSeleccionada === null ||
        nota.etiquetas.includes(etiquetaSeleccionada)

      return coincideBusqueda && coincideEtiqueta
    })

    // Orden: las fijadas primero; dentro de cada grupo,
    // la editada más recientemente va antes.
    // [...filtradas] crea una copia porque sort() muta el arreglo.
    return [...filtradas].sort((a, b) => {
      if (a.fijada !== b.fijada) return a.fijada ? -1 : 1
      return new Date(b.fechaEdicion) - new Date(a.fechaEdicion)
    })
  }, [notas, busqueda, etiquetaSeleccionada])

  const hayFiltros = busqueda.trim() !== '' || etiquetaSeleccionada !== null

  return (
    <main className="app">
      <header className="app-cabecera">
        <h1>Mis notas</h1>
        <p className="app-subtitulo">
          {notas.length} {notas.length === 1 ? 'nota' : 'notas'}
          {papelera.length > 0 && ` · ${papelera.length} en la papelera`}
        </p>

        {/* Pestañas para cambiar entre Notas y Papelera */}
        <nav className="pestanas" aria-label="Vistas principales">
          <button
            type="button"
            className={`pestana ${vista === 'notas' ? 'pestana-activa' : ''}`}
            onClick={() => setVista('notas')}
          >
            📝 Notas ({notas.length})
          </button>
          <button
            type="button"
            className={`pestana ${vista === 'papelera' ? 'pestana-activa' : ''}`}
            onClick={() => setVista('papelera')}
          >
            🗑️ Papelera ({papelera.length})
          </button>
        </nav>
      </header>

      {vista === 'papelera' ? (
        <Papelera
          papelera={papelera}
          onRestaurar={restaurarNota}
          onEliminarDefinitivo={eliminarDefinitivo}
          onVaciar={vaciarPapelera}
        />
      ) : (
        <>
          <EditorNota
            notaEnEdicion={notaEnEdicion}
            onGuardar={guardarNota}
            onCancelar={cancelarEdicion}
          />

          <BarraFiltros
            busqueda={busqueda}
            onCambiarBusqueda={setBusqueda}
            etiquetas={todasEtiquetas}
            etiquetaSeleccionada={etiquetaSeleccionada}
            onSeleccionarEtiqueta={setEtiquetaSeleccionada}
          />

          <section className="notas">
            {visibles.map((nota) => (
              <TarjetaNota
                key={nota.id}
                nota={nota}
                onEditar={empezarEdicion}
                onMoverAPapelera={moverAPapelera}
                onAlternarFijada={alternarFijada}
                onFiltrarEtiqueta={setEtiquetaSeleccionada}
              />
            ))}
          </section>

          {visibles.length === 0 && (
            <p className="sin-notas">
              {notas.length === 0
                ? 'Todavía no tienes notas. Crea la primera con el formulario de arriba.'
                : hayFiltros
                  ? 'Ninguna nota coincide con la búsqueda o la etiqueta elegida.'
                  : 'No hay notas que mostrar.'}
            </p>
          )}
        </>
      )}
    </main>
  )
}
