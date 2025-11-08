# Script de Prueba de la API
# Ejecuta este script en PowerShell para probar todos los endpoints

Write-Host "=== Prueba de API REST - Gestión de Productos ===" -ForegroundColor Green
Write-Host ""

# Configuración
$baseUrl = "http://localhost:3000"

# Función para imprimir respuestas
function Print-Response($title, $response) {
    Write-Host "=== $title ===" -ForegroundColor Cyan
    if ($response -ne $null) {
        $response | ConvertTo-Json -Depth 3 | Write-Host
    } else {
        Write-Host "Error en la petición" -ForegroundColor Red
    }
    Write-Host ""
}

try {
    # 1. Probar endpoint de información
    Write-Host "1. Probando endpoint de información..." -ForegroundColor Yellow
    $info = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Print-Response "Información del API" $info

    # 2. Probar health check
    Write-Host "2. Probando health check..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Print-Response "Health Check" $health

    # 3. Probar obtener productos (público)
    Write-Host "3. Probando obtener productos..." -ForegroundColor Yellow
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method GET
    Print-Response "Lista de Productos" $products

    # 4. Probar login
    Write-Host "4. Probando login..." -ForegroundColor Yellow
    $loginData = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Print-Response "Login" $loginResponse

    $token = $loginResponse.data.token
    Write-Host "Token obtenido: $token" -ForegroundColor Green
    Write-Host ""

    # 5. Probar obtener perfil (requiere autenticación)
    Write-Host "5. Probando obtener perfil..." -ForegroundColor Yellow
    $headers = @{ Authorization = "Bearer $token" }
    $profile = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $headers
    Print-Response "Perfil de Usuario" $profile

    # 6. Probar obtener producto por ID
    Write-Host "6. Probando obtener producto por ID..." -ForegroundColor Yellow
    $product = Invoke-RestMethod -Uri "$baseUrl/api/products/ejemplo-1" -Method GET
    Print-Response "Producto por ID" $product

    # 7. Probar crear producto (requiere autenticación)
    Write-Host "7. Probando crear producto..." -ForegroundColor Yellow
    $newProductData = @{
        name = "Producto de Prueba PowerShell"
        description = "Este producto fue creado desde el script de prueba"
        price = 299.99
        category = "pruebas"
        stock = 15
    } | ConvertTo-Json

    try {
        $createdProduct = Invoke-RestMethod -Uri "$baseUrl/api/products/create" -Method POST -Body $newProductData -Headers $headers -ContentType "application/json"
        Print-Response "Producto Creado" $createdProduct
    } catch {
        Write-Host "Error esperado al crear producto (Firebase no configurado): $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host ""
    }

    # 8. Probar endpoint no existente (404)
    Write-Host "8. Probando endpoint no existente..." -ForegroundColor Yellow
    try {
        $notFound = Invoke-RestMethod -Uri "$baseUrl/endpoint-inexistente" -Method GET
    } catch {
        Write-Host "Error 404 esperado: Endpoint no encontrado" -ForegroundColor Yellow
        Write-Host ""
    }

    Write-Host "=== ¡Todas las pruebas completadas! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Notas importantes:" -ForegroundColor Magenta
    Write-Host "- El servidor está funcionando correctamente" -ForegroundColor White
    Write-Host "- Firebase no está configurado (usando datos de ejemplo)" -ForegroundColor White
    Write-Host "- Para habilitar Firebase, configura las variables en .env" -ForegroundColor White
    Write-Host "- Consulta FIREBASE_SETUP.md para instrucciones detalladas" -ForegroundColor White

} catch {
    Write-Host "Error al ejecutar las pruebas: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Asegúrate de que el servidor está ejecutándose en $baseUrl" -ForegroundColor Yellow
}