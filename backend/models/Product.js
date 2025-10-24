const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  codigo: {
    type: String,
    required: [true, 'El código del producto es requerido'],
    unique: true,
    uppercase: true,
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  stockMinimo: {
    type: Number,
    required: [true, 'El stock mínimo es requerido'],
    min: [0, 'El stock mínimo no puede ser negativo'],
    default: 10
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['Químicos', 'Solventes', 'Equipos', 'Insumos', 'Otros'],
    default: 'Otros'
  },
  unidadMedida: {
    type: String,
    required: [true, 'La unidad de medida es requerida'],
    enum: ['Kg', 'L', 'Unidad', 'Galón', 'Libra', 'Metro', 'Caja', 'Otro'],
    default: 'Unidad'
  },
  proveedor: {
    type: String,
    trim: true,
    default: ''
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// Método para verificar si el stock está bajo
productSchema.methods.esBajoStock = function() {
  return this.stock <= this.stockMinimo;
};

// Middleware para actualizar fechaActualizacion antes de guardar
productSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Índices para mejorar las búsquedas
productSchema.index({ nombre: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1 });
productSchema.index({ stock: 1 });

module.exports = mongoose.model('Product', productSchema);
