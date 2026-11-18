# App de Notas — React

Aplicación de notas construida con **React y Vite**. Las notas se
guardan en el navegador con **localStorage** y se pueden buscar
en tiempo real por título o contenido.

## Características

- **Crear** notas con título y contenido (con fecha automática).
- **Editar** cualquier nota: el mismo formulario pasa a modo edición.
- **Borrar** notas individualmente.
- **Buscador en vivo**: filtra las notas a cada tecla pulsada,
  sin distinguir mayúsculas de minúsculas.
- **Persistencia** automática en `localStorage` tras cada cambio.

## Cómo ejecutarla

Requisitos: tener instalado **Node.js 18 o superior**.

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # arranca el servidor de desarrollo
```

Después abre en el navegador la dirección que muestra Vite
(normalmente http://localhost:5173).

Para generar la versión de producción:

```bash
npm run build   # crea la carpeta dist/ lista para publicar
```

## Estructura del proyecto

```
notas-app/
├── index.html            # HTML base: aquí se monta la app (div#root)
├── package.json          # dependencias y scripts de npm
├── vite.config.js        # configuración de Vite + plugin de React
└── src/
    ├── main.jsx          # punto de entrada: monta <App />
    ├── App.jsx           # estado de las notas, formulario y buscador
    ├── App.css           # estilos de los componentes
    ├── index.css         # estilos globales
    └── components/
        └── TarjetaNota.jsx   # tarjeta de una nota (recibe props)
```

## Tecnologías y conceptos de React usados

- **React 18** con componentes funcionales y JSX.
- **Vite 5** como herramienta de desarrollo y empaquetado.
- **useState**: lista de notas, campos del formulario, texto de
  búsqueda y el id de la nota en edición (`null` = creando).
- **useEffect**: guarda las notas en `localStorage` cada vez que cambian.
- Formularios **controlados** y renderizado condicional (el botón
  «Cancelar edición» solo aparece en modo edición).
- Actualización **inmutable** del estado con arreglos nuevos,
  `.map()` y `.filter()`.
