import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import InventoryView from './components/InventoryView';

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta raíz redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas de productos */}
          <Route 
            path="/productos" 
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/productos/nuevo" 
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/productos/editar/:id" 
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/inventario" 
            element={
              <ProtectedRoute>
                <InventoryView />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta para URLs no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
