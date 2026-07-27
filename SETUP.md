# SETUP.md — plan de arranque

Este documento describe cómo se andamia el proyecto y qué decisiones ya están cerradas. Contrasta con `portal-performance.md` para el "qué" y el "por qué"; este documento es el "cómo" operativo.

Antes de ejecutar el andamiaje, léelo entero y veta cualquier default que no te encaje. Todo lo marcado con **[propuesta]** está abierto a redirección.

---

## 1. Prerrequisitos (ya verificados)

- Node 24.0.2
- pnpm 11.17.0 (vía corepack)
- git 2.55.0

---

## 2. Decisiones cerradas

| Área | Decisión |
|---|---|
| Framework | Astro (última estable) + integración Preact (única isla). Vanilla JS para el resto de interactividad. |
| Package manager | pnpm |
| Linter | ESLint con config oficial de Astro (`eslint-plugin-astro`) |
| Formatter | Prettier + `prettier-plugin-astro` |
| CSS | Plano, sin SCSS. `<style>` scoped de Astro en cada componente. Globales en `src/styles/`. |
| Módulos JS | ES modules. Sin transpilación adicional. |
| Deploy | Netlify, sitio estático puro, sin adapter |
| "API" de scroll infinito | JSON estáticos en `public/api/articulos-<n>.json` |
| Fuentes | Bricolage Grotesque (display) · Inter (texto) · JetBrains Mono (código), todas variables, self-hosted |
| Git | `git init` en la raíz. Primer commit tras el scaffold. |
| Nombre del paquete | `portal-performance` |

---

## 3. Rutas del sitio

Ampliación sobre la sección 3 del brief:

| Ruta | Propósito |
|---|---|
| `/` | Home: listado de ejercicios con scroll infinito real, huecos publicitarios cada 4. |
| `/ejercicios/[slug]` | Ficha de cada uno de los 8 ejercicios (estructura fija: problema → código roto → pistas → solución → quiz). |
| `/en-accion` | **[nuevo]** Página con mucho texto real donde los 8 patrones corren juntos, anotados con badge que enlaza al artículo. Es la máxima expresión del "el sitio predica lo que aplica". |
| `/damalga` | **[nuevo]** About + entrevista formato Webedia sobre cómo se concibe un producto frontend en 2026, con web performance como bandera. |

### Enlaces cruzados

- Cada `/ejercicios/[slug]` incluye, tras el quiz, un CTA "ver este patrón integrado con los otros 7 →" que enlaza a `/en-accion#<slug>`.
- Cada sección de `/en-accion` tiene `id="<slug>"` y un enlace "explicación completa →" que devuelve a `/ejercicios/<slug>`.
- Header con nav mínimo: **Ejercicios** (`/`), **En acción** (`/en-accion`), **damalga** (`/damalga`).

---

## 4. Estructura de carpetas final

```
src/
  content/
    ejercicios/          # 8 .md, uno por ejercicio, con frontmatter Zod
    config.ts            # schema de la collection
  components/
    ArticuloCard.astro
    CodigoRoto.astro
    Solucion.astro
    Quiz.tsx             # Preact, único isla interactivo (los 8 ejercicios)
    HuecoPublicidad.astro
    Centinela.astro
    PlaceholderPortada.astro  # [nuevo] portada tipográfica sin archivo
    EnAccionCta.astro    # [nuevo] CTA al final del articulo hacia /en-accion
    Nav.astro
  layouts/
    Base.astro           # html, head, fuentes, tokens, nav, footer
    Articulo.astro       # extiende Base, añade barra de progreso, portada
  pages/
    index.astro
    ejercicios/[slug].astro
    en-accion.astro      # [nuevo]
    damalga.astro        # [nuevo]
  scripts/
    scroll-infinito.js
    progreso-lectura.js
  styles/
    _tokens.scss         # colores, tipografía, espaciado, radios (partial)
    _reset.scss          # reset moderno Andy Bell-style (partial)
    _tipografia.scss     # @font-face, estilos base de texto (partial)
    global.scss          # @use de los tres partials, se carga en Base.astro
public/
  api/
    articulos-1.json
    articulos-2.json
    articulos-3.json
  fonts/                 # .woff2 self-hosted
  banners/               # .webp, pendientes de tu subida
```

Ningún hex ni `rgb()` suelto en componentes. Todo desde `_tokens.scss`.

---

## 5. Sistema de estilos

- **Globales** (`src/styles/`) en **SCSS**: `_tokens.scss`, `_reset.scss`, `_tipografia.scss` como partials, agregados desde `global.scss` con `@use`. Se importa una sola vez en `Base.astro`. Sass permite anidación con `&` y organización con `@use`/`@forward`.
- **Componentes .astro**: `<style>` sin `lang` en cada componente. Astro los scopea por atributo automáticamente. **CSS plano** aquí, no SCSS (regla del proyecto: SCSS solo en archivos independientes). CSS moderno ya trae nesting nativo si se necesita.
- **Isla Preact**: CSS Modules en `Quiz.module.scss`. Vite lo compila sin config extra al haber `sass` instalado.
- **Cuándo añadir SCSS a un nuevo archivo global**: cualquier nuevo `src/styles/*.scss` va en SCSS por defecto. Si se acaba necesitando otro CSS Module en un componente, también en `.module.scss`.

---

## 6. Tokens de color

```css
:root {
  --amarillo: #ffff00;
  --azul: #0000ff;
  --tinta: #0a0a0a;      /* casi negro */
  --papel: #f5f5f5;      /* casi blanco */
  --publi: rgba(255, 255, 255, 0.04);
}
```

Roles semánticos derivados (no color nuevo, solo alias):

```css
--fondo: var(--papel);
--texto: var(--tinta);
--acento: var(--azul);
--destacado: var(--amarillo);
--hueco-publi: var(--publi);
```

En modo oscuro (`@media (prefers-color-scheme: dark)`):

```css
--fondo: var(--tinta);
--texto: var(--papel);
/* --acento y --destacado no cambian: puros a saturación máxima en ambos temas */
```

---

## 7. Escala tipográfica experimental

Ratio **major third (1.25)**. Base 16px. Fluida con `clamp()` entre móvil y desktop.

```css
:root {
  --paso-000: clamp(0.7rem,  0.68rem + 0.1vw, 0.75rem);   /* meta, footnote */
  --paso-00:  clamp(0.82rem, 0.8rem  + 0.15vw, 0.875rem); /* small */
  --paso-0:   1rem;                                        /* cuerpo base */
  --paso-1:   clamp(1.15rem, 1.1rem  + 0.3vw,  1.25rem);   /* lead */
  --paso-2:   clamp(1.4rem,  1.3rem  + 0.5vw,  1.563rem);  /* h4 / subhead */
  --paso-3:   clamp(1.7rem,  1.55rem + 0.8vw,  1.953rem);  /* h3 */
  --paso-4:   clamp(2.05rem, 1.85rem + 1.1vw,  2.441rem);  /* h2 */
  --paso-5:   clamp(2.5rem,  2.2rem  + 1.7vw,  3.052rem);  /* h1 */
  --paso-6:   clamp(3.2rem,  2.6rem  + 3.2vw,  4.768rem);  /* hero display */
}
```

Interlineados (decrecientes al subir el tamaño, principio tipográfico clásico):

```css
:root {
  --lh-tight:  1.05;   /* --paso-6, hero */
  --lh-corto:  1.15;   /* --paso-4 y --paso-5 */
  --lh-medio:  1.35;   /* --paso-2 y --paso-3 */
  --lh-largo:  1.6;    /* --paso-0 y --paso-1, lectura larga */
  --lh-suelto: 1.8;    /* --paso-00 y --paso-000, aire para meta */
}
```

Escala de espaciado (t-shirt, ratio ~fibonacci):

```css
:root {
  --esp-2xs: 0.25rem;   /* 4  */
  --esp-xs:  0.5rem;    /*  8 */
  --esp-sm:  0.75rem;   /* 12 */
  --esp-md:  1rem;      /* 16 */
  --esp-lg:  1.5rem;    /* 24 */
  --esp-xl:  2.5rem;    /* 40 */
  --esp-2xl: 4rem;      /* 64 */
  --esp-3xl: 6.5rem;    /*104 */
}
```

Ancho máximo de columna de lectura: `65ch` para prosa, `78ch` para bloques de código.

---

## 8. Fuentes

Self-hosted en `public/fonts/`. Solo se descargan los pesos que se usan.

- **Bricolage Grotesque Variable** (display, h1–h4, badges, nav): pesos 400–800.
- **Inter Variable** (cuerpo, párrafo, UI): pesos 400 y 600.
- **JetBrains Mono Variable** (código, kbd, etiquetas técnicas): pesos 400 y 700.

Reglas:
- `font-display: swap` en todas.
- Precarga (`<link rel="preload">`) solo de Inter 400 y JetBrains Mono 400 (las que aparecen en el above-the-fold de la home y de las fichas).
- Bricolage se carga sin precarga; entra el momento que hace falta para los titulares.

---

## 9. `PlaceholderPortada.astro`

Portada tipográfica sin archivo. Contrato:

```astro
<PlaceholderPortada titulo="Insertar en el DOM dentro de un bucle" categoria="dom" />
```

- Bloque con `aspect-ratio: 16/9`, `background: var(--tinta)`, texto centrado en Bricolage a `--paso-5` sobre `var(--papel)`.
- Un acento diagonal (banda) en `var(--amarillo)` o `var(--azul)` según hash del slug — así ninguna portada se repite, sin lógica de negocio.
- Dimensiones explícitas para cero CLS.
- Usado en: home (tarjeta de listado), cabecera de cada ficha, cabecera de `/en-accion`, cabecera de `/damalga`.

**Sustituible** por `<Image />` real cuando existan portadas de verdad.

---

## 10. `/en-accion` — cómo se estructura

Un artículo largo, tono editorial, donde cada sección aplica uno de los 8 patrones **de verdad** sobre contenido real. Cada sección lleva:

- `id="<slug>"` (para anclas desde los artículos)
- Un badge pequeño arriba: `patrón 3 · debounce`
- Enlace "explicación completa →" a `/ejercicios/<slug>` al final de la sección

Contenido: prosa larga y densa sobre rendimiento frontend en producción — sirve doble función (contenido interesante + campo de pruebas para los patrones). El texto lo redacto yo en borrador; tú lo repasas.

Escenarios concretos por patrón, no forzados:

1. `render-lista` → renderizar 500 tarjetas de referencia técnica (glosario de conceptos).
2. `fetch-seguro` → tirar de `/api/articulos-1.json` y mostrar autores con `?.` sobre datos deliberadamente irregulares.
3. `buscador-debounce` → filtrar el glosario del punto 1 con input.
4. `tabla-contador` → contador de resultados del filtro anterior, calculado con `.length`.
5. `scroll-throttle` → barra de progreso de lectura del propio artículo, con `rAF`.
6. `delegacion-eventos` → botones "marcar como leído" en cada sección, un solo listener.
7. `leer-mas-scrollheight` → resúmenes plegables por sección, con lectura+escritura separadas.
8. `scroll-infinito-observer` → al final, cargar más secciones de contenido bajo demanda.

---

## 11. `/damalga` — about + entrevista

Estructura:

- **About** (párrafo corto, primera persona).
- **Entrevista Webedia** con 4–5 preguntas. Preguntas propuestas:
  1. En 2026 se habla mucho de IA en el desarrollo. Tú lo primero que citas cuando te preguntan por prioridades sigue siendo *web performance*. ¿Por qué?
  2. ¿Qué haces distinto ahora al concebir un producto frontend nuevo respecto a hace tres años?
  3. Más allá de Lighthouse, ¿cómo evalúas si una web va rápida de verdad?
  4. ¿Qué prácticas has descartado y por qué?
  5. Consejo a alguien que empieza ahora en frontend.

Redacción: borrador mío en el tono del brief (directo, sin humo). Tú revisas y ajustas voz.

---

## 12. Pasos de scaffold (comandos exactos)

Se ejecutan **desde la raíz** `/home/damalga/Development/webedia/`. No borran nada existente.

```bash
# 1. Andamiar Astro en un subdirectorio temporal y mover a la raíz.
#    (Astro no acepta scaffold en directorio con archivos, así que hacemos el rodeo.)
pnpm create astro@latest .astro-tmp --template minimal --no-install --no-git --typescript strict --skip-houston

# 2. Mover el andamiaje a la raíz respetando los ficheros existentes.
rsync -a .astro-tmp/ ./ && rm -rf .astro-tmp

# 3. Integración oficial (solo Preact; vanilla JS para el resto).
pnpm astro add preact --yes

# 4. Toolchain de calidad.
pnpm add -D eslint eslint-plugin-astro @typescript-eslint/parser \
           prettier prettier-plugin-astro

# 5. Git.
git init -b main
```

Tras esto: crear `eslint.config.js` (flat config, ESLint 10), `.prettierrc`, `.prettierignore`, `.gitignore` (Astro suele generarlo, verificar), configurar `astro.config.mjs` con la integración de Preact y `site: "https://…"` (dominio pendiente), y crear los archivos de `src/styles/`.

Antes del primer `git commit`, checklist en la sección 14.

---

## 13. Scripts de `package.json`

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint . --ext .js,.ts,.astro,.tsx",
    "format": "prettier --write . --plugin=prettier-plugin-astro",
    "format:check": "prettier --check . --plugin=prettier-plugin-astro"
  }
}
```

Sin `test`, sin `prepare`, sin husky. Si aparece necesidad real, se añade y se justifica.

---

## 14. Checklist post-scaffold, antes del primer commit

- [ ] `pnpm dev` arranca sin warnings.
- [ ] `pnpm build` produce `dist/` sin errores.
- [ ] `pnpm lint` pasa (aunque el proyecto esté vacío, la config debe validar).
- [ ] `pnpm format:check` pasa.
- [ ] `_tokens.scss`, `_reset.scss`, `_tipografia.scss`, `global.scss` existen y `Base.astro` los importa (vía `global.scss` con `@use`).
- [ ] `Base.astro` renderiza una página en blanco válida (html, head con fuentes precargadas, main vacío).
- [ ] `.gitignore` excluye `dist/`, `node_modules/`, `.astro/`, `.env*`.
- [ ] `package.json` tiene los scripts de la sección 13.
- [ ] `astro.config.mjs` lista la integración de Preact.
- [ ] Actualizar `CLAUDE.md` con los comandos reales (`pnpm dev`, etc.) y confirmar versiones exactas instaladas.

---

## 15. Netlify

Sin adapter. Deploy = subir `dist/` como sitio estático.

Cuando esté listo, se crea `netlify.toml` en la raíz con:

```toml
[build]
  command = "pnpm build"
  publish = "dist"
```

No lo creamos hasta que haya algo que desplegar.

---

## 16. Commits: estrategia

El brief pide "commits pequeños y con mensaje descriptivo, el historial cuenta una historia". Guía:

- Un commit por hito del "Orden de trabajo sugerido" del brief (sección 10), no por archivo tocado.
- Mensajes en español, imperativo, minúsculas: `andamia astro con vue y preact`, `define tokens de color y escala tipográfica`, `implementa scroll infinito en la home`.
- Nunca `--no-verify`, nunca `--amend` sobre commits ya empujados.

---

## 17. Pendiente de tu parte

- Banners WebP de los 4 sponsors (Hackeed, Polymorphism Records, Alcarcia, damalga.com). Mientras no lleguen, `HuecoPublicidad.astro` renderiza el hueco con dimensiones reservadas y texto placeholder (no rompe el layout).
- Revisión y ajuste de voz en el borrador de la entrevista de `/damalga`.
- Dominio final (para `site:` en `astro.config.mjs` y `sitemap`).
- Aprobación (o veto) de cualquier default marcado **[propuesta]** en este documento.

---

Cuando digas **luz verde**, ejecuto la sección 12 y avanzo hasta pasar la checklist de la sección 14. Cualquier veto que quieras aplicar antes, dímelo con el número de sección.
