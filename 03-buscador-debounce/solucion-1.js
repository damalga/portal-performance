const input = document.getElementById("buscador");
const lista = document.getElementById("resultados");
const productos = ["Teclado", "Ratón", "Monitor", "Webcam", "Altavoz"];

// timeout vive fuera del listener para poder cancelarlo entre pulsaciones
let timeout;

input.addEventListener("input", (e) => {
  // DEBOUNCE: cancela el filtrado pendiente si el usuario sigue tecleando,
  // así solo se ejecuta una vez cuando para, en lugar de en cada tecla
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const query = e.target.value.toLowerCase().trim();
    const filtrados = productos.filter((p) => p.toLowerCase().includes(query));
    // Construimos todo el HTML en memoria y lo asignamos UNA SOLA VEZ
    lista.innerHTML = filtrados.map((p) => `<div>${p}</div>`).join("");
  }, 200); // espera 200ms desde la última pulsación antes de filtrar y pintar
});
