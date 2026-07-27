import { useState } from "preact/hooks";
import estilos from "./Quiz.module.scss";

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
    <section class={estilos.quiz} aria-labelledby="quiz-titulo">
      <h2 id="quiz-titulo" class={estilos.titulo}>
        Comprueba lo que has aprendido
      </h2>

      <ol class={estilos.lista}>
        {preguntas.map((p, i) => (
          <li key={i} class={estilos.pregunta}>
            <p class={estilos.enunciado}>
              <span class={estilos.numero}>{i + 1}.</span> {p.pregunta}
            </p>
            <ul class={estilos.opciones} role="radiogroup" aria-label={p.pregunta}>
              {p.opciones.map((op, j) => {
                const elegida = respuestas[i] === j;
                const correcta = enviado && j === p.correcta;
                const fallo = enviado && elegida && j !== p.correcta;
                const clase = [
                  estilos.opcion,
                  elegida && estilos.elegida,
                  correcta && estilos.correcta,
                  fallo && estilos.fallo,
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

      <footer class={estilos.pie}>
        {!enviado && (
          <button type="button" class={estilos.boton} disabled={!completo} onClick={enviar}>
            {completo ? "Corregir" : `Faltan ${respuestas.filter((r) => r === null).length}`}
          </button>
        )}
        {enviado && (
          <div class={estilos.resultado}>
            <p class={estilos.puntuacion}>
              {acertadas} de {preguntas.length} correctas
            </p>
            <button type="button" class={estilos.boton} onClick={reintentar}>
              Reintentar
            </button>
          </div>
        )}
      </footer>
    </section>
  );
}
