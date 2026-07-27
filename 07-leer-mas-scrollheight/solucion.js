const resumenes = document.querySelectorAll(".resumen");

// Lecturas
const necesitanBoton = [];

resumenes.forEach((resumen) => {
  // mide aquí y guarda en el array los que tienen texto oculto
  if (resumen.scrollHeight > resumen.clientHeight) {
    necesitanBoton.push(resumen);
  }
});

// Escrituras
necesitanBoton.forEach((resumen) => {
  // crea e inserta aquí el botón
  const boton = document.createElement("button");
  boton.textContent = "Leer más";
  boton.className = "leer-mas";
  resumen.parentElement.appendChild(boton);
});
