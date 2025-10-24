const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// ============================================
// RUTAS PÚBLICAS PARA USUARIOS AUTENTICADOS
// ============================================

/**
 * GET /api/products
 * Obtener todos los productos
 * Acceso: Todos los roles autenticados
 */
router.get('/', auth, async (req, res) => {
  try {
    const { categoria, busqueda, activo } = req.query;
    
    // Construir filtro de búsqueda
    let filtro = {};
    
    if (categoria) {
      filtro.categoria = categoria;
    }
    
    if (activo !== undefined) {
      filtro.activo = activo === 'true';
    }
    
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
        { codigo: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    const productos = await Product.find(filtro).sort({ nombre: 1 });
    
    res.json({
      success: true,
      cantidad: productos.length,
      productos
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los productos',
      detalle: error.message 
    });
  }
});

/**
 * GET /api/products/low-stock
 * Obtener productos con stock bajo
 * Acceso: Todos los roles autenticados
 */
router.get('/low-stock', auth, async (req, res) => {
  try {
    const productos = await Product.find({ 
      activo: true,
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    }).sort({ stock: 1 });
    
    res.json({
      success: true,
      cantidad: productos.length,
      productos
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos con stock bajo',
      detalle: error.message 
    });
  }
});

/**
 * GET /api/products/:id
 * Obtener un producto por ID
 * Acceso: Todos los roles autenticados
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      error: 'Error al obtener el producto',
      detalle: error.message 
    });
  }
});

// ============================================
// RUTAS PROTEGIDAS SOLO PARA ADMINISTRADOR
// ============================================

/**
 * POST /api/products
 * Crear un nuevo producto
 * Acceso: Solo administrador
 */
router.post('/', auth, authorize(['administrador']), async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      codigo, 
      precio, 
      stock, 
      stockMinimo, 
      categoria, 
      unidadMedida, 
      proveedor 
    } = req.body;
    
    // Validar campos obligatorios
    if (!nombre || !codigo || precio === undefined) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios: nombre, código y precio son requeridos' 
      });
    }
    
    // Verificar si el código ya existe
    const productoExistente = await Product.findOne({ codigo: codigo.toUpperCase() });
    if (productoExistente) {
      return res.status(400).json({ 
        error: 'Ya existe un producto con ese código' 
      });
    }
    
    // Crear nuevo producto
    const nuevoProducto = new Product({
      nombre,
      descripcion,
      codigo: codigo.toUpperCase(),
      precio,
      stock: stock || 0,
      stockMinimo: stockMinimo || 10,
      categoria: categoria || 'Otros',
      unidadMedida: unidadMedida || 'Unidad',
      proveedor
    });
    
    await nuevoProducto.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al crear el producto',
      detalle: error.message 
    });
  }
});

/**
 * DELETE /api/products/:id
 * Eliminar un producto (desactivar)
 * Acceso: Solo administrador
 */
router.delete('/:id', auth, authorize(['administrador']), async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }
    
    // Desactivar en lugar de eliminar (soft delete)
    producto.activo = false;
    await producto.save();
    
    res.json({
      success: true,
      mensaje: 'Producto desactivado exitosamente',
      producto
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el producto',
      detalle: error.message 
    });
  }
});

// ============================================
// RUTAS PROTEGIDAS PARA ADMIN Y BODEGUERO
// ============================================

/**
 * PUT /api/products/:id
 * Actualizar un producto
 * Acceso: Administrador (puede editar todo) y Bodeguero (solo stock)
 */
router.put('/:id', auth, authorize(['administrador', 'bodeguero']), async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }
    
    // Si es bodeguero, solo puede actualizar stock
    if (req.userRole === 'bodeguero') {
      const { stock } = req.body;
      
      if (stock === undefined) {
        return res.status(400).json({ 
          error: 'Debe proporcionar el valor de stock a actualizar' 
        });
      }
      
      if (stock < 0) {
        return res.status(400).json({ 
          error: 'El stock no puede ser negativo' 
        });
      }
      
      producto.stock = stock;
      producto.fechaActualizacion = Date.now();
      
      await producto.save();
      
      return res.json({
        success: true,
        mensaje: 'Stock actualizado exitosamente',
        producto
      });
    }
    
    // Si es administrador, puede actualizar todos los campos
    if (req.userRole === 'administrador') {
      const { 
        nombre, 
        descripcion, 
        codigo, 
        precio, 
        stock, 
        stockMinimo, 
        categoria, 
        unidadMedida, 
        proveedor,
        activo 
      } = req.body;
      
      // Actualizar campos si se proporcionan
      if (nombre !== undefined) producto.nombre = nombre;
      if (descripcion !== undefined) producto.descripcion = descripcion;
      if (codigo !== undefined) {
        // Verificar si el nuevo código ya existe
        const codigoExistente = await Product.findOne({ 
          codigo: codigo.toUpperCase(),
          _id: { $ne: req.params.id }
        });
        if (codigoExistente) {
          return res.status(400).json({ 
            error: 'Ya existe otro producto con ese código' 
          });
        }
        producto.codigo = codigo.toUpperCase();
      }
      if (precio !== undefined) producto.precio = precio;
      if (stock !== undefined) producto.stock = stock;
      if (stockMinimo !== undefined) producto.stockMinimo = stockMinimo;
      if (categoria !== undefined) producto.categoria = categoria;
      if (unidadMedida !== undefined) producto.unidadMedida = unidadMedida;
      if (proveedor !== undefined) producto.proveedor = proveedor;
      if (activo !== undefined) producto.activo = activo;
      
      producto.fechaActualizacion = Date.now();
      
      await producto.save();
      
      return res.json({
        success: true,
        mensaje: 'Producto actualizado exitosamente',
        producto
      });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      detalle: error.message 
    });
  }
});

/**
 * PATCH /api/products/:id/stock
 * Actualizar solo el stock de un producto (para despachos)
 * Acceso: Administrador y Bodeguero
 */
router.patch('/:id/stock', auth, authorize(['administrador', 'bodeguero']), async (req, res) => {
  try {
    const { cantidad, operacion } = req.body;
    
    if (!cantidad || !operacion) {
      return res.status(400).json({ 
        error: 'Debe proporcionar cantidad y operación (sumar o restar)' 
      });
    }
    
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ 
        error: 'Producto no encontrado' 
      });
    }
    
    // Realizar operación sobre el stock
    if (operacion === 'sumar') {
      producto.stock += cantidad;
    } else if (operacion === 'restar') {
      if (producto.stock < cantidad) {
        return res.status(400).json({ 
          error: 'Stock insuficiente para realizar la operación',
          stockActual: producto.stock,
          cantidadSolicitada: cantidad
        });
      }
      producto.stock -= cantidad;
    } else {
      return res.status(400).json({ 
        error: 'Operación inválida. Use "sumar" o "restar"' 
      });
    }
    
    producto.fechaActualizacion = Date.now();
    await producto.save();
    
    res.json({
      success: true,
      mensaje: `Stock ${operacion === 'sumar' ? 'incrementado' : 'decrementado'} exitosamente`,
      producto
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el stock',
      detalle: error.message 
    });
  }
});

module.exports = router;
