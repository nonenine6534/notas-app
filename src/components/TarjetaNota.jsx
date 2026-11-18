// Componente TarjetaNota: dibuja la tarjeta de UNA nota.
//
// Recibe por "props":
//   - nota:     el objeto { id, titulo, contenido, fecha }
//   - onEditar: función que carga la nota en el formulario
//   - onBorrar: función que elimina la nota
export default function TarjetaNota({ nota, onEditar, onBorrar }) {
  // La fecha se guarda en formato ISO y aquí se pasa a un
  // formato legible, por ejemplo 18/11/2026.
  const fechaLegible = new Date(nota.fecha).toLocaleDateString('es-ES')

  return (
    <article className="nota">
      <h3>{nota.titulo}</h3>
      <p>{nota.contenido}</p>
      <span className="fecha">{fechaLegible}</span>
      <div className="acciones">
        <button type="button" onClick={() => onEditar(nota)}>
          Editar
        </button>
        <button
          type="button"
          className="btn-borrar-nota"
          onClick={() => onBorrar(nota.id)}
        >
          Borrar
        </button>
      </div>
    </article>
  )
}
