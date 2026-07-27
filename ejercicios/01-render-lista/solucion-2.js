const container = document.getElementById("list");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 500; i++) {
  const item = document.createElement("div");
  item.textContent = "Elemento " + i;
  fragment.appendChild(item);
}

container.appendChild(fragment);
