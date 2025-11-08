# 🚀 Guía de Despliegue en Vercel

## 📋 Prerrequisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [GitHub](https://github.com)
- ✅ Proyecto funcionando localmente
- ✅ Firebase configurado

## 🔧 Pasos para el Despliegue

### 1. **Preparar el Repositorio**

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: API REST con Firebase"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

### 2. **Configurar Vercel**

1. **Ir a [Vercel](https://vercel.com)**
2. **Conectar con GitHub**
3. **Importar proyecto** desde tu repositorio
4. **Configurar proyecto:**
   - Framework: **Other**
   - Root Directory: **/** (raíz)
   - Build Command: **npm run build**
   - Output Directory: **.** (punto)
   - Install Command: **npm install**

### 3. **Configurar Variables de Entorno en Vercel**

En el panel de Vercel, ve a **Settings → Environment Variables** y agrega:

```
NODE_ENV = production
PORT = 3000
JWT_SECRET = tu_jwt_secret_super_seguro_aqui

# Firebase (usar los valores reales de tu .env)
FIREBASE_PROJECT_ID = proyecto-final-back-con-node
FIREBASE_PRIVATE_KEY_ID = tu-private-key-id
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_COMPLETA\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID = tu-client-id
FIREBASE_AUTH_URI = https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI = https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40tu-proyecto.iam.gserviceaccount.com

# Usuarios
ADMIN_USERNAME = admin
ADMIN_PASSWORD = admin123
```

⚠️ **IMPORTANTE**: Para `FIREBASE_PRIVATE_KEY`, copia el valor exacto de tu `.env` local incluyendo las comillas y caracteres `\n`.

### 4. **Desplegar**

1. **Deploy automático**: Vercel desplegará automáticamente al hacer push a main
2. **Deploy manual**: Desde el panel de Vercel, haz clic en "Deploy"

### 5. **Verificar Despliegue**

Una vez desplegado, tendrás una URL como: `https://tu-proyecto.vercel.app`

**Prueba estos endpoints:**
```
GET https://tu-proyecto.vercel.app/
GET https://tu-proyecto.vercel.app/health
GET https://tu-proyecto.vercel.app/api/products
POST https://tu-proyecto.vercel.app/auth/login
```

## 🔧 Configuración Adicional

### **Dominios Personalizados**
En Vercel → Settings → Domains, puedes agregar tu dominio personalizado.

### **Configurar CORS para Producción**
Actualiza el array de dominios permitidos en `index.js`:
```javascript
origin: [
  'https://tu-frontend.vercel.app',
  'https://tu-dominio.com',
  /\.vercel\.app$/
]
```

### **Monitoreo**
- **Logs**: Panel de Vercel → Functions → Ver logs
- **Analytics**: Panel de Vercel → Analytics
- **Performance**: Panel de Vercel → Speed Insights

## 🐛 Troubleshooting

### **Error: Module not found**
- Verificar que todas las dependencias estén en `package.json`
- Ejecutar `npm install` localmente

### **Error: Firebase connection**
- Verificar variables de entorno en Vercel
- Comprobar formato de `FIREBASE_PRIVATE_KEY`

### **Error: Timeout**
- Verificar que las funciones no excedan 30 segundos
- Optimizar consultas a Firebase

### **Error: CORS**
- Actualizar configuración de CORS con el dominio de Vercel
- Verificar headers permitidos

## 📊 URLs de Ejemplo

Después del despliegue:
```
API Base: https://tu-proyecto.vercel.app
Docs: https://tu-proyecto.vercel.app/
Health: https://tu-proyecto.vercel.app/health
Products: https://tu-proyecto.vercel.app/api/products
Auth: https://tu-proyecto.vercel.app/auth/login
```

## 🎯 Comandos Útiles

```bash
# Despliegue local de prueba
vercel dev

# Despliegue a preview
vercel

# Despliegue a producción
vercel --prod

# Ver logs
vercel logs

# Ver información del proyecto
vercel inspect
```

## ✅ Checklist de Despliegue

- [ ] Repositorio en GitHub creado
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Firebase funcionando en producción
- [ ] CORS configurado para dominio de Vercel
- [ ] Endpoints probados en producción
- [ ] Logs monitoreados
- [ ] Dominio personalizado configurado (opcional)

---

**¡Tu API estará disponible globalmente en minutos!** 🌍