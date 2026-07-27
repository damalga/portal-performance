const input = document.getElementById("buscador");
const tbody = document.getElementById("filas");
const contador = document.getElementById("total");

const articulos = [
  { titulo: "Análisis del Pixel", categoria: "Móviles" },
  { titulo: "Guía de teclados", categoria: "Periféricos" },
  { titulo: "Qué es RISC-V", categoria: "Hardware" },
  { titulo: "Review SSD Gen5", categoria: "Almacenamiento" },
];

let timeout;

input.addEventListener("input", (e) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const query = e.target.value.toLowerCase();
    const filtrados = articulos.filter((art) => art.titulo.toLowerCase().includes(query));
    tbody.innerHTML = filtrados.map((art) => `<tr><td>${art.titulo}</td><td>${art.categoria}</td></tr>`).join("");
    contador.textContent = "Resultados: " + filtrados.length;
  }, 200);
});
