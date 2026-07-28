import { useState } from "preact/hooks";

interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
}

interface Props {
  preguntas: Pregunta[];
}

export default function Quiz({ preguntas }: Props) {
  const [respuestas, setRespuestas] = useState<(number | null)[]>(() => preguntas.map(() => null));
  const [enviado, setEnviado] = useState(false);

  const acertadas = respuestas.filter((r, i) => r !== null && r === preguntas[i].correcta).length;
  const completo = respuestas.every((r) => r !== null);

  function elegir(iPregunta: number, iOpcion: number) {
    if (enviado) return;
    setRespuestas((prev) => {
      const copia = prev.slice();
      copia[iPregunta] = iOpcion;
      return copia;
    });
  }

  function enviar() {
    if (completo) setEnviado(true);
  }

  function reintentar() {
    setRespuestas(preguntas.map(() => null));
    setEnviado(false);
  }

  return (
    <>
      <section class="quiz" aria-labelledby="quiz-titulo">
        <h2 id="quiz-titulo" class="titulo">
          Comprueba lo que has aprendido
        </h2>

        <ol class="lista">
          {preguntas.map((p, i) => (
            <li key={i} class="pregunta">
              <p class="enunciado">
                <span class="numero">{i + 1}.</span> {p.pregunta}
              </p>
              <ul class="opciones" role="radiogroup" aria-label={p.pregunta}>
                {p.opciones.map((op, j) => {
                  const elegida = respuestas[i] === j;
                  const correcta = enviado && j === p.correcta;
                  const fallo = enviado && elegida && j !== p.correcta;
                  const clase = [
                    "opcion",
                    elegida && "elegida",
                    correcta && "correcta",
                    fallo && "fallo",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <li key={j}>
                      <label class={clase}>
                        <input
                          type="radio"
                          name={`pregunta-${i}`}
                          checked={elegida}
                          disabled={enviado}
                          onChange={() => elegir(i, j)}
                        />
                        <span>{op}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>

        <footer class="pie">
          {!enviado && (
            <button type="button" class="boton" disabled={!completo} onClick={enviar}>
              {completo ? "Corregir" : `Faltan ${respuestas.filter((r) => r === null).length}`}
            </button>
          )}
          {enviado && (
            <div class="resultado">
              <p class="puntuacion">
                {acertadas} de {preguntas.length} correctas
              </p>
              <button type="button" class="boton" onClick={reintentar}>
                Reintentar
              </button>
            </div>
          )}
        </footer>
      </section>

      <style>{estilos}</style>
    </>
  );
}

/*
 * Estilos de la isla Preact. Un .tsx no admite <style> scoped como .astro,
 * así que se inyectan aquí como <style> global. Todos los selectores viven
 * bajo `.quiz` para evitar colisiones con clases genéricas del resto del sitio.
 */
const estilos = `
  .quiz {
    border-top: 4px solid var(--acento);
    padding-top: var(--esp-xl);
    margin-top: var(--esp-2xl);
  }

  .quiz .titulo {
    font-family: var(--fuente-display);
    font-size: var(--paso-3);
    line-height: var(--lh-medio);
    margin-bottom: var(--esp-lg);
  }

  .quiz .lista {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--esp-xl);
  }

  .quiz .pregunta {
    display: flex;
    flex-direction: column;
    gap: var(--esp-sm);
  }

  .quiz .enunciado {
    font-family: var(--fuente-texto);
    font-size: var(--paso-1);
    font-weight: 600;
    margin: 0;
    max-width: none;
  }

  .quiz .numero {
    font-family: var(--fuente-mono);
    color: var(--acento);
    margin-right: var(--esp-xs);
  }

  .quiz .opciones {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--esp-xs);
  }

  .quiz .opcion {
    display: flex;
    align-items: flex-start;
    gap: var(--esp-sm);
    padding: var(--esp-sm) var(--esp-md);
    border: 2px solid var(--texto);
    border-radius: var(--radio-md);
    cursor: pointer;
    background: var(--fondo);
    transition:
      background 120ms,
      border-color 120ms;
  }

  .quiz .opcion:hover:not(:has(input:disabled)) {
    border-color: var(--acento);
  }

  .quiz .opcion input {
    margin-top: 0.2em;
    accent-color: var(--acento);
  }

  .quiz .opcion.elegida {
    border-color: var(--acento);
    background: color-mix(in srgb, var(--acento) 10%, transparent);
  }

  .quiz .opcion.correcta {
    border-color: var(--exito);
    background: color-mix(in srgb, var(--exito) 12%, transparent);
  }

  .quiz .opcion.fallo {
    border-color: var(--error);
    background: color-mix(in srgb, var(--error) 12%, transparent);
  }

  .quiz .pie {
    margin-top: var(--esp-xl);
  }

  .quiz .boton {
    font-family: var(--fuente-display);
    font-weight: 700;
    font-size: var(--paso-1);
    padding: var(--esp-sm) var(--esp-lg);
    background: var(--acento);
    color: var(--papel);
    border: 2px solid var(--acento);
    border-radius: var(--radio-md);
    cursor: pointer;
    transition: transform 100ms;
  }

  .quiz .boton:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .quiz .boton:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .quiz .resultado {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--esp-md);
    flex-wrap: wrap;
  }

  .quiz .puntuacion {
    font-family: var(--fuente-display);
    font-size: var(--paso-2);
    font-weight: 700;
    margin: 0;
  }
`;
