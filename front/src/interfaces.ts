export interface Producto {
  // int AI PK
  id: number; 
  
  // varchar(100)
  nombre: string;
  
  // decimal(10,2)
  precio: number; 
  
  // varchar(256)
  urlImg: string;
  
  // tinyint (usado para soft delete)
  deleted: number; 
  
  // varchar(45)
  medida: string;

  cantidad: number;
}