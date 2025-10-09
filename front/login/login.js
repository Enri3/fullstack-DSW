document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/clientes/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("tipoCliente", data.tipoCliente);
    window.location.href = "../clientes-crud/index.html";
  }
});