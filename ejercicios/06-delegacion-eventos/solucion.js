const listaArticulos = document.getElementById("lista-articulos");

listaArticulos.addEventListener("click", (e) => {
  const boton = e.target.closest(".add-to-cart");

  if (boton) {
    const id = boton.dataset.id;
    console.log("Añadido al carrito:", id);
  }
});
