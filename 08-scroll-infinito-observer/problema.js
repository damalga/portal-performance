const lista = document.getElementById("articulos");
const centinela = document.getElementById("cargar-mas");
let siguientePagina = 2;

window.addEventListener("scroll", () => {
  const rect = centinela.getBoundingClientRect();

  if (rect.top < window.innerHeight) {
    fetch("/api/articulos?pagina=" + siguientePagina)
      .then((res) => res.json())
      .then((articulos) => {
        lista.innerHTML += articulos.map((a) => `<article>${a.titulo}</article>`).join("");
        siguientePagina++;
      });
  }
});
