# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado actual del repositorio

Astro andamiado con estructura mínima. Archivos clave:

- `portal-performance.md` — la especificación completa del portal. Es la fuente de verdad para el objetivo, el stack, la arquitectura, el contenido de los 8 artículos, los criterios de rendimiento y las reglas de diseño. Léelo entero antes de tocar nada.
- `SETUP.md` — cómo está montado el andamiaje: decisiones cerradas, estructura de carpetas, tokens, escala tipográfica, pasos ejecutados.
- `01-render-lista/` … `08-scroll-infinito-observer/` — un directorio por ejercicio, con `problema.js` (código roto que se enseña) y `solucion.js` (o `solucion-1.js` / `solucion-2.js` cuando el brief pide varios niveles de solución). Estos ficheros son el material fuente literal de los artículos: **no reinventes el código roto ni la solución**, cópialos tal cual al artículo correspondiente. Los nombres de carpeta coinciden 1:1 con los `slug` del frontmatter.

Siguiente paso: content collection con los 8 artículos, ficha de un ejercicio completa, y componentes base según el "Orden de trabajo sugerido" del brief (sección 10).

## Comandos

- `pnpm dev` — arranca dev server en `localhost:4321`. Con `--background` corre en segundo plano; para gestionarlo: `pnpm astro dev status | logs | stop`.
- `pnpm build` — genera `dist/` estático.
- `pnpm preview` — sirve `dist/` en local.
- `pnpm check` — chequeo de tipos con `astro check`.
- `pnpm lint` — ESLint (flat config en `eslint.config.js`).
- `pnpm format` / `pnpm format:check` — Prettier con plugin Astro.

## Versiones instaladas

- Astro 7.1.4, `@astrojs/preact` 6.0.1, Preact 10.29.7, `@astrojs/mdx` 7.0.4.
- Sass 1.102 (para archivos independientes: `src/styles/*.scss` y CSS Modules `*.module.scss`).
- ESLint 10.8.0 (flat config; `--ext` ya no aplica), eslint-plugin-astro 3.0.1.
- Prettier 3.9.6, prettier-plugin-astro 0.14.1.
- Node ≥ 22.12 (probado en 24.0.2), pnpm 11.17.0.

Política pnpm: en `pnpm-workspace.yaml`. Los paquetes recientes se listan en `minimumReleaseAgeExclude` cuando el policy los bloquea; `allowBuilds.esbuild: true` para que Vite pueda usar sus binarios.

## Stack

Definido en el brief (sección 2). Resumen operativo:

- Astro como framework base, renderizado estático.
- **Preact** para las islas interactivas (el quiz de los 8 ejercicios). Vanilla JS para el resto de interactividad (barra de progreso, scroll infinito, buscador, delegación, `<details>`). **Vue queda fuera del stack**: desviación deliberada respecto al brief para reforzar la tesis de performance (Preact ~3KB gzip). Ver `SETUP.md` §2.
- Content collections con schema Zod para los artículos.
- Estilos: **SCSS** en archivos independientes (`src/styles/*.scss`), con anidación y `@use`. **CSS plano** en los `<style>` de componentes `.astro` (scoped por Astro). Islas `.tsx` (Quiz): estilos inline en el propio componente como `<style>{...}</style>`, namespaced bajo la clase raíz (`.quiz`) para evitar colisiones. Sin Tailwind ni librerías de UI. Tokens de color en `src/styles/_tokens.scss` — ningún hex suelto fuera de ahí.

Cuando el proyecto esté andamiado, los comandos habituales serán `npm run dev` / `npm run build` / `npm run preview` (Astro estándar). Si añades linter o tests, documéntalos aquí.

## Flujo de trabajo (innegociable)

- **Nunca commitear sin luz verde explícita del usuario.** Ni siquiera al terminar un hito, ni siquiera "para no perder el progreso". Deja el trabajo en el working tree (staged o no), muéstralo, y espera confirmación. Aplica también a `git add` en volumen si no está claro qué se va a incluir.
- **Nunca añadir el trailer `Co-Authored-By: Claude ...`** a los mensajes de commit. La disclosure de IA vive en el `README.md` (sección honesta pedida por el brief), no en cada mensaje del `git log`. GitHub interpreta ese trailer como coautoría y aparece un contribuidor extra en el sidebar del repo, que no es lo que se quiere.

## Reglas del proyecto (innegociables)

Vienen del brief. Si algo entra en conflicto con una de estas, prevalece la regla; pregunta antes de saltártela.

- **Nunca colores fuera de `src/styles/_tokens.scss`**. Ningún hex ni rgb suelto en componentes. Todo se resuelve por variable CSS.
- **Cambios mínimos**. No reescribas un archivo entero por un cambio de una línea. Edita lo necesario y nada más.
- **Cero JavaScript en páginas que no lo necesiten**. Las islas se hidratan con `client:visible` salvo justificación explícita.
- **Ningún listener de scroll sin throttle, rAF o IntersectionObserver**. El sitio predica lo que enseña.
- **Imágenes siempre con `<Image />` de `astro:assets`** (WebP, `srcset`, dimensiones). La imagen principal de cada ficha NO lleva lazy loading; el resto sí.
- **Sin dependencias innecesarias**. Cada entrada en `package.json` debe poder justificarse.
- **Objetivo medible**: Lighthouse móvil ≥ 95 en rendimiento y accesibilidad. Los criterios de rendimiento (sección 7 del brief) son el argumento entero del proyecto — antes se recorta contenido que se recortan.

## Convenciones

- **Nombres en español** para slugs, variables de dominio, IDs del DOM y clases CSS (`buscador`, `resultados`, `centinela`, `cargando`, `siguientePagina`). Coherente con el material fuente ya escrito en los directorios `0N-*`.
- **Slugs y carpetas en kebab-case**, coincidiendo con la carpeta de origen del ejercicio.
- **Comentarios en el código roto/solución**: los que ya vienen en los `solucion*.js` son parte de la enseñanza — cópialos tal cual, no los reescribas ni los adornes.

## Qué no tocar

- El código de `problema.js` y `solucion*.js` en los directorios `0N-*`: son texto literal para los artículos. Si detectas un bug real en una solución, coméntalo antes de cambiarlo — el brief pide fidelidad al material.
- La estructura de rutas y arquitectura definida en la sección 3 del brief. Cualquier desviación requiere justificación.
- Los tres "defaults reconocibles" de diseño listados al final de la sección 8: evítalos.
