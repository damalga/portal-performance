const container = document.getElementById("list");

for (let i = 0; i < 500; i++) {
  const item = document.createElement("div");
  const items = [];

  item.textContent = "Elemento " + i;
  items.push(item);
}

container.append(...items);
