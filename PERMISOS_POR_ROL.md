# 🔐 Permisos por Rol - Sistema Químicos del Cauca

## Roles del Sistema

### 👨‍💼 Administrador
**Acceso Completo** - 4 Paneles visibles

✅ **Gestión de Productos**
- Ver catálogo de productos
- Agregar nuevos productos
- Editar información de productos
- Eliminar productos
- Gestionar precios

✅ **Gestión de Pedidos**
- Ver todos los pedidos del sistema
- Crear pedidos
- Editar pedidos
- Cancelar pedidos
- Ver historial completo

✅ **Reportes e Inventario**
- Ver estadísticas generales
- Reportes de ventas
- Estado del inventario en tiempo real
- Análisis de datos
- Exportar reportes

✅ **Gestión de Usuarios**
- Ver lista de usuarios
- Crear nuevos usuarios
- Editar usuarios existentes
- Desactivar/Activar usuarios
- Asignar roles

---

### 🛒 Vendedor
**Acceso Limitado** - 2 Paneles visibles

✅ **Gestión de Productos**
- Ver catálogo de productos
- Consultar precios
- Ver disponibilidad

✅ **Gestión de Pedidos**
- Crear nuevos pedidos
- Ver sus propios pedidos
- Editar pedidos pendientes
- Ver estado de pedidos

❌ **Reportes e Inventario** - NO visible
❌ **Gestión de Usuarios** - NO visible

---

### 📦 Bodeguero
**Acceso Limitado** - 2 Paneles visibles

✅ **Gestión de Productos**
- Ver catálogo de productos
- Actualizar inventario
- Verificar stock

✅ **Gestión de Pedidos**
- Ver pedidos asignados
- Actualizar estado de pedidos
- Marcar pedidos como completados
- Gestionar entregas

❌ **Reportes e Inventario** - NO visible
❌ **Gestión de Usuarios** - NO visible

---

## 📊 Comparativa de Permisos

| Funcionalidad | Administrador | Vendedor | Bodeguero |
|--------------|---------------|----------|-----------|
| **Gestión de Productos** | ✅ Total | ✅ Solo lectura | ✅ Actualizar stock |
| **Gestión de Pedidos** | ✅ Todos | ✅ Crear y ver propios | ✅ Procesar |
| **Reportes e Inventario** | ✅ Sí | ❌ No | ❌ No |
| **Gestión de Usuarios** | ✅ Sí | ❌ No | ❌ No |

---

## 🎯 Implementación en el Código

### Dashboard.js - Control de Visibilidad

```javascript
// ✅ Visible para TODOS los roles
<div className="dashboard-card">
  <h3>Gestión de Productos</h3>
</div>

<div className="dashboard-card">
  <h3>Gestión de Pedidos</h3>
</div>

// ✅ Visible SOLO para administradores
{usuario.rol === 'administrador' && (
  <div className="dashboard-card">
    <h3>Reportes e Inventario</h3>
  </div>
)}

{usuario.rol === 'administrador' && (
  <div className="dashboard-card">
    <h3>Gestión de Usuarios</h3>
  </div>
)}
```

---

## 🔒 Seguridad por Capas

### 1. Frontend (Dashboard.js)
- Oculta visualmente los paneles según el rol
- Mejora la experiencia de usuario
- NO es seguridad real (puede bypassearse)

### 2. Backend (Próximo Sprint)
- Validación de permisos en cada endpoint
- Middleware de autorización por rol
- Seguridad real del sistema

```javascript
// Ejemplo futuro de middleware de autorización
const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción' 
      });
    }
    next();
  };
};

// Ruta protegida solo para administradores
router.get('/usuarios', auth, checkRole(['administrador']), getUsuarios);
```

---

## 🧪 Pruebas de Permisos

### Para probar los diferentes roles:

1. **Registra 3 usuarios diferentes:**
   - Email: admin@test.com - Rol: Administrador
   - Email: vendedor@test.com - Rol: Vendedor
   - Email: bodeguero@test.com - Rol: Bodeguero

2. **Inicia sesión con cada uno:**
   - Verifica que el administrador vea 4 paneles
   - Verifica que vendedor y bodeguero vean solo 2 paneles

3. **Observa el mensaje personalizado:**
   - Cada rol muestra un mensaje diferente según sus permisos

---

## 📝 Notas Importantes

⚠️ **Seguridad Frontend vs Backend:**
- El frontend oculta visualmente los paneles
- El backend DEBE validar permisos en cada petición
- Nunca confíes solo en la validación del frontend

✅ **Buenas Prácticas:**
- Validar rol en cada acción importante
- Registrar intentos de acceso no autorizados
- Mantener roles consistentes entre frontend y backend

---

**Estado Actual:** Sprint 1 - Control visual de paneles ✅
**Próximo Sprint:** Validación de permisos en backend
