import '../../Styles/ListaProyectos.css';
import React, { useEffect, useState } from 'react';
import { obtenerProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from '../../service/proyectoAPI';
import { useNavigate } from 'react-router-dom';

const ListaProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [idEditando, setIdEditando] = useState(null);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarProyectos();
    }, []);

    const cargarProyectos = async () => {
        try {
            const data = await obtenerProyectos();
            setProyectos(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        const proyecto = {
            nombre,
            descripcion,
            fechaInicio: fechaInicio || null,
            fechaFin: fechaFin || null
        };

        try {
            if (idEditando) {
                await actualizarProyecto(idEditando, proyecto);
                setIdEditando(null);  // Resetear el ID de edición
            } else {
                await crearProyecto(proyecto);
            }
            formularioEmergente();  // Cerrar el formulario después de crear o actualizar
            setNombre('');
            setDescripcion('');
            setFechaInicio('');
            setFechaFin('');
            cargarProyectos();
        } catch (error) {
            setError(error.message);
        }
    };

    const manejarEliminar = async (id) => {
        try {
            await eliminarProyecto(id);
            cargarProyectos();
        } catch (error) {
            setError(error.message);
        }
    };

    const manejarEditar = (proyecto) => {
        setIdEditando(proyecto._id);
        setNombre(proyecto.nombre);
        setDescripcion(proyecto.descripcion);
        setFechaInicio(proyecto.fechaInicio ? proyecto.fechaInicio.slice(0, 10) : '');
        setFechaFin(proyecto.fechaFin ? proyecto.fechaFin.slice(0, 10) : '');
        setIsFormVisible(true);  // Abrir el formulario al editar
    };

    const formularioEmergente = () => {
        setIsFormVisible(!isFormVisible);
        if (!isFormVisible) {
            setIdEditando(null);
            setNombre('');
            setDescripcion('');
            setFechaInicio('');
            setFechaFin('');
        }
    };

    const handleTareaRedirect = (proyectoId) => {
        navigate(`/proyectos/${proyectoId}/tareas`);
    };
    const cancelarEdicion = () => {
        setIdEditando(null);
        formularioEmergente();
    };
    const cerarSesion = () => {
        // Eliminar el token de autenticación de localStorage o sessionStorage
        localStorage.removeItem('token'); // Asegúrate de que el token está almacenado en localStorage
        navigate('/'); // Redirigir al usuario a la página de inicio de sesión
    };

    return (
        <>
            <button onClick={cerarSesion} className="boton-cerarSesion">
                Cerrar Sesión
            </button>
            <div className='Container'>
                <h2>Mis Proyectos</h2>
                <div className="container">
                    <button onClick={formularioEmergente} className="open-form-button">
                        Nuevo Proyecto
                    </button>

                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {isFormVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <button className="close" onClick={formularioEmergente}>&times;</button>
                            <form onSubmit={manejarSubmit}>
                                <input
                                    type="text"
                                    placeholder="Nombre del proyecto"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                                <input
                                    type="date"
                                    placeholder="Fecha de inicio"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                                <input
                                    type="date"
                                    placeholder="Fecha de fin"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                                <button type="submit">{idEditando ? 'Actualizar Proyecto' : 'Crear Proyecto'}</button>
                                {idEditando && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
                            </form>
                        </div>
                    </div>
                )}
                <table className="project-table">
                    <thead>
                        <tr className='titulo'>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Fin</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyectos.map((proyecto) => (
                            <tr key={proyecto._id}>
                                <td>{proyecto.nombre}</td>
                                <td>{proyecto.descripcion}</td>
                                <td>{proyecto.fechaInicio ? proyecto.fechaInicio.slice(0, 10) : 'N/A'}</td>
                                <td>{proyecto.fechaFin ? proyecto.fechaFin.slice(0, 10) : 'N/A'}</td>
                                <td>
                                    <button className='B-Editar' onClick={() => manejarEditar(proyecto)}>Editar</button>
                                    <button className='B-Eliminar' onClick={() => manejarEliminar(proyecto._id)}>Eliminar</button>
                                    <button className='B-Ver' onClick={() => handleTareaRedirect(proyecto._id)}>Ver Tareas</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ListaProyectos;
