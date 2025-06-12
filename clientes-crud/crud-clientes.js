let clientes = [];
let modoEdicion = false;
let idClienteEditando = null;

function agregarCliente(nombre, apellido, direccion) {
  if (!nombre && !apellido && !direccion) {
    nombre = document.getElementById("nombre").value;
    apellido = document.getElementById("apellido").value;
    direccion = document.getElementById("direccion").value;

    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("direccion").value = "";
  }

  if (modoEdicion) {
    // Actualizar cliente existente
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].id === idClienteEditando) {
        clientes[i].nombre = nombre;
        clientes[i].apellido = apellido;
        clientes[i].direccion = direccion;
        break;
      }
    }
    modoEdicion = false;
    idClienteEditando = null;
  } else {
    // Crear nuevo cliente
    let cliente = {
      id: clientes.length + 1,
      nombre: nombre,
      apellido: apellido,
      direccion: direccion
    };
    clientes.push(cliente);
    console.log("Cliente agregado:", cliente);
  }

  mostrarClientes();
}

function mostrarClientes() {
  let tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";

  for (let i = 0; i < clientes.length; i++) {
    let c = clientes[i];
    let fila = "<tr>";
    fila += "<td>" + c.id + "</td>";
    fila += "<td>" + c.nombre + "</td>";
    fila += "<td>" + c.apellido + "</td>";
    fila += "<td>" + c.direccion + "</td>";
    fila += "<td><button onclick='prepararEdicion(" + c.id + ")'>Editar</button> ";
    fila += "<button onclick='eliminarCliente(" + c.id + ")'>Eliminar</button></td>";
    fila += "</tr>";
    tabla.innerHTML += fila;
  }
}

function prepararEdicion(id) {
  // Buscar cliente y cargarlo en inputs
  let cliente = clientes.find(c => c.id === id);
  if (cliente) {
    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("apellido").value = cliente.apellido;
    document.getElementById("direccion").value = cliente.direccion;
    modoEdicion = true;
    idClienteEditando = id;
  }
}

function eliminarCliente(id) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].id === id) {
      clientes.splice(i, 1);
      mostrarClientes();
      return;
    }
  }
}