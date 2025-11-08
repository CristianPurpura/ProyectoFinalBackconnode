# Instrucciones para Configurar Firebase

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: "mi-tienda-productos")
4. Sigue los pasos para crear el proyecto

## 2. Habilitar Firestore

1. En tu proyecto de Firebase, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Empezar en modo de prueba" (para desarrollo)
4. Selecciona una ubicación cercana a ti

## 3. Crear Service Account

1. Ve a Configuración del proyecto (icono de engranaje)
2. Ve a la pestaña "Cuentas de servicio"
3. Haz clic en "Generar nueva clave privada"
4. Se descargará un archivo JSON

## 4. Configurar Variables de Entorno

Del archivo JSON descargado, extrae la siguiente información y úsala en tu archivo `.env`:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY_ID=valor-del-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_COMPLETA_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto.iam.gserviceaccount.com
```

## 5. Crear Colección de Productos

1. En Firestore, haz clic en "Iniciar colección"
2. ID de colección: `products`
3. Crea un documento de ejemplo con estos campos:

```json
{
  "name": "iPhone 14",
  "description": "Smartphone Apple iPhone 14 128GB",
  "price": 999.99,
  "category": "smartphones",
  "stock": 15,
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 6. Configurar Reglas de Firestore (Opcional para Desarrollo)

Para permitir lectura y escritura durante desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: En producción, configura reglas de seguridad apropiadas.

## 7. Reiniciar Servidor

Después de configurar las variables de entorno, reinicia el servidor:

```bash
npm start
```

Si todo está configurado correctamente, deberías ver:
```
✅ Firebase inicializado correctamente
```