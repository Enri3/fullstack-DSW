const API_URL = "http://localhost:4000"; // backend corriendo

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Inicio de sesión exitoso");
      console.log("Token recibido:", data.token);
      localStorage.setItem("token", data.token);
      window.location.href = "../index.html"; // redirige al inicio
    } else {
      alert(data.message || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    alert("No se pudo conectar con el servidor.");
  }
});