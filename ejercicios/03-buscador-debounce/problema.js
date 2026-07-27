const input = document.getElementById("buscador");
const lista = document.getElementById("resultados");

const productos = ["Teclado", "Ratón", "Monitor", "Webcam", "Altavoz"];

input.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  lista.innerHTML = "";

  productos
    .filter((p) => p.toLowerCase().includes(query))
    .forEach((p) => {
      lista.innerHTML += "<div>" + p + "</div>";
    });
});
