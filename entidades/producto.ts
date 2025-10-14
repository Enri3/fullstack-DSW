export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  urlImg: string;
  deleted:number;
  medida:string;
}

export const productoVacio: Producto = {
    id: 0,
    nombre: "",
    precio: 0,
    urlImg: "",
    deleted: 0,
    medida: ""
};

export const PRODUCTOS_MOCK_DATA: Producto[] = [
    {
        id: 101,
        nombre: 'Vela Aromática de Coco y Vainilla',
        precio: 18.50,
        urlImg: 'https://placehold.co/600x400/F0EAD6/6C5B4E?text=Vela+Coco',
        deleted: 0,
        medida: '200gr',
    },
    {
        id: 102,
        nombre: 'Jabón Sólido de Lavanda Relajante',
        precio: 5.99,
        urlImg: 'https://placehold.co/600x400/E3D9BD/6C5B4E?text=Jabon+Lavanda',
        deleted: 0,
        medida: '100gr',
    },
    {
        id: 103,
        nombre: 'Difusor de Aromas Eléctrico',
        precio: 45.00,
        urlImg: 'https://placehold.co/600x400/C7BCA3/3D332C?text=Difusor+Electric',
        deleted: 0,
        medida: 'Unidad',
    },
    {
        id: 104,
        nombre: 'Aceite Esencial de Eucalipto',
        precio: 12.75,
        urlImg: 'https://placehold.co/600x400/6C5B4E/FFFFFF?text=Aceite+Eucalipto',
        deleted: 0,
        medida: '10ml',
    },
    {
        id: 105,
        nombre: 'Set de Regalo "Bienestar en Casa"',
        precio: 75.90,
        urlImg: 'https://placehold.co/600x400/7A6F62/FFFFFF?text=Set+Regalo',
        deleted: 0,
        medida: 'Caja',
    },
    {
        id: 106,
        nombre: 'Sales de Baño Minerales',
        precio: 9.99,
        urlImg: 'https://placehold.co/600x400/F0EAD6/3D332C?text=Sales+Baño',
        deleted: 1, // Ejemplo de un producto eliminado
        medida: '300gr',
    },
];