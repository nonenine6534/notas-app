# Notas App — React

Aplicación web de notas personales construida con **React y Vite**. Permite crear, organizar y recuperar notas desde el navegador, sin necesidad de un servidor: todo se guarda en `localStorage`. Está pensada como proyecto de portafolio para practicar el manejo de estado, componentes reutilizables y persistencia en el cliente.

![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-f7df1e)

## Descripción

Notas App funciona como un cuaderno digital: escribes una nota, le pones etiquetas y un color, la fijas si es importante y la encuentras al instante con el buscador o el filtro por etiquetas. Si borras algo por error, no se pierde: va a la papelera y puedes restaurarlo. Al recargar la página, tus notas siguen ahí.

## Características

- **Crear y editar notas** con título y contenido, usando el mismo formulario en modo creación y modo edición.
- **Etiquetas por nota** — se escriben separadas por comas (`trabajo, ideas`), se ven como chips en el editor y en la tarjeta, y se pueden pulsar para filtrar.
- **Filtro por etiqueta** — fila de chips con todas las etiquetas existentes; pulsar la activa de nuevo (o «Todas») quita el filtro.
- **Notas fijadas (pin)** — las notas fijadas aparecen siempre primero, con distintivo visual y botón 📌 para fijar/desfijar desde la tarjeta o desde el editor.
- **Color por nota** — selector con una paleta de 7 colores (amarillo, verde, azul, rosa, morado, naranja y blanco) que tiñe el fondo y el borde de la tarjeta.
- **Papelera con borrado suave (soft delete)** — borrar mueve la nota a la papelera; desde ahí se puede **restaurar**, **eliminar definitivamente** (con confirmación) o **vaciar toda la papelera**.
- **Contador de palabras y caracteres** — en vivo en el editor mientras escribes y resumido en cada tarjeta.
- **Vista previa en la tarjeta** — extracto truncado del contenido (con corte por JS y `line-clamp` en CSS) para mantener la rejilla ordenada.
- **Fechas visibles** — fecha de creación y, si aplica, fecha de edición en cada tarjeta; fecha y hora de eliminación en la papelera.
- **Buscador en tiempo real** — filtra por título, contenido y etiquetas, sin distinguir mayúsculas de minúsculas.
- **Orden inteligente** — fijadas primero y, dentro de cada grupo, la editada más recientemente va antes.
- **Persistencia en `localStorage`** — notas y papelera se guardan por separado y sobreviven a recargas; las notas del formato antiguo se migran automáticamente al nuevo modelo.
- **Diseño responsive** — rejilla que se adapta de varias columnas a una sola en pantallas pequeñas.

## Tecnologías

- **React 18** — componentes funcionales, `useState`, `useEffect` y `useMemo`.
- **Vite 5** — servidor de desarrollo y empaquetado para producción.
- **JavaScript (ES Modules)** — sin TypeScript, para mantener el código accesible a nivel estudiante.
- **CSS puro** — sin librerías de estilos; rejilla con CSS Grid y chips con Flexbox.
- **localStorage** — persistencia en el navegador, sin backend.

## Cómo ejecutarlo

Requisitos: **Node.js 18 o superior** y npm.

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Arrancar en modo desarrollo
npm run dev
```

Abre la dirección que muestra Vite, normalmente [http://localhost:5173](http://localhost:5173).

Para generar la versión de producción:

```bash
npm run build    # crea la carpeta dist/ lista para publicar
npm run preview  # previsualiza esa versión de producción
```

## Estructura de carpetas

```
notas-app/
├── index.html                  # HTML base donde se monta la app (div#root)
├── package.json                # Dependencias y scripts de npm
├── vite.config.js              # Configuración de Vite + plugin de React
└── src/
    ├── main.jsx                # Punto de entrada: monta <App />
    ├── App.jsx                 # Estado global, persistencia y acciones
    ├── App.css                 # Estilos de todos los componentes
    ├── index.css               # Estilos globales y reset básico
    ├── components/
    │   ├── EditorNota.jsx      # Formulario crear/editar + contador + colores
    │   ├── TarjetaNota.jsx     # Tarjeta de una nota (extracto, chips, pin)
    │   ├── BarraFiltros.jsx    # Buscador y filtro por etiquetas
    │   └── Papelera.jsx        # Vista de papelera: restaurar / eliminar
    └── utils/
        └── notas.js            # Paleta, conteo, fechas, etiquetas y migración
```

### Modelo de datos de una nota

```js
{
  id: 1730000000000,              // Date.now() al crearla
  titulo: "Ideas para el proyecto",
  contenido: "Revisar la API...",
  etiquetas: ["trabajo", "ideas"], // arreglo de strings en minúsculas
  color: "azul",                   // id de la paleta en utils/notas.js
  fijada: true,
  fechaCreacion: "2026-11-18T...", // ISO
  fechaEdicion: "2026-11-18T...",  // ISO, se actualiza al editar
  fechaEliminacion: null           // ISO solo mientras está en la papelera
}
```

Las claves de `localStorage` son `notas-app` (notas activas) y `notas-app-papelera` (papelera).

## Qué practica este proyecto

- **Estado en React con `useState`** — listas, vista actual, filtros y nota en edición, con inicialización perezosa desde `localStorage`.
- **Efectos con `useEffect`** — sincronizar el estado con `localStorage` y cargar una nota en el formulario al entrar en modo edición.
- **Datos derivados con `useMemo`** — etiquetas únicas, lista filtrada y ordenada (fijadas primero) sin duplicar estado.
- **Actualización inmutable** — `map`, `filter`, spread y copias antes de `sort()`, nunca mutando el estado directamente.
- **Componentes y props** — separación en editor, tarjeta, filtros y papelera; comunicación hijo → padre con callbacks («levantar el estado»).
- **Formularios controlados** — cada input refleja el estado y el contador se calcula en cada render.
- **Patrón soft delete** — el mismo que usan Gmail o Google Drive: borrar, restaurar y eliminar definitivamente son operaciones distintas.
- **Funciones puras reutilizables** — conteo de palabras, formato de fechas, parseo de etiquetas y normalización/migración de datos en un módulo `utils` testeable por separado.
- **UX cuidada** — confirmaciones antes de acciones irreversibles, mensajes de estado vacío distintos según haya notas o solo falle el filtro, y controles accesibles con `aria-label`.

## Autor

Proyecto de práctica de **Carlos Destrades**, estudiante de Ingeniería en Ciencias Informáticas. Construido paso a paso para poder explicar cada decisión en una entrevista técnica: por qué el estado vive en `App`, por qué las etiquetas se guardan como arreglo aunque se escriban como texto, y por qué borrar no significa eliminar.
