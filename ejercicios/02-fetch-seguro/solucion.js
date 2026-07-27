function mostrarUsuario(user) {
  const el = document.getElementById("username");
  el.textContent = user?.profile?.name ?? "Anónimo";
}

fetch("/api/user")
  .then((res) => res.json())
  .then((user) => mostrarUsuario(user))
  .catch((err) => console.error("No se pudo cargar el usuario:", err));
