# ⚡ Comandos Rápidos - Épica 2

## 🚀 Iniciar Proyecto

### Backend
```powershell
cd backend
npm run dev
```

### Frontend
```powershell
cd frontend
npm start
```

---

## 🌱 Poblar Base de Datos

```powershell
cd backend
node scripts/seedProducts.js
```

---

## 📦 Instalar Dependencias (Si es necesario)

### Backend
```powershell
cd backend
npm install
```

### Frontend
```powershell
cd frontend
npm install
```

---

## 🧪 URLs de Prueba

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API Products:** http://localhost:5000/api/products

---

## 🔑 Rutas del Sistema

### Públicas
- `/login` - Iniciar sesión
- `/register` - Registrar usuario

### Protegidas
- `/dashboard` - Panel principal
- `/productos` - Lista de productos
- `/productos/nuevo` - Crear producto
- `/productos/editar/:id` - Editar producto
- `/inventario` - Vista de inventario

---

## 📡 Endpoints API (Backend)

### GET
- `GET /api/products` - Todos los productos
- `GET /api/products/low-stock` - Stock bajo
- `GET /api/products/:id` - Un producto

### POST
- `POST /api/products` - Crear producto (admin)

### PUT
- `PUT /api/products/:id` - Actualizar producto

### DELETE
- `DELETE /api/products/:id` - Desactivar (admin)

### PATCH
- `PATCH /api/products/:id/stock` - Actualizar stock

---

## 🧹 Limpiar y Reiniciar

### Limpiar productos (MongoDB)
```javascript
// Ejecutar en MongoDB Compass o Mongo Shell
use tu_base_de_datos
db.products.deleteMany({})
```

### Volver a poblar
```powershell
cd backend
node scripts/seedProducts.js
```

---

## 🐛 Debugging

### Ver logs del backend
```powershell
cd backend
npm run dev
# Observar consola para errores
```

### Ver logs del frontend
- Abrir DevTools (F12)
- Ir a pestaña Console
- Buscar errores en rojo

### Verificar conexión MongoDB
- Revisar que MONGODB_URI esté en `.env`
- Verificar que MongoDB Atlas esté accesible

---

## 📝 Crear Usuarios de Prueba

Usar el endpoint de registro o crear directamente en MongoDB:

### Administrador
```json
{
  "nombre": "Admin Test",
  "email": "admin@test.com",
  "password": "123456",
  "rol": "administrador"
}
```

### Bodeguero
```json
{
  "nombre": "Bodeguero Test",
  "email": "bodeguero@test.com",
  "password": "123456",
  "rol": "bodeguero"
}
```

### Vendedor
```json
{
  "nombre": "Vendedor Test",
  "email": "vendedor@test.com",
  "password": "123456",
  "rol": "vendedor"
}
```

---

## 🔧 Variables de Entorno (.env)

```env
# Backend/.env
PORT=5000
MONGODB_URI=tu_mongodb_atlas_uri
JWT_SECRET=tu_secreto_seguro_aqui
```

---

## 📊 Verificar Estado

### Backend funcionando
- ✅ Terminal muestra: "Servidor corriendo en el puerto 5000"
- ✅ Terminal muestra: "MongoDB conectado exitosamente"

### Frontend funcionando
- ✅ Navegador abre automáticamente
- ✅ No hay errores en consola (F12)
- ✅ Página de login se muestra

### Base de datos poblada
- ✅ Script muestra: "Se insertaron X productos"
- ✅ Lista de productos muestra datos

---

## 🎯 Prueba Rápida (30 segundos)

1. **Login:** admin@test.com / 123456
2. **Dashboard:** Hacer clic en "📦 Gestión de Productos"
3. **Verificar:** Lista de productos aparece
4. **Buscar:** Escribir "ácido" en búsqueda
5. **Filtrar:** Seleccionar "Químicos"
6. ✅ **Si funciona:** ¡Todo está correcto!

---

## 📚 Documentación Relacionada

- `EPICA_2_COMPLETADA.md` - Documentación técnica completa
- `GUIA_PRUEBAS_EPICA2.md` - Manual de pruebas detallado
- `RESUMEN_EJECUTIVO_EPICA2.md` - Resumen ejecutivo

---

## 🆘 Solución de Problemas Comunes

### Error: Cannot connect to MongoDB
- Verificar MONGODB_URI en .env
- Verificar IP permitida en MongoDB Atlas
- Verificar conexión a internet

### Error: Port 5000 already in use
```powershell
# Encontrar y matar proceso en puerto 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: Token invalid
- Cerrar sesión
- Borrar localStorage en DevTools
- Login nuevamente

### Error: Module not found
```powershell
# Reinstalar dependencias
cd backend
rm -rf node_modules
npm install

cd frontend
rm -rf node_modules
npm install
```

---

## ✅ Checklist Rápido

Antes de probar:
- [ ] MongoDB Atlas configurado
- [ ] Variables .env creadas
- [ ] Dependencias instaladas (npm install)
- [ ] Base de datos poblada (seedProducts.js)
- [ ] Backend corriendo (puerto 5000)
- [ ] Frontend corriendo (puerto 3000)
- [ ] Usuarios de prueba creados

---

**¡Listo para probar!** 🚀
