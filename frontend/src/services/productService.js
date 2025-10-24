const API_URL = 'http://localhost:5000/api/products';

// Función helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Función helper para manejar errores
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
};

/**
 * Servicio de gestión de productos
 */
const productService = {
  /**
   * Obtener todos los productos
   * @param {Object} filtros - Filtros de búsqueda (categoria, busqueda, activo)
   */
  obtenerProductos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.activo !== undefined) params.append('activo', filtros.activo);
      
      const url = `${API_URL}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * @param {string} id - ID del producto
   */
  obtenerProductoPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  /**
   * Obtener productos con stock bajo
   */
  obtenerProductosStockBajo: async () => {
    try {
      const response = await fetch(`${API_URL}/low-stock`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto (solo administrador)
   * @param {Object} productoData - Datos del producto
   */
  crearProducto: async (productoData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productoData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto
   * @param {string} id - ID del producto
   * @param {Object} productoData - Datos actualizados del producto
   */
  actualizarProducto: async (id, productoData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productoData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar (desactivar) un producto (solo administrador)
   * @param {string} id - ID del producto
   */
  eliminarProducto: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar stock de un producto
   * @param {string} id - ID del producto
   * @param {number} cantidad - Cantidad a sumar o restar
   * @param {string} operacion - 'sumar' o 'restar'
   */
  actualizarStock: async (id, cantidad, operacion) => {
    try {
      const response = await fetch(`${API_URL}/${id}/stock`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cantidad, operacion })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  }
};

export default productService;
