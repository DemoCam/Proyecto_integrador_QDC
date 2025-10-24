import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';
import './ProductForm.css';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    categoria: 'Otros',
    unidadMedida: 'Unidad',
    proveedor: '',
    activo: true
  });
  
  const [erroresValidacion, setErroresValidacion] = useState({});
  
  // Categorías y unidades disponibles
  const categorias = ['Químicos', 'Solventes', 'Equipos', 'Insumos', 'Otros'];
  const unidadesMedida = ['Kg', 'L', 'Unidad', 'Galón', 'Libra', 'Metro', 'Caja', 'Otro'];

  useEffect(() => {
    // Verificar autenticación y permisos
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(usuarioData);
    setUsuario(user);
    
    // Si es edición y es bodeguero, solo puede editar stock
    if (id) {
      setModoEdicion(true);
      cargarProducto();
    }
  }, [id, navigate]);

  const cargarProducto = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const data = await productService.obtenerProductoPorId(id);
      
      setFormData({
        nombre: data.producto.nombre,
        descripcion: data.producto.descripcion || '',
        codigo: data.producto.codigo,
        precio: data.producto.precio,
        stock: data.producto.stock,
        stockMinimo: data.producto.stockMinimo,
        categoria: data.producto.categoria,
        unidadMedida: data.producto.unidadMedida,
        proveedor: data.producto.proveedor || '',
        activo: data.producto.activo
      });
    } catch (err) {
      setError(err.message || 'Error al cargar producto');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error de validación del campo
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validarFormulario = () => {
    const errores = {};
    
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre es requerido';
    }
    
    if (!formData.codigo.trim()) {
      errores.codigo = 'El código es requerido';
    }
    
    if (!formData.precio || formData.precio <= 0) {
      errores.precio = 'El precio debe ser mayor a 0';
    }
    
    if (formData.stock === '' || formData.stock < 0) {
      errores.stock = 'El stock no puede ser negativo';
    }
    
    if (formData.stockMinimo === '' || formData.stockMinimo < 0) {
      errores.stockMinimo = 'El stock mínimo no puede ser negativo';
    }
    
    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si es bodeguero en modo edición, solo actualiza stock
    if (usuario?.rol === 'bodeguero' && modoEdicion) {
      return handleActualizarStockBodeguero();
    }
    
    // Validar formulario
    if (!validarFormulario()) {
      return;
    }
    
    try {
      setCargando(true);
      setError(null);
      
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo)
      };
      
      if (modoEdicion) {
        await productService.actualizarProducto(id, productoData);
        alert('Producto actualizado exitosamente');
      } else {
        await productService.crearProducto(productoData);
        alert('Producto creado exitosamente');
      }
      
      navigate('/productos');
    } catch (err) {
      setError(err.message || 'Error al guardar producto');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarStockBodeguero = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const stockData = {
        stock: parseInt(formData.stock)
      };
      
      await productService.actualizarProducto(id, stockData);
      alert('Stock actualizado exitosamente');
      navigate('/productos');
    } catch (err) {
      setError(err.message || 'Error al actualizar stock');
    } finally {
      setCargando(false);
    }
  };

  const esBodeguero = usuario?.rol === 'bodeguero';
  const esAdmin = usuario?.rol === 'administrador';
  const soloLectura = modoEdicion && esBodeguero;

  if (cargando && modoEdicion) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      {/* Header */}
      <div className="form-header">
        <h2>
          {modoEdicion 
            ? esBodeguero 
              ? '📦 Actualizar Stock' 
              : '✏️ Editar Producto'
            : '➕ Nuevo Producto'
          }
        </h2>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/productos')}
        >
          ← Volver
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {esBodeguero && modoEdicion && (
        <div className="alert alert-info">
          ℹ️ Como bodeguero, solo puedes actualizar el stock del producto
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Información básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="codigo">Código del Producto *</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                disabled={soloLectura || modoEdicion}
                className={erroresValidacion.codigo ? 'error' : ''}
                placeholder="Ej: QUI-001"
              />
              {erroresValidacion.codigo && (
                <span className="error-message">{erroresValidacion.codigo}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={soloLectura}
                className={erroresValidacion.nombre ? 'error' : ''}
                placeholder="Ej: Ácido Sulfúrico"
              />
              {erroresValidacion.nombre && (
                <span className="error-message">{erroresValidacion.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={soloLectura}
                rows="3"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoría *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={soloLectura}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="proveedor">Proveedor</label>
                <input
                  type="text"
                  id="proveedor"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  disabled={soloLectura}
                  placeholder="Nombre del proveedor"
                />
              </div>
            </div>
          </div>

          {/* Precio e inventario */}
          <div className="form-section">
            <h3>Precio e Inventario</h3>
            
            <div className="form-group">
              <label htmlFor="precio">Precio (COP) *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                disabled={soloLectura}
                className={erroresValidacion.precio ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {erroresValidacion.precio && (
                <span className="error-message">{erroresValidacion.precio}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock Actual *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={erroresValidacion.stock ? 'error' : ''}
                  placeholder="0"
                  min="0"
                />
                {erroresValidacion.stock && (
                  <span className="error-message">{erroresValidacion.stock}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="stockMinimo">Stock Mínimo *</label>
                <input
                  type="number"
                  id="stockMinimo"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  disabled={soloLectura}
                  className={erroresValidacion.stockMinimo ? 'error' : ''}
                  placeholder="10"
                  min="0"
                />
                {erroresValidacion.stockMinimo && (
                  <span className="error-message">{erroresValidacion.stockMinimo}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="unidadMedida">Unidad de Medida *</label>
              <select
                id="unidadMedida"
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                disabled={soloLectura}
              >
                {unidadesMedida.map(unidad => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              </select>
            </div>

            {esAdmin && modoEdicion && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  Producto activo
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/productos')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
