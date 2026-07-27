const barra = document.getElementById("progreso");
let stop = false;

window.addEventListener("scroll", () => {
  if (stop) return;
  stop = true;

  const total = document.documentElement.scrollHeight - window.innerHeight;
  const leido = window.scrollY;
  const porcentaje = (leido / total) * 100;
  barra.style.width = porcentaje + "%";

  setTimeout(() => {
    stop = false;
  }, 200);
});
