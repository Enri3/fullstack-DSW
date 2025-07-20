const contenedorTarjetas = document.getElementById("productos-container");
const cantidadElement = document.getElementById("cantidad");
const precioElement = document.getElementById("precio");
const vacioElement = document.getElementById("carrito-vacio");
const totalElement = document.getElementById("totales");

function mostrarProductos(){
    /*al arrancar siempre vacio*/
    contenedorTarjetas.innerHTML = "";
  const prods= JSON.parse(localStorage.getItem("productos")) ;
  /*Si hay productos en memoria, los muestro*/
  if (prods && prods.length > 0) {
  prods.forEach(producto => {
    const nuevoProd = document.createElement("div");
    nuevoProd.classList = "tarjeta-producto"
    nuevoProd.innerHTML = `
    <img src="${producto.urlImg}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p class="precio">$${producto.precio}</p>
    <div>
    <button>-</button>
    <span class="cantidad">${producto.cantidad}</span>
    <button>+</button>
    </div>`
    /*suma o resta al carrito segun el boton que se presione*/
    contenedorTarjetas.appendChild(nuevoProd);
    nuevoProd
        .getElementsByTagName("button")[0]
        .addEventListener("click", (e) => { 
            /*resta al carrito y actualiza la cantidad*/
            restarAlCarrito(producto);
            actualizarTotales();
            carritoVacio();
            mostrarProductos();
            
        })
    nuevoProd
        .getElementsByTagName("button")[1]
        .addEventListener("click", (e) => {
            /*agrego al carrito y actualizo la cantidad*/
            const cantidadElement = e.target.parentElement.getElementsByClassName("cantidad")[0];
            cantidadElement.innerText = agregarAlCarrito(producto);
            actualizarTotales();
            carritoVacio();
  });})
  }
}

mostrarProductos();
actualizarTotales();


function actualizarTotales() {
  const prods = JSON.parse(localStorage.getItem("productos"));
  let unidades = 0;
  let precio = 0;
  if (prods && prods.length > 0) {
    prods.forEach(producto => {
      unidades += producto.cantidad;
      precio += producto.precio * producto.cantidad;
    });
    cantidadElement.innerText = unidades;
    precioElement.innerText = `${precio.toFixed(2)}`;
  }
  
}

document.getElementById("reiniciar").addEventListener("click", () => {
  contenedorTarjetas.innerHTML = "";
  reiniciarCarrito();
  mostrarProductos();
  actualizarTotales();
  carritoVacio();
});

function carritoVacio() {
  const prods = JSON.parse(localStorage.getItem("productos"));
  vacioElement.classList.toggle("escondido", prods && prods.length > 0  );
  totalElement.classList.toggle("escondido", !(prods && prods.length > 0));
}

carritoVacio();