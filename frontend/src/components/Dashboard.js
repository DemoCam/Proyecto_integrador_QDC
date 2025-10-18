import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    } else {
      // Si no hay usuario, redirigir al login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Eliminar datos de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleButtonClick = (funcionalidad) => {
    alert(`La funcionalidad "${funcionalidad}" estará disponible en el próximo sprint`);
  };

  if (!usuario) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Químicos del Cauca S.A.S.</h1>
        </div>
        <div className="navbar-user">
          <span className="user-info">
            <strong>{usuario.nombre}</strong>
            <span className="user-role">({usuario.rol})</span>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-content">
        <h2>Menú Principal</h2>
        <p className="welcome-message">Bienvenido al sistema de gestión de pedidos</p>

        <div className="dashboard-grid">
          {/* Gestión de Productos - Visible para todos */}
          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Gestión de Productos</h3>
            <p>Administrar el catálogo de productos y precios</p>
            <button 
              className="btn-secondary disabled" 
              onClick={() => handleButtonClick('Gestión de Productos')}
              disabled
            >
              Próximamente
            </button>
          </div>

          {/* Gestión de Pedidos - Visible para todos */}
          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Gestión de Pedidos</h3>
            <p>Crear, visualizar y gestionar pedidos</p>
            <button 
              className="btn-secondary disabled" 
              onClick={() => handleButtonClick('Gestión de Pedidos')}
              disabled
            >
              Próximamente
            </button>
          </div>

          {/* Reportes e Inventario*/}
          {usuario.rol === 'administrador' && (
            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Reportes e Inventario</h3>
              <p>Visualizar estadísticas y estado del inventario</p>
              <button 
                className="btn-secondary disabled" 
                onClick={() => handleButtonClick('Reportes e Inventario')}
                disabled
              >
                Próximamente
              </button>
            </div>
          )}

          {/* Gestión de Usuarios*/}
          {usuario.rol === 'administrador' && (
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>Gestión de Usuarios</h3>
              <p>Administrar usuarios del sistema</p>
              <button 
                className="btn-secondary disabled" 
                onClick={() => handleButtonClick('Gestión de Usuarios')}
                disabled
              >
                Próximamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
