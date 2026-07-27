function mostrarUsuario(user) {
  const el = document.getElementById("username");
  el.textContent = user.profile.name;
}

fetch("/api/user")
  .then((res) => res.json())
  .then((user) => mostrarUsuario(user));
