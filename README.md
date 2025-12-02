# API REST - Gestión de Productos

API REST para la gestión de productos con autenticación JWT y base de datos Firebase Firestore.

## Características

- CRUD completo para productos
- Autenticación JWT
- Integración con Firebase Firestore
- Arquitectura en capas (MVC + Services)
- Manejo de errores robusto
- Middleware de seguridad
- Validaciones de datos
- CORS configurado
- Logging de requests

## Requisitos Previos

- Node.js 18+
- npm
- Cuenta de Firebase con proyecto creado
- Firestore habilitado

## Instalación

1. **Clonar e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
   
   Configura el archivo `.env` con tu configuración de Firebase:
   ```env
   PORT=3000
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui
   
   # Firebase Configuration
   FIREBASE_PROJECT_ID=tu-proyecto-firebase
   FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-firebase.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=tu-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto-firebase.iam.gserviceaccount.com
   
   # Usuarios de prueba
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

3. **Configurar Firebase:**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Genera las credenciales de Service Account
   - Copia las credenciales al archivo `.env`

4. **Iniciar el servidor:**
```bash
npm start
```

## Endpoints de la API

### Autenticación

#### POST /auth/login
Autentica un usuario y devuelve un token JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Autenticación exitosa"
}
```

### Productos

#### GET /api/products
Obtiene todos los productos (público).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "producto-id",
      "name": "Producto de ejemplo",
      "description": "Descripción del producto",
      "price": 99.99,
      "category": "categoria",
      "stock": 10,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Productos obtenidos correctamente"
}
```

#### GET /api/products/:id
Obtiene un producto por ID (público).

#### POST /api/products/create
Crea un nuevo producto (requiere autenticación).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del nuevo producto",
  "price": 79.99,
  "category": "electrónicos",
  "stock": 5
}
```

#### PUT /api/products/:id
Actualiza un producto existente (requiere autenticación).

#### DELETE /api/products/:id
Elimina un producto (requiere autenticación).

## Arquitectura del Proyecto

```
proyecto/
├── src/
│   ├── config/
│   │   └── firebase.js          # Configuración de Firebase
│   ├── controllers/
│   │   ├── productController.js # Controlador de productos
│   │   └── authController.js    # Controlador de autenticación
│   ├── services/
│   │   ├── productService.js    # Lógica de negocio - productos
│   │   └── authService.js       # Lógica de negocio - autenticación
│   ├── models/
│   │   └── Product.js           # Modelo de datos - productos
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Middleware de autenticación
│   │   └── errorMiddleware.js   # Middleware de manejo de errores
│   └── routes/
│       ├── products.routes.js   # Rutas de productos
│       └── auth.routes.js       # Rutas de autenticación
├── index.js                     # Punto de entrada de la aplicación
├── package.json
└── .env                         # Variables de entorno
```

## Seguridad

- **JWT**: Tokens de autenticación con expiración de 24 horas
- **CORS**: Configurado para dominios específicos
- **Headers de Seguridad**: X-Frame-Options, X-Content-Type-Options, etc.
- **Validación de datos**: Validaciones en todas las capas
- **Manejo de errores**: No exposición de información sensible

## Estructura de Respuesta

Todas las respuestas de la API siguen la siguiente estructura:

```json
{
  "success": boolean,
  "data": object|array|null,
  "message": string
}
```

## Códigos de Error

- **200**: OK
- **201**: Creado
- **400**: Error de validación/Bad Request
- **401**: No autorizado
- **403**: Permisos insuficientes
- **404**: Recurso no encontrado
- **500**: Error interno del servidor
- **503**: Servicio no disponible

## Configuración de Firestore

1. Crea una colección llamada `products`
2. Agrega un documento de ejemplo con esta estructura:

```json
{
  "name": "Producto de ejemplo",
  "description": "Descripción del producto de ejemplo",
  "price": 99.99,
  "category": "ejemplo",
  "stock": 10,
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Scripts Disponibles

- `npm start`: Inicia el servidor en producción
- `npm run dev`: Inicia el servidor en modo desarrollo con auto-reload

## Despliegue

Para desplegar en producción:

1. Configura las variables de entorno en tu servicio de hosting
2. Asegúrate de configurar los dominios permitidos en CORS
3. Usa `NODE_ENV=production`
4. Configura un proxy reverso (Nginx) si es necesario

## Soporte

Para reportar problemas o solicitar características, crea un issue en el repositorio del proyecto.