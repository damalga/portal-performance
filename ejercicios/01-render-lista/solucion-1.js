const container = document.getElementById("list");
const items = [];

for (let i = 0; i < 500; i++) {
  const item = document.createElement("div");

  item.textContent = "Elemento " + i;
  items.push(item);
}

container.append(...items);
