import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import './InventoryView.css';

function InventoryView() {
  const [productos, setProductos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    valorTotalInventario: 0,
    productosSinStock: 0,
    productosStockBajo: 0,
    productosPorCategoria: {}
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    } else {
      navigate('/login');
    }
    
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Cargar todos los productos y productos con stock bajo
      const [dataProductos, dataStockBajo] = await Promise.all([
        productService.obtenerProductos({ activo: true }),
        productService.obtenerProductosStockBajo()
      ]);
      
      setProductos(dataProductos.productos);
      setProductosStockBajo(dataStockBajo.productos);
      
      // Calcular estadísticas
      calcularEstadisticas(dataProductos.productos);
    } catch (err) {
      setError(err.message || 'Error al cargar datos del inventario');
    } finally {
      setCargando(false);
    }
  };

  const calcularEstadisticas = (productos) => {
    const stats = {
      totalProductos: productos.length,
      valorTotalInventario: 0,
      productosSinStock: 0,
      productosStockBajo: 0,
      productosPorCategoria: {}
    };
    
    productos.forEach(producto => {
      // Valor total del inventario
      stats.valorTotalInventario += producto.precio * producto.stock;
      
      // Productos sin stock
      if (producto.stock === 0) {
        stats.productosSinStock++;
      }
      
      // Productos con stock bajo
      if (producto.stock > 0 && producto.stock <= producto.stockMinimo) {
        stats.productosStockBajo++;
      }
      
      // Productos por categoría
      if (!stats.productosPorCategoria[producto.categoria]) {
        stats.productosPorCategoria[producto.categoria] = {
          cantidad: 0,
          valorTotal: 0
        };
      }
      stats.productosPorCategoria[producto.categoria].cantidad++;
      stats.productosPorCategoria[producto.categoria].valorTotal += 
        producto.precio * producto.stock;
    });
    
    setEstadisticas(stats);
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="inventory-view-container">
      {/* Header */}
      <div className="inventory-header">
        <h2>📊 Vista de Inventario</h2>
        <div className="header-actions">
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/productos')}
          >
            📦 Ver Productos
          </button>
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

      {/* Alertas de stock */}
      {estadisticas.productosSinStock > 0 && (
        <div className="alert alert-danger">
          ❌ <strong>Atención:</strong> Hay {estadisticas.productosSinStock} producto(s) sin stock
        </div>
      )}

      {estadisticas.productosStockBajo > 0 && (
        <div className="alert alert-warning">
          ⚠️ <strong>Alerta:</strong> Hay {estadisticas.productosStockBajo} producto(s) con stock bajo
        </div>
      )}

      {/* Tarjetas de estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{estadisticas.totalProductos}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Valor Total Inventario</div>
            <div className="stat-value">
              {formatearMoneda(estadisticas.valorTotalInventario)}
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">Stock Bajo</div>
            <div className="stat-value">{estadisticas.productosStockBajo}</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-label">Sin Stock</div>
            <div className="stat-value">{estadisticas.productosSinStock}</div>
          </div>
        </div>
      </div>

      {/* Productos por categoría */}
      <div className="section">
        <h3>📋 Inventario por Categoría</h3>
        <div className="category-grid">
          {Object.entries(estadisticas.productosPorCategoria).map(([categoria, datos]) => (
            <div key={categoria} className="category-card">
              <div className="category-header">
                <h4>{categoria}</h4>
                <span className="category-count">{datos.cantidad} productos</span>
              </div>
              <div className="category-value">
                Valor: {formatearMoneda(datos.valorTotal)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productos con stock bajo */}
      {productosStockBajo.length > 0 && (
        <div className="section">
          <h3>⚠️ Productos con Stock Bajo o Agotado</h3>
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosStockBajo.map(producto => (
                  <tr 
                    key={producto._id}
                    className={producto.stock === 0 ? 'sin-stock' : 'stock-bajo'}
                  >
                    <td className="codigo-cell">{producto.codigo}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td className="stock-cell">
                      <span className={`stock-badge ${producto.stock === 0 ? 'danger' : 'warning'}`}>
                        {producto.stock} {producto.unidadMedida}
                      </span>
                    </td>
                    <td>{producto.stockMinimo}</td>
                    <td>
                      {producto.stock === 0 ? (
                        <span className="badge-danger">Sin Stock ❌</span>
                      ) : (
                        <span className="badge-warning">Stock Bajo ⚠️</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {(usuario?.rol === 'administrador' || usuario?.rol === 'bodeguero') && (
                        <button
                          className="btn-action btn-edit"
                          onClick={() => navigate(`/productos/editar/${producto._id}`)}
                          title="Actualizar stock"
                        >
                          ✏️ Actualizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top 10 productos con más stock */}
      <div className="section">
        <h3>📈 Top 10 - Mayor Stock</h3>
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 10)
                .map((producto, index) => (
                  <tr key={producto._id}>
                    <td className="position-cell">
                      <span className="position-badge">#{index + 1}</span>
                    </td>
                    <td className="codigo-cell">{producto.codigo}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td className="stock-cell">
                      <span className="stock-badge success">
                        {producto.stock} {producto.unidadMedida}
                      </span>
                    </td>
                    <td className="value-cell">
                      {formatearMoneda(producto.precio * producto.stock)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 10 productos con mayor valor */}
      <div className="section">
        <h3>💎 Top 10 - Mayor Valor en Inventario</h3>
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio Unitario</th>
                <th>Stock</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .sort((a, b) => (b.precio * b.stock) - (a.precio * a.stock))
                .slice(0, 10)
                .map((producto, index) => (
                  <tr key={producto._id}>
                    <td className="position-cell">
                      <span className="position-badge">#{index + 1}</span>
                    </td>
                    <td className="codigo-cell">{producto.codigo}</td>
                    <td>{producto.nombre}</td>
                    <td className="value-cell">
                      {formatearMoneda(producto.precio)}
                    </td>
                    <td>{producto.stock} {producto.unidadMedida}</td>
                    <td className="value-cell highlight">
                      {formatearMoneda(producto.precio * producto.stock)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryView;
