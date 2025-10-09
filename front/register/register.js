document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registro exitoso. Ahora podés iniciar sesión.');
      window.location.href = '../login/login.html';
    } else {
      alert(data.message || 'Error al registrar el usuario');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión con el servidor');
  }
});