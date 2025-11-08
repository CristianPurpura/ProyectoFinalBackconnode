# Ejemplos de Uso de la API

## Autenticación

### 1. Login
```bash
POST /auth/login
Content-Type: application/json

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

### 2. Verificar Token
```bash
POST /auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Productos

### 1. Obtener todos los productos (público)
```bash
GET /api/products
```

### 2. Obtener producto por ID (público)
```bash
GET /api/products/ejemplo-1
```

### 3. Crear producto (requiere autenticación)
```bash
POST /api/products/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "MacBook Pro M3",
  "description": "Laptop Apple MacBook Pro 14 pulgadas con chip M3",
  "price": 2499.99,
  "category": "laptops",
  "stock": 8
}
```

### 4. Actualizar producto (requiere autenticación)
```bash
PUT /api/products/PRODUCT_ID
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "price": 2299.99,
  "stock": 5
}
```

### 5. Eliminar producto (requiere autenticación)
```bash
DELETE /api/products/PRODUCT_ID
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Ejemplos con PowerShell (Windows)

### Login
```powershell
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $response.data.token
```

### Obtener productos
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
```

### Crear producto
```powershell
$headers = @{ Authorization = "Bearer $token" }
$productData = @{
    name = "Nuevo Producto"
    description = "Descripción del nuevo producto"
    price = 199.99
    category = "categoria"
    stock = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products/create" -Method POST -Body $productData -Headers $headers -ContentType "application/json"
```

## Ejemplos con curl

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Obtener productos
```bash
curl http://localhost:3000/api/products
```

### Crear producto (reemplaza TOKEN con el token obtenido del login)
```bash
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Nuevo Producto",
    "description": "Descripción del nuevo producto",
    "price": 199.99,
    "category": "categoria",
    "stock": 10
  }'
```

## Códigos de Respuesta

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en los datos enviados
- **401 Unauthorized**: Token faltante o inválido
- **403 Forbidden**: Sin permisos para la operación
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor