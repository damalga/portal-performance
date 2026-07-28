# Brief: portal de ejercicios de rendimiento frontend

Documento de especificación para Claude Code. Contiene el objetivo, el stack, la
arquitectura, el contenido completo de los 8 artículos y los criterios de calidad.

---

## 1. Objetivo

Construir un portal de contenido técnico al estilo de un medio (Xataka, 3DJuegos)
donde cada artículo es un ejercicio real de rendimiento frontend: se explica un
problema, se muestra el código roto, se revela la solución en un desplegable y se
comprueba lo aprendido con un cuestionario.

El sitio es a la vez el contenido y la demostración: cada técnica que explica está
aplicada en su propio código. Un artículo sobre scroll infinito con
IntersectionObserver corre sobre un scroll infinito con IntersectionObserver.

Público: desarrolladores frontend. Tono: directo, sin humo, sin gamificación
infantil.

---

## 2. Stack

- **Astro** como framework base. Renderizado estático, cero JavaScript por defecto.
- **Preact** para una única isla (`npx astro add preact`), de forma deliberada:
  demuestra que Astro permite convivencia de frameworks y migración gradual.
  
- **Content collections** de Astro para los artículos, en Markdown con frontmatter
  tipado mediante schema de Zod.
  
- Sin librerías de UI, sin Tailwind. CSS propio con variables.

---

## 3. Arquitectura

```
src/
  content/
    ejercicios/          articulos en .md con frontmatter tipado
  components/
    ArticuloCard.astro   tarjeta de listado
    CodigoRoto.astro     bloque de codigo del enunciado
    Solucion.astro       desplegable con la solucion
    Quiz.vue             cuestionario (Vue)
    QuizPreact.tsx       cuestionario (Preact, solo articulo 1)
    HuecoPublicidad.astro
    Centinela.astro      centinela del scroll infinito
  layouts/
    Articulo.astro
    Base.astro
  pages/
    index.astro          home con listado + scroll infinito
    ejercicios/[slug].astro
  scripts/
    scroll-infinito.js
    progreso-lectura.js
  styles/
    tokens.css
```

### Rutas

- `/` home con el listado de ejercicios, scroll infinito y huecos publicitarios.
- `/ejercicios/[slug]` ficha de cada ejercicio.

---

## 4. Estructura de un artículo

Cada artículo sigue este orden fijo:

1. **Cabecera**: título, categoría, tiempo de lectura, barra de progreso.
2. **El problema**: qué falla y por qué, en prosa. Sin código todavía.
3. **El código roto**: bloque de código con el enunciado, resaltado.
4. **Las pistas**: lista corta de qué buscar, sin dar la respuesta.
5. **La solución**: dentro de un `<details>` nativo, cerrado por defecto. Contiene
   el código corregido y la explicación de por qué funciona.
6. **El cuestionario**: 5 preguntas de opción múltiple, 5 opciones cada una, una
   correcta. Corrección al pulsar un botón, con marcado en verde y rojo y opción
   de reintentar.

### Frontmatter (schema de la collection)

```ts
{
  titulo: string,
  slug: string,
  orden: number,
  categoria: 'dom' | 'eventos' | 'datos' | 'metricas',
  resumen: string,          // una linea para la tarjeta del listado
  conceptos: string[],      // etiquetas: 'reflow', 'debounce', etc.
  dificultad: 1 | 2 | 3,
  minutos: number
}
```

### Formato del cuestionario

Va en el propio Markdown, en el frontmatter o en un bloque de datos, con esta forma:

```ts
quiz: [
  {
    pregunta: string,
    opciones: string[],     // exactamente 5
    correcta: number        // indice 0-4
  }
]
```

Genera las 5 preguntas de cada artículo a partir de su propio contenido. Requisitos:
los distractores deben ser plausibles (errores reales que comete la gente), no
absurdos; al menos una pregunta debe ser sobre el porqué y no sobre la sintaxis; y
ninguna pregunta debe poder responderse solo por eliminación.

---

## 5. Los 8 artículos

El código roto y la solución son literales, no los reinventes. Las explicaciones en
prosa sí las escribes tú, siguiendo el tono descrito.

### 5.1 Insertar en el DOM dentro de un bucle

**Slug**: `render-lista`. **Categoría**: dom. **Conceptos**: reflow, batching.

Roto:

```javascript
const container = document.getElementById("list");

for (let i = 0; i < 500; i++) {
  const item = document.createElement("div");
  item.textContent = "Elemento " + i;
  container.appendChild(item);
}
```

Solución: construir los nodos en memoria e insertarlos una sola vez, con
`DocumentFragment` (patrón canónico) o con array más spread. Explicar qué es un
reflow, por qué es en cascada y por qué 500 inserciones son 500 recálculos.

### 5.2 Datos que llegan incompletos

**Slug**: `fetch-seguro`. **Categoría**: datos. **Conceptos**: optional chaining,
nullish coalescing, manejo de errores.

Roto:

```javascript
function mostrarUsuario(user) {
  const el = document.getElementById("username");
  el.textContent = user.profile.name;
}

fetch("/api/user")
  .then((res) => res.json())
  .then((user) => mostrarUsuario(user));
```

Solución: `user?.profile?.name ?? "Anónimo"` más comprobación de `res.ok` y
`.catch`. Explicar la diferencia entre `??` y `||` con el caso del precio 0, y el
criterio de fondo: proteger la interfaz sí, pero si el campo era obligatorio según
el contrato de datos, el bug es del backend y hay que reportarlo, no taparlo.

### 5.3 Filtrar en cada tecla

**Slug**: `buscador-debounce`. **Categoría**: eventos. **Conceptos**: debounce,
innerHTML.

Roto:

```javascript
input.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  lista.innerHTML = "";

  productos
    .filter((p) => p.toLowerCase().includes(query))
    .forEach((p) => {
      lista.innerHTML += "<div>" + p + "</div>";
    });
});
```

Solución: `map().join("")` con una sola asignación, más debounce con `let timeout`
fuera del listener y `clearTimeout` dentro. Dos problemas distintos en el mismo
código, explícalos por separado.

### 5.4 Trabajo repetido dentro del bucle

**Slug**: `tabla-contador`. **Categoría**: dom. **Conceptos**: debounce, batching.

Roto: misma base que el anterior pero pintando filas de tabla, con
`contador.textContent` actualizándose dentro del bucle en cada coincidencia.

Solución: contador fuera del bucle usando `filtrados.length`. El total se conoce de
golpe una vez filtrado, no hace falta ir contando.

### 5.5 Scroll que dispara cientos de veces

**Slug**: `scroll-throttle`. **Categoría**: eventos. **Conceptos**: throttle,
requestAnimationFrame.

Roto:

```javascript
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const porcentaje = (window.scrollY / total) * 100;
  barra.style.width = porcentaje + "%";
});
```

Solución en dos niveles: throttle con bandera y `setTimeout`, y la versión fina con
`requestAnimationFrame`. Explicar por qué aquí no vale debounce (la barra tiene que
moverse durante el scroll, no al parar), la diferencia entre ambos patrones y por
qué rAF gana para trabajo visual: una ejecución por frame, ni una de más, y no
pierde el estado final.

Este script es el que gobierna la barra de progreso real del sitio.

### 5.6 Un listener por elemento

**Slug**: `delegacion-eventos`. **Categoría**: eventos. **Conceptos**: delegación,
burbujeo, closest.

Roto:

```javascript
const botones = document.querySelectorAll(".add-to-cart");

botones.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    console.log("Añadido al carrito:", id);
  });
});
```

Solución: un listener en el contenedor padre más `e.target.closest(".add-to-cart")`
con guard clause. Explicar el burbujeo, por qué `closest` sube en lugar de bajar, y
por qué hace falta cuando el botón tiene un icono dentro.

### 5.7 Leer y escribir alternado

**Slug**: `leer-mas-scrollheight`. **Categoría**: dom. **Conceptos**: layout
thrashing, reflow forzado síncrono.

Roto:

```javascript
const resumenes = document.querySelectorAll(".resumen");

resumenes.forEach((resumen) => {
  if (resumen.scrollHeight > resumen.clientHeight) {
    const boton = document.createElement("button");
    boton.textContent = "Leer más";
    boton.className = "leer-mas";
    resumen.parentElement.appendChild(boton);
  }
});
```

Solución: dos fases, primero todas las lecturas guardando en un array, después
todas las escrituras. Explicar qué propiedades fuerzan reflow síncrono
(`offsetWidth`, `scrollHeight`, `getBoundingClientRect`) y por qué separar fases
rompe el ciclo.

### 5.8 Scroll infinito

**Slug**: `scroll-infinito-observer`. **Categoría**: eventos. **Conceptos**:
IntersectionObserver, rootMargin, condición de carrera, insertAdjacentHTML.

Roto:

```javascript
window.addEventListener("scroll", () => {
  const rect = centinela.getBoundingClientRect();

  if (rect.top < window.innerHeight) {
    fetch("/api/articulos?pagina=" + siguientePagina)
      .then((res) => res.json())
      .then((articulos) => {
        lista.innerHTML += articulos
          .map((a) => `<article>${a.titulo}</article>`)
          .join("");
        siguientePagina++;
      });
  }
});
```

Solución con los tres problemas resueltos: IntersectionObserver con centinela y
`rootMargin`, bandera `cargando` bajada en `.finally()`, e `insertAdjacentHTML` con
`beforeend`. Explicar por qué la bandera hace falta aunque el observer reduzca los
disparos, y por qué `.finally()` y no `.then()`.

Este es el script que gobierna el scroll infinito real de la home.

---

## 6. Huecos publicitarios

Cuatro banners propios, rotando: **Hackeed**, **Polymorphism Records**,
**Alcarcia**, **damalga.com**. Creativos estáticos, sin scripts de terceros.

Requisitos técnicos, que son parte de la demostración:

- Cada hueco reserva su espacio con `min-height` antes de que el creativo cargue.
  Cero layout shift.
- Los creativos se cargan con `IntersectionObserver` y `rootMargin` generoso, no
  todos al inicio. Justificación doble: rendimiento y viewability.
- En la home, un hueco cada 4 artículos del listado. En la ficha, uno tras la
  introducción y otro antes del cuestionario.
- Los banners llevan `width` y `height` explícitos y formato WebP vía el componente
  `<Image />` de Astro.

Añade un comentario en el código del componente explicando la reserva de espacio y
su relación con CLS, porque ese componente se va a leer.

---

## 7. Rendimiento: criterios innegociables

El sitio predica y aplica. Lista de comprobación:

- Cero JavaScript en las páginas que no lo necesitan. Las islas se hidratan con
  `client:visible` salvo justificación explícita.
- Imágenes siempre con `<Image />` de astro:assets: WebP, `srcset`, dimensiones.
- La imagen principal de cada ficha NO lleva lazy loading. El resto sí.
- Fuentes con `font-display: swap` y precarga de la principal.
- Ningún listener de scroll sin throttle, rAF o IntersectionObserver.
- Objetivo medible: Lighthouse en móvil con 95 o más en rendimiento y accesibilidad.
  Deja constancia del resultado en el README.

---

## 8. Diseño

No es un blog de plantilla. Decisiones a tomar de forma deliberada, no por defecto:

- Paleta de 4 a 6 valores nombrados, definidos como variables CSS en `tokens.css`.
  Todo color del sitio sale de ahí, ningún hex suelto en componentes. Esto es
  también la demostración del sistema de temas: los componentes se escriben una vez
  y el tema los viste.
- Dos familias tipográficas con roles claros (una de display con carácter, una de
  texto), más monoespaciada para el código. Escala de tamaños explícita.
- El bloque de código es el elemento protagonista de la página, no un adorno
  arrinconado. Trátalo como tal.
- Modo claro y oscuro, ambos funcionando.
- Accesibilidad de base: foco visible por teclado, contraste suficiente,
  `prefers-reduced-motion` respetado, el `<details>` de la solución navegable con
  teclado.

Evita los tres defaults reconocibles de diseño generado: fondo crema con serif de
alto contraste y acento terracota; fondo casi negro con un acento verde ácido; y la
maqueta tipo periódico con filetes finos y cero radio. Si acabas en uno de ellos,
que sea por una decisión justificada.

---

## 9. Repositorio y proceso

El repositorio se va a leer como muestra de trabajo, así que:

- **CLAUDE.md** en la raíz, con: stack y versiones, convenciones de nombres y
  estructura, cómo se ejecutan build y linter, qué no tocar, y las reglas del
  proyecto (nunca colores fuera de tokens.css, cambios mínimos, no reescribir
  archivos enteros por un cambio de una línea).
- **README.md** corto: qué es el proyecto, cómo arrancarlo, qué demuestra, y una
  sección honesta sobre el uso de IA (qué se delegó, qué se revisó a mano, qué hubo
  que corregir).
- Commits pequeños y con mensaje descriptivo. El historial cuenta una historia.
- Sin dependencias innecesarias. Cada una en `package.json` debe poder justificarse.

---

## 10. Orden de trabajo sugerido

1. Andamiaje de Astro con las integraciones de Vue y Preact.
2. `tokens.css` y el layout base con la decisión tipográfica y de color.
3. Content collection con su schema y los 8 artículos en Markdown.
4. Ficha de artículo completa con un solo ejercicio, extremo a extremo.
5. Componente de cuestionario en Vue, y su gemelo en Preact para el artículo 1.
6. Home con listado, scroll infinito real y barra de progreso.
7. Huecos publicitarios con reserva de espacio y carga diferida.
8. CLAUDE.md, README, auditoría de Lighthouse y ajustes finales.

Si el tiempo aprieta, el corte es por artículos (publicar 4 completos antes que 8 a
medias), nunca por los criterios de rendimiento del punto 7: son el argumento
entero del proyecto.
