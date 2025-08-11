


export function agregarAlCarrito(producto) {
  const memoria=JSON.parse(localStorage.getItem("productos"));
  console.log(memoria);
  let cuenta = 0;
  /*Si no hay nada en memoria, creo un nuevo producto y lo guardo en memoria*/
  if(!memoria){
    const nuevoProducto = getNuevoProducto(producto);
    localStorage.setItem("productos", JSON.stringify([nuevoProducto]));
    cuenta=1;
 /*Si ya hay algo en memoria, busco si el producto que quiero agregar ya existe*/
}else{

    /*findIndex devuelve el indice del producto que coincida con el id del producto que quiero agregar (Si no lo encuentra, devuelve -1)*/
    const indiceProducto = memoria.findIndex((prod) => prod.id === producto.id);
    const nuevaMemoria = memoria;

    /*Si no existe, lo agrego con cantidad 1, si ya existe, le sumo 1 a la cantidad*/
    if (indiceProducto === -1) {
      nuevaMemoria.push(getNuevoProducto(producto));
      cuenta = 1;
    } else {
      nuevaMemoria[indiceProducto].cantidad += 1;
      cuenta = nuevaMemoria[indiceProducto].cantidad;
    }
    localStorage.setItem("productos", JSON.stringify(nuevaMemoria));
   
}
actualizarCarrito();
 return cuenta;
}

/*Le resto 1 al producto que seleccione*/
export function restarAlCarrito(producto) {
    const memoria=JSON.parse(localStorage.getItem("productos"));
    const indiceProducto = memoria.findIndex((prod) => prod.id === producto.id);
    if(memoria[indiceProducto].cantidad === 1){
        /*con splice saco el elemento si era el unico de ese en el carrito*/
        memoria.splice(indiceProducto, 1);
        
    }else{
        memoria[indiceProducto].cantidad -= 1;

    }
    localStorage.setItem("productos", JSON.stringify(memoria));
    actualizarCarrito();   
}

/*Obtengo los productos del carrito que tengo en memoria*/
export function obtenerProductosCarrito() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

/*Le agrego cantidad 1 al producto que  agarro y devuelvo*/
export function getNuevoProducto(producto) {
    const nuevoProducto = producto;
    nuevoProducto.cantidad = 1;
    return nuevoProducto;
}

/*traigo el numero del carrito que ya tenia*/
const numeroCarrito = document.getElementById("cuenta_carrito");

/*Actualizo el carrito con la cantidad de productos que tengo en memoria*/
export function actualizarCarrito() {
  const memoria = JSON.parse(localStorage.getItem("productos"));
  if (memoria && memoria.length > 0) {
    /*Lo que hago con reduce es convertir lo que  etengo en la memoria (array con los productos que fui seleccionando) en un solo valor que es el que quiero que el carrito muestre*/

    return memoria.reduce((acum, current) => acum + current.cantidad, 0);
  }
  return 0;
}

export function obtenerCantidadCarrito() {
  const memoria = JSON.parse(localStorage.getItem("productos"));
  if (memoria && memoria.length > 0) {
    return memoria.reduce((acum, current) => acum + current.cantidad, 0);
  }
  return 0;
}

actualizarCarrito();

/* Reinicia el carrito */
export function reiniciarCarrito(){
  localStorage.removeItem("productos");
  actualizarCarrito();

}