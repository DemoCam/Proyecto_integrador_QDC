# 🧪 Guía de Pruebas - Épica 2: Gestión de Productos e Inventario

## 📋 Prerequisitos

Antes de comenzar las pruebas, asegúrate de tener:

1. ✅ MongoDB Atlas configurado y conexión activa
2. ✅ Backend corriendo en `http://localhost:5000`
3. ✅ Frontend corriendo en `http://localhost:3000`
4. ✅ Al menos un usuario de cada rol creado (administrador, bodeguero, vendedor)

---

## 🚀 Iniciar la Aplicación

### 1. Iniciar el Backend
```powershell
cd backend
npm run dev
```

**Verificar:** Debe mostrar `Servidor corriendo en el puerto 5000` y `MongoDB conectado exitosamente`

### 2. Poblar Base de Datos (Opcional - Primera vez)
```powershell
cd backend
node scripts/seedProducts.js
```

Este script creará 15 productos de ejemplo con diferentes estados de stock.

### 3. Iniciar el Frontend
```powershell
cd frontend
npm start
```

**Verificar:** El navegador debe abrir automáticamente en `http://localhost:3000`

---

## 👨‍💼 Pruebas como ADMINISTRADOR

### Escenario 1: Ver Lista de Productos

1. **Login** con usuario administrador
2. En el Dashboard, hacer clic en **"📦 Gestión de Productos"**
3. **Verificar:**
   - ✅ Se muestra lista de todos los productos
   - ✅ Aparecen tarjetas de resumen (Total, Stock Bajo, Sin Stock)
   - ✅ Productos con stock bajo tienen fondo amarillo
   - ✅ Productos sin stock tienen fondo rojo
   - ✅ Iconos de alerta (⚠️ y ❌) visibles en productos críticos

### Escenario 2: Buscar y Filtrar Productos

1. En la lista de productos:
   
   **Prueba A - Búsqueda por texto:**
   - Escribir "ácido" en el cuadro de búsqueda
   - ✅ Deben aparecer solo productos que contengan "ácido" en nombre, código o descripción
   
   **Prueba B - Filtro por categoría:**
   - Seleccionar "Químicos" en el dropdown de categoría
   - ✅ Deben mostrarse solo productos de categoría Químicos
   
   **Prueba C - Solo stock bajo:**
   - Marcar checkbox "Solo stock bajo"
   - ✅ Deben aparecer solo productos con stock ≤ stock mínimo
   
   **Prueba D - Mostrar inactivos:**
   - Marcar checkbox "Mostrar inactivos"
   - ✅ Deben aparecer productos desactivados con badge "Inactivo"

### Escenario 3: Crear Nuevo Producto

1. Hacer clic en **"➕ Nuevo Producto"**
2. **Llenar el formulario:**
   ```
   Código: TEST-001
   Nombre: Producto de Prueba
   Descripción: Este es un producto de prueba
   Precio: 50000
   Stock Actual: 100
   Stock Mínimo: 20
   Categoría: Otros
   Unidad de Medida: Unidad
   Proveedor: Proveedor Test
   ```
3. Hacer clic en **"Crear Producto"**
4. **Verificar:**
   - ✅ Mensaje "Producto creado exitosamente"
   - ✅ Redirección a lista de productos
   - ✅ Nuevo producto aparece en la lista

### Escenario 4: Editar Producto Completo

1. En la lista, hacer clic en **✏️** del producto recién creado
2. **Modificar campos:**
   - Cambiar precio a: 55000
   - Cambiar stock a: 150
   - Cambiar descripción
3. Hacer clic en **"Actualizar"**
4. **Verificar:**
   - ✅ Mensaje "Producto actualizado exitosamente"
   - ✅ Cambios reflejados en la lista

### Escenario 5: Desactivar Producto

1. En la lista, hacer clic en **🗑️** del producto TEST-001
2. Confirmar en el diálogo
3. **Verificar:**
   - ✅ Mensaje "Producto desactivado exitosamente"
   - ✅ Producto ya no aparece en lista (a menos que "Mostrar inactivos" esté marcado)

### Escenario 6: Ver Inventario Completo

1. Hacer clic en **"📊 Ver Inventario"** o desde Dashboard
2. **Verificar vista de inventario:**
   - ✅ 4 tarjetas de estadísticas principales (Total, Valor Total, Stock Bajo, Sin Stock)
   - ✅ Sección "Inventario por Categoría" con todas las categorías
   - ✅ Alertas rojas/amarillas si hay productos críticos
   - ✅ Tabla "Productos con Stock Bajo o Agotado"
   - ✅ Tabla "Top 10 - Mayor Stock"
   - ✅ Tabla "Top 10 - Mayor Valor en Inventario"

### Escenario 7: Actualizar Stock desde Inventario

1. En la vista de inventario, tabla "Productos con Stock Bajo"
2. Hacer clic en **"✏️ Actualizar"** de un producto sin stock
3. Cambiar el stock a un valor positivo
4. Guardar
5. **Verificar:**
   - ✅ Stock actualizado
   - ✅ Producto sale de la lista de "sin stock"
   - ✅ Estadísticas se actualizan

---

## 📦 Pruebas como BODEGUERO

### Escenario 1: Ver Lista de Productos

1. **Login** con usuario bodeguero
2. Ir a **"📦 Gestión de Productos"**
3. **Verificar:**
   - ✅ Se ve lista completa de productos
   - ✅ Botón "➕ Nuevo Producto" NO aparece
   - ✅ Botón 🗑️ NO aparece en productos
   - ✅ Solo aparece botón ✏️ para editar

### Escenario 2: Actualizar Solo Stock

1. Hacer clic en **✏️** de cualquier producto
2. **Verificar:**
   - ✅ Aparece alerta azul: "Como bodeguero, solo puedes actualizar el stock"
   - ✅ Solo el campo "Stock Actual" está habilitado
   - ✅ Todos los demás campos están deshabilitados (gris)
3. Cambiar el valor de stock
4. Hacer clic en **"Actualizar"**
5. **Verificar:**
   - ✅ Stock actualizado correctamente
   - ✅ Mensaje de éxito

### Escenario 3: Intentar Crear Producto

1. **Verificar:**
   - ✅ NO existe botón "Nuevo Producto" en la interfaz
   - ✅ No puede acceder a `/productos/nuevo` directamente

### Escenario 4: Vista de Inventario

1. Intentar acceder a "Reportes e Inventario" desde Dashboard
2. **Verificar:**
   - ✅ Esta opción NO aparece en el Dashboard del bodeguero
   - ✅ Puede usar filtro "Solo stock bajo" para ver productos críticos

---

## 🛒 Pruebas como VENDEDOR

### Escenario 1: Ver Productos (Solo Lectura)

1. **Login** con usuario vendedor
2. Ir a **"📦 Gestión de Productos"**
3. **Verificar:**
   - ✅ Se ve lista completa de productos
   - ✅ NO aparece botón "➕ Nuevo Producto"
   - ✅ NO aparece botón ✏️ en productos
   - ✅ NO aparece botón 🗑️ en productos
   - ✅ Columna "Acciones" vacía o no visible

### Escenario 2: Buscar y Filtrar para Consulta

1. Buscar productos por nombre
2. Filtrar por categoría
3. **Verificar:**
   - ✅ Puede ver toda la información (precio, stock, categoría)
   - ✅ Puede usar todos los filtros
   - ✅ NO puede modificar nada

### Escenario 3: Vista de Inventario

1. Intentar acceder a "Reportes e Inventario"
2. **Verificar:**
   - ✅ Esta opción NO aparece en el Dashboard del vendedor

---

## 🔍 Pruebas de Validación y Errores

### Validación de Formulario (Admin)

1. Intentar crear producto sin llenar campos obligatorios:
   - ✅ Debe mostrar mensajes de error en rojo debajo de cada campo
   - ✅ No debe permitir guardar

2. Intentar crear producto con código duplicado:
   - ✅ Debe mostrar error "Ya existe un producto con ese código"

3. Intentar poner precio negativo:
   - ✅ Campo no debe permitir valores negativos

4. Intentar poner stock negativo:
   - ✅ Campo no debe permitir valores negativos

### Seguridad de Permisos

1. **Como vendedor o bodeguero**, intentar acceder directamente a:
   - `/productos/nuevo`
   - **Verificar:** Debe redirigir o mostrar error

2. **Como bodeguero**, intentar eliminar producto desde la API:
   - **Verificar:** Debe retornar error 403 (Forbidden)

---

## 📊 Casos de Prueba de Stock

### Stock Bajo - Alertas Visuales

1. **Crear o editar producto con:**
   - Stock: 10
   - Stock Mínimo: 10
2. **Verificar:**
   - ✅ Fondo amarillo en la fila
   - ✅ Icono ⚠️ visible
   - ✅ Badge amarillo "Stock Bajo"
   - ✅ Aparece en sección "Productos con Stock Bajo"

### Sin Stock - Alertas Visuales

1. **Crear o editar producto con:**
   - Stock: 0
2. **Verificar:**
   - ✅ Fondo rojo en la fila
   - ✅ Icono ❌ visible
   - ✅ Badge rojo "Sin Stock"
   - ✅ Aparece en contador "Sin Stock"
   - ✅ Alerta roja en vista de inventario

### Stock Normal

1. **Producto con:**
   - Stock: 50
   - Stock Mínimo: 10
2. **Verificar:**
   - ✅ Fondo blanco normal
   - ✅ Badge verde "Stock Normal"
   - ✅ Sin iconos de alerta

---

## 🎨 Pruebas de Diseño Responsivo

### Escritorio (> 1024px)
- ✅ Tarjetas en grid de 3-4 columnas
- ✅ Tabla visible completamente
- ✅ Sidebar y contenido lado a lado

### Tablet (768px - 1024px)
- ✅ Tarjetas en grid de 2 columnas
- ✅ Tabla con scroll horizontal si es necesario
- ✅ Botones apilados correctamente

### Móvil (< 768px)
- ✅ Tarjetas en 1 columna
- ✅ Tabla con scroll horizontal
- ✅ Filtros apilados verticalmente
- ✅ Botones ocupan ancho completo

---

## 🐛 Checklist de Bugs Comunes

### Backend
- [ ] ¿El servidor responde en puerto 5000?
- [ ] ¿MongoDB está conectado?
- [ ] ¿Las variables de entorno están configuradas (.env)?
- [ ] ¿El token JWT es válido?

### Frontend
- [ ] ¿El frontend se conecta a http://localhost:5000?
- [ ] ¿El token se guarda en localStorage?
- [ ] ¿Los componentes se importan correctamente?
- [ ] ¿Las rutas están definidas en App.js?

### Datos
- [ ] ¿Existen usuarios de prueba?
- [ ] ¿Hay productos en la base de datos?
- [ ] ¿Los productos tienen stock variado (normal, bajo, cero)?

---

## ✅ Checklist General de Funcionalidad

### Gestión de Productos
- [ ] Listar todos los productos
- [ ] Buscar productos por texto
- [ ] Filtrar por categoría
- [ ] Filtrar solo stock bajo
- [ ] Crear nuevo producto (admin)
- [ ] Editar producto completo (admin)
- [ ] Editar solo stock (bodeguero)
- [ ] Desactivar producto (admin)
- [ ] Ver detalles de un producto

### Vista de Inventario
- [ ] Estadísticas generales
- [ ] Valor total del inventario
- [ ] Productos por categoría
- [ ] Alertas de stock bajo/agotado
- [ ] Top 10 mayor stock
- [ ] Top 10 mayor valor
- [ ] Navegación entre vistas

### Seguridad y Permisos
- [ ] Solo admin puede crear productos
- [ ] Solo admin puede eliminar productos
- [ ] Admin puede editar todo
- [ ] Bodeguero solo puede editar stock
- [ ] Vendedor solo puede ver
- [ ] Tokens JWT válidos
- [ ] Rutas protegidas funcionan

### UX/UI
- [ ] Interfaz intuitiva y clara
- [ ] Alertas visuales funcionan
- [ ] Mensajes de éxito/error
- [ ] Diseño responsivo
- [ ] Carga rápida
- [ ] Sin errores en consola

---

## 📸 Capturas de Pantalla Sugeridas

Para documentar las pruebas, toma capturas de:

1. **Dashboard** con los 4 módulos
2. **Lista de productos** con filtros aplicados
3. **Formulario de nuevo producto** completo
4. **Vista de inventario** con todas las secciones
5. **Alertas de stock bajo** visibles
6. **Producto sin stock** con fondo rojo
7. **Vista móvil** responsiva

---

## 🎉 Prueba Completada

Si todos los escenarios pasan exitosamente, la **Épica 2** está completamente funcional y lista para producción.

**Próximo paso:** Iniciar desarrollo de Épica 3 (Gestión de Pedidos)

---

## 💡 Tips para Testing

1. **Usar diferentes navegadores:** Chrome, Firefox, Edge
2. **Limpiar caché** si algo no se actualiza
3. **Verificar consola del navegador** para errores JavaScript
4. **Verificar consola del backend** para errores de servidor
5. **Usar React DevTools** para debug de componentes
6. **Usar Postman** para probar endpoints de API directamente

---

**¡Feliz Testing!** 🚀
