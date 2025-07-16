const contenedorTarjetas = document.getElementById("productos-container");


function mostrarProductos(prods){
  prods.forEach(producto => {
    const nuevoProd = document.createElement("div");
    nuevoProd.classList = "tarjeta-producto"
    nuevoProd.innerHTML = `
    <img src="${producto.img}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p class="precio">$${producto.precio}</p>
    <button>Agregar al carrito</button>`
    contenedorTarjetas.appendChild(nuevoProd);
    nuevoProd.getElementsByTagName("button")[0].addEventListener("click", () => agregarAlCarrito(producto));
  });
}


mostrarProductos(productos);