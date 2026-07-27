const barra = document.getElementById("progreso");
let pendiente = false;

window.addEventListener("scroll", () => {
  if (pendiente) return;
  pendiente = true;

  requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje = (window.scrollY / total) * 100;
    barra.style.width = porcentaje + "%";
    pendiente = false;
  });
});
