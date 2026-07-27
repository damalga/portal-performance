const resumenes = document.querySelectorAll(".resumen");

resumenes.forEach((resumen) => {
  if (resumen.scrollHeight > resumen.clientHeight) {
    const boton = document.createElement("button");
    boton.textContent = "Leer más";
    boton.className = "leer-mas";
    resumen.parentElement.appendChild(boton);
  }
});
