import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/autenticacion/Login';
import Registro from './Components/autenticacion/Registro';
import ListaProyectos from './Components/proyecto/ListaProyectos';
import ListaTareas from './Components/tarea/ListaTareas';
import { Navigate } from 'react-router-dom';

function App() {
  
  const handleLogout = () => {
    // Eliminar el token de autenticación de localStorage o sessionStorage
    localStorage.removeItem('token'); // Asegúrate de que el token está almacenado en localStorage
    navigate('/'); // Redirigir al usuario a la página de inicio de sesión
};
  return (
    <>
      <div className="background"></div>
      
      <div className='container'>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/proyectos" element={<ListaProyectos />} />
            <Route path="/proyectos/:id/tareas" element={<ListaTareas />} />
          </Routes>
        </Router>
      </div>

    </>
  );
}

export default App;
