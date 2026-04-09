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
    { name: "Productos", description: "Gestion y consulta de productos" }
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
