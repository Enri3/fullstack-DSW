import path from "path";

const swaggerJSDoc = require("swagger-jsdoc");

const routeFiles = [
  path.join(process.cwd(), "src", "routes", "*.ts"),
  path.join(process.cwd(), "dist", "src", "routes", "*.js"),
  path.join(process.cwd(), "dist", "back", "src", "routes", "*.js")
];

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Vivelas DSW API",
    version: "1.0.0",
    description: "Documentacion de endpoints del proyecto Vivelas"
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Servidor local"
    }
  ],
  tags: [
    { name: "Auth", description: "Autenticacion y gestion de clientes" },
    { name: "Productos", description: "Gestion y consulta de productos" },
    { name: "Pedidos", description: "Gestion de pedidos y carrito" },
    { name: "Descuentos", description: "Gestion y consulta de descuentos" },
    { name: "TipoClientes", description: "Consulta de tipos de cliente" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Ruta no encontrada" },
          error: { type: "string", example: "Error interno" },
          detalle: { type: "string", example: "Detalle tecnico" }
        }
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operacion realizada correctamente" }
        },
        required: ["message"]
      },
      ClientePublic: {
        type: "object",
        properties: {
          idCli: { type: "integer", example: 15 },
          nombreCli: { type: "string", example: "Juan" },
          apellido: { type: "string", nullable: true, example: "Perez" },
          direccion: { type: "string", example: "San Martin 123" },
          email: { type: "string", format: "email", example: "juan@email.com" },
          idTipoCli: { type: "integer", example: 2 }
        }
      },
      AuthRegisterRequest: {
        type: "object",
        properties: {
          nombreCli: { type: "string", example: "Juan" },
          apellido: { type: "string", example: "Perez" },
          direccion: { type: "string", example: "San Martin 123" },
          email: { type: "string", format: "email", example: "juan@email.com" },
          password: { type: "string", example: "secreta123" },
          captcha: { type: "string", example: "token-captcha" }
        },
        required: ["nombreCli", "direccion", "email", "password", "captcha"]
      },
      AuthLoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "juan@email.com" },
          password: { type: "string", example: "secreta123" },
          captcha: { type: "string", example: "token-captcha" }
        },
        required: ["email", "password", "captcha"]
      },
      AuthLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login exitoso" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          cliente: { $ref: "#/components/schemas/ClientePublic" }
        },
        required: ["message", "token", "cliente"]
      },
      AuthEditarClienteRequest: {
        type: "object",
        properties: {
          idCli: { type: "integer", example: 15 },
          nombreCli: { type: "string", example: "Juan" },
          apellido: { type: "string", example: "Perez" },
          direccion: { type: "string", example: "San Martin 123" },
          email: { type: "string", format: "email", example: "juan@email.com" },
          password: { type: "string", example: "nuevaPass123" }
        },
        required: ["idCli", "nombreCli", "apellido", "direccion", "email"]
      },
      AuthEliminarMultipleRequest: {
        type: "object",
        properties: {
          ids: {
            type: "array",
            items: { type: "integer" },
            example: [11, 12, 13]
          }
        },
        required: ["ids"]
      },
      AuthCambiarPasswordRequest: {
        type: "object",
        properties: {
          idCli: { type: "integer", example: 15 },
          passwordAnterior: { type: "string", example: "actual123" },
          passwordNueva: { type: "string", example: "nueva123" }
        },
        required: ["idCli", "passwordAnterior", "passwordNueva"]
      },
      AuthBuscarClienteRequest: {
        type: "object",
        properties: {
          criterioFiltro: { type: "string", example: "juan" }
        }
      },
      Producto: {
        type: "object",
        properties: {
          idProd: { type: "integer", example: 8 },
          nombreProd: { type: "string", example: "Vela de soja" },
          medida: { type: "string", nullable: true, example: "200" },
          precioProd: { type: "number", format: "float", example: 2500 },
          precioFinalProd: { type: "number", format: "float", example: 2200 },
          porcentajeDescuentoProducto: { type: "number", format: "float", example: 10 },
          porcentajeDescuentoTipoCliente: { type: "number", format: "float", example: 2 },
          urlImg: { type: "string", example: "/fotosProductos/1700000000000-123456789.jpg" },
          deleted: { type: "integer", example: 0 },
          stock: { type: "integer", example: 10 }
        },
        required: ["idProd", "nombreProd", "precioProd", "stock"]
      },
      ProductoBuscarRequest: {
        type: "object",
        properties: {
          nombreProdBuscado: { type: "string", example: "vela" },
          admin: { type: "boolean", example: false }
        }
      },
      ProductoCreateUpdateMultipart: {
        type: "object",
        properties: {
          nombreProd: { type: "string", example: "Vela de soja" },
          medida: { type: "string", example: "200" },
          precioProd: { type: "string", example: "2500" },
          stock: { type: "string", example: "10" },
          imagen: { type: "string", format: "binary" }
        },
        required: ["nombreProd", "precioProd", "stock"]
      },
      PedidoProductoItem: {
        type: "object",
        properties: {
          idProd: { type: "integer", example: 8 },
          cantidadProdPed: { type: "integer", example: 2 }
        },
        required: ["idProd", "cantidadProdPed"]
      },
      PedidoProducto: {
        type: "object",
        properties: {
          idPedido: { type: "integer", example: 23 },
          idProd: { type: "integer", example: 8 },
          cantidadProdPed: { type: "integer", example: 2 },
          producto: { $ref: "#/components/schemas/Producto" }
        }
      },
      Pedido: {
        type: "object",
        properties: {
          idPedido: { type: "integer", example: 23 },
          idCli: { type: "integer", example: 15 },
          estadoPedido: { type: "string", example: "enCarrito" },
          formaEntrega: { type: "string", nullable: true, example: "retiro" },
          medioPago: { type: "string", nullable: true, example: "efectivo" },
          montoTotal: { type: "number", format: "float", nullable: true, example: 7200 },
          montoPagado: { type: "number", format: "float", nullable: true, example: 8000 },
          vuelto: { type: "number", format: "float", nullable: true, example: 800 },
          fechaPedido: { type: "string", format: "date-time", example: "2026-04-09T14:20:00.000Z" },
          pedidoProductos: {
            type: "array",
            items: { $ref: "#/components/schemas/PedidoProducto" }
          }
        },
        required: ["idPedido", "idCli", "estadoPedido", "fechaPedido"]
      },
      PedidoCreateRequest: {
        type: "object",
        properties: {
          idCli: { type: "integer", example: 15 },
          estadoPedido: { type: "string", example: "enCarrito" },
          productos: {
            type: "array",
            items: { $ref: "#/components/schemas/PedidoProductoItem" }
          }
        },
        required: ["idCli", "estadoPedido", "productos"]
      },
      PedidoCreateResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Pedido creado correctamente" },
          pedido: { $ref: "#/components/schemas/Pedido" }
        },
        required: ["message", "pedido"]
      },
      PedidoUpdateEstadoRequest: {
        type: "object",
        properties: {
          estadoPedido: { type: "string", example: "finalizado" },
          formaEntrega: { type: "string", example: "envio" },
          medioPago: { type: "string", example: "efectivo" },
          montoTotal: { type: "number", format: "float", example: 7200 },
          montoPagado: { type: "number", format: "float", example: 8000 },
          vuelto: { type: "number", format: "float", example: 800 }
        },
        required: ["estadoPedido"]
      },
      PedidoUpdateCantidadRequest: {
        type: "object",
        properties: {
          cantidadProdPed: { type: "integer", example: 3 }
        },
        required: ["cantidadProdPed"]
      },
      PedidoUpdateCantidadResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Cantidad del producto actualizada correctamente" },
          pedidoEliminado: { type: "boolean", example: false }
        },
        required: ["message", "pedidoEliminado"]
      },
      MercadoPagoPreferenceResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "1234567890-abcd-efgh" }
        },
        required: ["id"]
      },
      WebhookMercadoPagoRequest: {
        type: "object",
        properties: {
          type: { type: "string", example: "payment" },
          data: {
            type: "object",
            properties: {
              id: { type: "string", example: "987654321" }
            }
          }
        }
      },
      Descuento: {
        type: "object",
        properties: {
          idDesc: { type: "integer", example: 4 },
          porcentaje: { type: "number", format: "float", example: 15 },
          fechaDesde: { type: "string", format: "date", example: "2026-04-01" },
          fechaHasta: { type: "string", format: "date", example: "2026-04-30" }
        }
      },
      DescuentoAddRequest: {
        type: "object",
        properties: {
          porcentaje: { type: "number", format: "float", example: 15 },
          fechaDesde: { type: "string", format: "date", example: "2026-04-01" },
          fechaHasta: { type: "string", format: "date", example: "2026-04-30" },
          idsProductos: {
            type: "array",
            items: { type: "integer" },
            example: [8, 9, 10]
          }
        },
        required: ["porcentaje", "fechaDesde", "fechaHasta", "idsProductos"]
      },
      DescuentoAddResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Descuento creado y asociado correctamente" },
          idDesc: { type: "integer", example: 4 }
        },
        required: ["message", "idDesc"]
      },
      DescuentoBuscarRequest: {
        type: "object",
        properties: {
          idProd: { type: "integer", example: 8 },
          nombreProd: { type: "string", example: "vela" }
        }
      },
      DescuentoResultado: {
        type: "object",
        properties: {
          idProd: { type: "integer", nullable: true, example: 8 },
          nombreProd: { type: "string", example: "Vela de soja" },
          medida: { type: "string", example: "200" },
          stock: { type: "integer", example: 10 },
          urlImg: { type: "string", example: "/fotosProductos/1700000000000-123456789.jpg" },
          idDesc: { type: "integer", nullable: true, example: 4 },
          porcentaje: { type: "number", format: "float", nullable: true, example: 15 },
          fechaDesde: { type: "string", format: "date", nullable: true, example: "2026-04-01" },
          fechaHasta: { type: "string", format: "date", nullable: true, example: "2026-04-30" }
        }
      },
      DescuentoDeleteRequest: {
        type: "object",
        properties: {
          idsDescuentos: {
            type: "array",
            items: { type: "integer" },
            example: [4, 5]
          }
        },
        required: ["idsDescuentos"]
      },
      TipoClienteNombreResponse: {
        type: "object",
        properties: {
          nombreTipoCli: { type: "string", example: "cliente" }
        },
        required: ["nombreTipoCli"]
      }
    }
  }
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: routeFiles
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
