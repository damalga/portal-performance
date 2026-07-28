const lista = document.getElementById("articulos");
const centinela = document.getElementById("cargar-mas");
let siguientePagina = 2;
let cargando = false;

const observer = new IntersectionObserver(
  ([ele]) => {
    if (!ele.isIntersecting) return;
    if (cargando) return;

    cargando = true;

    fetch("/api/articulos?pagina=" + siguientePagina)
      .then((res) => res.json())
      .then((articulos) => {
        lista.insertAdjacentHTML("beforeend", articulos.map((a) => `<article>${a.titulo}</article>`).join(""));
        siguientePagina++;
      })
      .finally(() => {
        cargando = false;
      });
  },
  { rootMargin: "300px" },
);

observer.observe(centinela);
