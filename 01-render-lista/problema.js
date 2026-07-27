const container = document.getElementById("list");

for (let i = 0; i < 500; i++) {
  const item = document.createElement("div");
  item.textContent = "Elemento " + i;
  container.appendChild(item);
}
