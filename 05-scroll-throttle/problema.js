const barra = document.getElementById("progreso");

window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const leido = window.scrollY;
  const porcentaje = (leido / total) * 100;
  barra.style.width = porcentaje + "%";
});
