const botones = document.querySelectorAll(".add-to-cart");

botones.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    console.log("Añadido al carrito:", id);
  });
});
