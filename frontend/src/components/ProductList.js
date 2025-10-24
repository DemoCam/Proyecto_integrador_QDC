import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import './ProductList.css';

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [soloStockBajo, setSoloStockBajo] = useState(false);
  
  const navigate = useNavigate();
  
  // Categorías disponibles
  const categorias = ['Químicos', 'Solventes', 'Equipos', 'Insumos', 'Otros'];

  useEffect(() => {
    // Obtener datos del usuario
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    } else {
      navigate('/login');
    }
    
    cargarProductos();
  }, [navigate]);

  useEffect(() => {
    filtrarProductos();
  }, [productos, busqueda, categoriaFiltro, mostrarInactivos, soloStockBajo]);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      let data;
      if (soloStockBajo) {
        data = await productService.obtenerProductosStockBajo();
      } else {
        data = await productService.obtenerProductos({
          activo: !mostrarInactivos
        });
      }
      
      setProductos(data.productos);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  const filtrarProductos = () => {
    let resultado = [...productos];
    
    // Filtrar por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.codigo.toLowerCase().includes(busquedaLower) ||
        p.descripcion.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Filtrar por categoría
    if (categoriaFiltro) {
      resultado = resultado.filter(p => p.categoria === categoriaFiltro);
    }
    
    setProductosFiltrados(resultado);
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de desactivar el producto "${nombre}"?`)) {
      try {
        await productService.eliminarProducto(id);
        alert('Producto desactivado exitosamente');
        cargarProductos();
      } catch (err) {
        alert(err.message || 'Error al desactivar producto');
      }
    }
  };

  const handleEditar = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleNuevoProducto = () => {
    navigate('/productos/nuevo');
  };

  const handleVerInventario = () => {
    navigate('/inventario');
  };

  const esStockBajo = (producto) => {
    return producto.stock <= producto.stockMinimo;
  };

  const getEstadoStock = (producto) => {
    if (producto.stock === 0) return 'sin-stock';
    if (esStockBajo(producto)) return 'stock-bajo';
    return 'stock-normal';
  };

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Header */}
      <div className="product-list-header">
        <h2>📦 Gestión de Productos</h2>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={handleVerInventario}
          >
            📊 Ver Inventario
          </button>
          {usuario?.rol === 'administrador' && (
            <button 
              className="btn-primary" 
              onClick={handleNuevoProducto}
            >
              ➕ Nuevo Producto
            </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard')}
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, código o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-row">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={soloStockBajo}
              onChange={(e) => {
                setSoloStockBajo(e.target.checked);
                if (e.target.checked) {
                  cargarProductos();
                }
              }}
            />
            Solo stock bajo
          </label>
          
          {usuario?.rol === 'administrador' && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={mostrarInactivos}
                onChange={(e) => {
                  setMostrarInactivos(e.target.checked);
                  cargarProductos();
                }}
              />
              Mostrar inactivos
            </label>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total productos:</span>
          <span className="summary-value">{productosFiltrados.length}</span>
        </div>
        <div className="summary-card warning">
          <span className="summary-label">Stock bajo:</span>
          <span className="summary-value">
            {productosFiltrados.filter(p => esStockBajo(p) && p.stock > 0).length}
          </span>
        </div>
        <div className="summary-card danger">
          <span className="summary-label">Sin stock:</span>
          <span className="summary-value">
            {productosFiltrados.filter(p => p.stock === 0).length}
          </span>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="table-container">
        {productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Mín.</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(producto => (
                <tr 
                  key={producto._id} 
                  className={`${!producto.activo ? 'inactive-row' : ''} ${getEstadoStock(producto)}`}
                >
                  <td className="codigo-cell">{producto.codigo}</td>
                  <td>
                    <div className="product-name">
                      {producto.nombre}
                      {!producto.activo && <span className="badge-inactive">Inactivo</span>}
                    </div>
                  </td>
                  <td>{producto.categoria}</td>
                  <td className="precio-cell">
                    ${producto.precio.toLocaleString('es-CO')}
                  </td>
                  <td className={`stock-cell ${getEstadoStock(producto)}`}>
                    <span className="stock-badge">
                      {producto.stock}
                    </span>
                    {esStockBajo(producto) && producto.stock > 0 && (
                      <span className="warning-icon" title="Stock bajo">⚠️</span>
                    )}
                    {producto.stock === 0 && (
                      <span className="danger-icon" title="Sin stock">❌</span>
                    )}
                  </td>
                  <td>{producto.stockMinimo}</td>
                  <td>{producto.unidadMedida}</td>
                  <td>
                    {producto.activo ? (
                      <span className="badge-active">Activo</span>
                    ) : (
                      <span className="badge-inactive">Inactivo</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {(usuario?.rol === 'administrador' || usuario?.rol === 'bodeguero') && (
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEditar(producto._id)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}
                    {usuario?.rol === 'administrador' && producto.activo && (
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleEliminar(producto._id, producto.nombre)}
                        title="Desactivar"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductList;
