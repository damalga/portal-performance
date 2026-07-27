const input = document.getElementById("buscador");
const tbody = document.getElementById("filas");
const contador = document.getElementById("total");

const articulos = [
  { titulo: "Análisis del Pixel", categoria: "Móviles" },
  { titulo: "Guía de teclados", categoria: "Periféricos" },
  { titulo: "Qué es RISC-V", categoria: "Hardware" },
  { titulo: "Review SSD Gen5", categoria: "Almacenamiento" },
];

input.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  tbody.innerHTML = "";
  let total = 0;

  articulos.forEach((art) => {
    if (art.titulo.toLowerCase().includes(query)) {
      tbody.innerHTML += `<tr><td>${art.titulo}</td><td>${art.categoria}</td></tr>`;
      total++;
      contador.textContent = "Resultados: " + total;
    }
  });
});
