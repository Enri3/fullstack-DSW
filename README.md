# Vivelas - Aplicación de E-Commerce Fullstack

Sistema de gestión de tienda online desarrollado con **arquitectura agnóstica**. Cuenta con un backend en **Node.js + Express + TypeORM** y un frontend en **React + Vite**.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Endpoints de la API](#endpoints-de-la-api)
- [Contribución](#contribución)

---

## Requisitos Previos

Antes de instalar, asegurate de tener:

- **Node.js** >= 16.x (Descargar desde [nodejs.org](https://nodejs.org))
- **npm** >= 8.x 
- **MySQL** >= 5.7 (Descargar desde [mysql.com](https://dev.mysql.com/downloads/mysql/))
- **Git** 

### Verificar instalación:
```bash
node --version
npm --version
mysql --version
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Enri3/fullstack-DSW.git
cd fullstack-DSW
```

### 2. Instalar dependencias del Backend

```bash
cd back
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../front
npm install
```

---

## Configuración de Variables de Entorno

### Backend - Crear archivo `.env` en la carpeta `back/`

```bash
# Base de datos
HOST=localhost
DB_PORT=3306
USER=root
PASSWORD=tu_contraseña_mysql
DATABASE=vivelas

# JWT
JWT_SECRET=tu_clave_secreta_super_segura

# Mercado Pago
YOUR_ACCESS_TOKEN=tu_token_mercadopago

# Puerto del servidor
PORT=4000
```

### Frontend - Crear archivo `.env` en la carpeta `front/`

Normalmente Vite apunta a `http://localhost:4000` por defecto. Si cambias el puerto del backend, actualiza:

```bash
VITE_API_URL=http://localhost:4000
```

### 3. Crear base de datos MySQL

Abrir MySQL y ejecutar:

```sql
CREATE DATABASE vivelas;
```

Luego importar el esquema:

```bash
mysql -u root -p vivelas < vivelas.sql
```

## Ejecución del Proyecto

### Opción 1: Ejecutar Backend y Frontend en terminales separadas

**Terminal 1 - Backend (puerto 4000):**
```bash
cd back
npm run dev
```

**Terminal 2 - Frontend (puerto 5173):**
```bash
cd front
npm run dev
```

Luego acceder a: **http://localhost:5173**

### Opción 2: Construir para producción

**Backend:**
```bash
cd back
npm run build
npm start
```

**Frontend:**
```bash
cd front
npm run build
npm run preview
```

---

## Estructura del Proyecto

```
fullstack-DSW/
├── back/
│   ├── src/
│   │   ├── controllers/      # Lógica de negocios
│   │   ├── routes/           # Definición de endpoints
│   │   ├── middleware/       # Autenticación y autorización
│   │   ├── database.ts       # Configuración de BD
│   │   └── index.ts          # Entrada del servidor
│   ├── tests/
│   │   ├── unit/             # Tests unitarios
│   │   └── integration/      # Tests de integración
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── front/
│   ├── src/
│   │   ├── pages/            # Componentes de páginas
│   │   ├── components/       # Componentes reutilizables
│   │   ├── services/         # Llamadas a API
│   │   ├── types/            # Interfaces TypeScript
│   │   ├── assets/           # Imágenes, CSS
│   │   ├── utils/            # Funciones auxiliares
│   │   ├── App.jsx           # Componente raíz
│   │   └── main.jsx          # Punto de entrada
│   ├── tests/                # Tests unitarios y E2E
│   ├── package.json
│   └── vite.config.js
├── entidades/                # ORM Entities (compartidas)
├── vivelas.sql               # Script SQL inicial
└── README.md                 # Este archivo
```

---

## Arquitectura

### Sistema de Capas (Backend)

```
HTTP Request
    ↓
Routes (Enrutamiento)
    ↓
Middleware (Autenticación, Autorización)
    ↓
Controllers (Lógica de negocios)
    ↓
Database (TypeORM/Entities)
    ↓
MySQL
```

### Frontend - Componentes

- **Pages**: Vistas principales (Login, Admin, Carrito, etc.)
- **Components**: Elementos reutilizables (Header, Footer, ProtectedRoute)
- **Services**: Llamadas HTTP a la API
- **Types**: Interfaces de datos

---

## Autenticación y Autorización

### Niveles de Acceso

El sistema cuenta con **2 niveles de usuario**:

| Tipo | ID | Permisos |
|------|----|-----------| 
| **Admin** | 1 | Ver/crear/editar/borrar productos, descuentos, pedidos; ver todos los clientes |
| **Cliente** | 2 | Ver productos, carrito, historial de pedidos, editar perfil |

### Flujo de Autenticación

1. Usuario se registra/loguea con email y contraseña
2. Backend valida y genera JWT con `jsonwebtoken + bcrypt`
3. Frontend almacena token en `localStorage`
4. Cada request a API incluye: `Authorization: Bearer <token>`
5. Backend verifica token en middleware `verificarToken`
6. Si es ruta de admin, middleware `verificarAdmin` verifica `idTipoCli === 1`

### Rutas Protegidas

**Solo Autenticados (cliente + admin):**
- GET/POST/PUT/DELETE `/pedidos/cliente/:idCli`
- GET `/pedidos/:idPedido`

**Solo Admin:**
- POST/PUT/DELETE `/productos` (crear, editar, borrar)
- GET `/pedidos/` (ver todos)
- POST/DELETE `/descuentos`

**Públicas:**
- GET `/productos` (catálogo)
- GET `/productos/:idProd` (detalle)
- POST `/auth/register`, `/auth/login`

---

## Testing

### Backend - Tests Unitarios e Integración

```bash
cd back

# Ejecutar todos los tests
npm test

# Modo watch (reejecutar al cambiar archivos)
npm run test:watch

# Cobertura de código
npm run test:coverage
```

**Dónde están:**
- `back/tests/unit/` - Tests unitarios de controladores
- `back/tests/integration/` - Tests de integración (ej: tipo_clientes)

### Frontend - Tests Unitarios y E2E

```bash
cd front

# Ejecutar tests
npm test

# Modo watch
npm test:watch

# UI visual
npm test:ui
```

**Dónde están:**
- `front/src/tests/Header.unit.test.tsx` - Test unitario
- `front/src/tests/Header.e2e.test.tsx` - Test E2E

---

## Endpoints de la API

### Autenticación (Auth)

```
POST   /auth/register              Registrar nuevo cliente
POST   /auth/login                 Iniciar sesión
PUT    /auth/edit                  Editar perfil (protegido)
PUT    /auth/cambiar-password      Cambiar contraseña (protegido)
DELETE /auth/eliminar-multiple     Eliminar clientes (solo admin)
```

### Productos

```
GET    /productos                  Listar todos (público)
GET    /productos/:idProd          Detalle de producto (público)
POST   /productos                  Crear producto (solo admin)
PUT    /productos/update/:idProd   Editar producto (solo admin)
DELETE /productos/:idProd          Borrar producto (solo admin)
```

### Pedidos

```
GET    /pedidos                    Listar todos (solo admin)
GET    /pedidos/:idPedido          Detalle de pedido (protegido)
GET    /pedidos/cliente/:idCli     Pedidos del cliente (protegido)
POST   /pedidos                    Crear pedido (protegido)
PUT    /pedidos/:idPedido          Actualizar estado (protegido)
DELETE /pedidos/:idPedido          Eliminar pedido (protegido)
```

### Descuentos

```
GET    /descuentos/getAllProd      Listar todos (público)
POST   /descuentos/add             Crear descuento (solo admin)
DELETE /descuentos/delete          Eliminar descuento (solo admin)
```
---

## 👥 Datos de Prueba

### Crear usuario de prueba en frontend:
1. Ir a `/register`
2. Completar formulario
3. Automáticamente se crea con `idTipoCli = 2` (cliente)

### Admin (para testing):
Para crear admin, necesitás acceso a MySQL:
```sql
INSERT INTO cliente VALUES (
  NULL, 
  'Admin', 
  'Test', 
  'admin@test.com', 
  '$2b$10/hash_bcrypt',
  'Dirección Test',
  1,  -- idTipoCli = 1 (ADMIN)
  NOW()
);
```
---

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación por tokens
- **bcrypt** - Hash de contraseñas
- **TypeScript** - Tipado seguro
- **Jest** - Testing
- **Nodemon** - Recarga automática en desarrollo

### Frontend
- **React 19** - Librería de UI
- **Vite** - Bundler moderno
- **React Router** - Enrutamiento
- **TypeScript** - Tipado seguro
- **Vitest** - Testing
- **Testing Library** - Tests de componentes
- **ESLint** - Linting

---

