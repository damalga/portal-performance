input.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  lista.textContent = ""; // Limpia el contenedor de forma segura

  const fragment = document.createDocumentFragment();

  productos
    .filter((p) => p.toLowerCase().includes(query))
    .forEach((p) => {
      const item = document.createElement("div");
      item.textContent = p; // Seguro ante inyecciones
      fragment.appendChild(item);
    });

  lista.appendChild(fragment); // 1 sola modificación al DOM
});
