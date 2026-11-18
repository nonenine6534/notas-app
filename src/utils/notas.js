// ============================================================
// Utilidades compartidas de la App de Notas
//
// Este archivo reúne la paleta de colores y funciones puras
// (sin estado de React) que usan varios componentes.
// Tenerlas aquí evita repetir código y facilita explicarlas
// en una entrevista: cada función hace UNA sola cosa.
// ============================================================

// Paleta pequeña de colores para las notas.
// Cada color tiene un id (lo que se guarda en la nota),
// un nombre visible y los tonos de fondo y borde.
export const COLORES = [
  { id: 'amarillo', nombre: 'Amarillo', fondo: '#fffbe6', borde: '#eadfae' },
  { id: 'verde', nombre: 'Verde', fondo: '#e6f4ea', borde: '#a8d5b5' },
  { id: 'azul', nombre: 'Azul', fondo: '#e8f0fe', borde: '#a9c7f5' },
  { id: 'rosa', nombre: 'Rosa', fondo: '#fce8e9', borde: '#f0b3b8' },
  { id: 'morado', nombre: 'Morado', fondo: '#f3e8fd', borde: '#cdb0f0' },
  { id: 'naranja', nombre: 'Naranja', fondo: '#fef0e0', borde: '#f5c48a' },
  { id: 'blanco', nombre: 'Blanco', fondo: '#ffffff', borde: '#dddddd' },
]

// Busca un color por su id. Si no existe, devuelve el primero
// (amarillo) para que la tarjeta nunca quede sin estilo.
export function buscarColor(idColor) {
  return COLORES.find((color) => color.id === idColor) || COLORES[0]
}

// Cuenta las palabras de un texto.
// Truco: trim() quita espacios de los extremos y split(/\s+/)
// separa por uno o más espacios, saltos de línea o tabulaciones.
export function contarPalabras(texto) {
  const limpio = (texto || '').trim()
  if (limpio === '') return 0
  return limpio.split(/\s+/).length
}

// Cuenta los caracteres tal como están escritos.
export function contarCaracteres(texto) {
  return (texto || '').length
}

// Convierte el texto del campo de etiquetas en un arreglo limpio.
// Ejemplo: " trabajo, Ideas , trabajo " -> ["trabajo", "ideas"]
// - Separa por comas
// - Pasa todo a minúsculas y quita espacios
// - Descarta vacíos y duplicados
export function textoAEtiquetas(texto) {
  if (!texto) return []
  const partes = texto
    .split(',')
    .map((parte) => parte.trim().toLowerCase())
    .filter((parte) => parte !== '')
  // Set elimina duplicados; el spread lo vuelve arreglo otra vez
  return [...new Set(partes)]
}

// Hace lo contrario: de arreglo a texto para el input del editor.
// Ejemplo: ["trabajo", "ideas"] -> "trabajo, ideas"
export function etiquetasATexto(etiquetas) {
  return (etiquetas || []).join(', ')
}

// Formatea una fecha ISO a texto legible en español.
// Ejemplo: "18 nov 2026, 14:32"
export function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Igual que la anterior, pero incluye la hora.
// Útil para la papelera: "Eliminada el 18 nov 2026, 14:32".
export function formatearFechaHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Crea el extracto que se ve en la tarjeta.
// Si el contenido es corto se devuelve completo; si es largo,
// se corta y se añaden puntos suspensivos.
export function crearExtracto(texto, maximo = 180) {
  const limpio = (texto || '').trim()
  if (limpio.length <= maximo) return limpio
  return limpio.slice(0, maximo).trimEnd() + '…'
}

// Adapta una nota guardada con el formato antiguo al formato nuevo.
// Las notas viejas solo tenían { id, titulo, contenido, fecha }.
// Esta función garantiza que TODAS las notas tengan siempre
// etiquetas, color, fijada y las dos fechas.
export function normalizarNota(nota) {
  return {
    id: nota.id,
    titulo: nota.titulo || 'Sin título',
    contenido: nota.contenido || '',
    etiquetas: Array.isArray(nota.etiquetas) ? nota.etiquetas : [],
    color: nota.color || 'amarillo',
    fijada: Boolean(nota.fijada),
    fechaCreacion: nota.fechaCreacion || nota.fecha || new Date().toISOString(),
    fechaEdicion: nota.fechaEdicion || nota.fecha || new Date().toISOString(),
    fechaEliminacion: nota.fechaEliminacion || null,
  }
}
