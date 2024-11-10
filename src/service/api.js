import axios from 'axios';

const URL_BACKEND = 'https://gestionproyectobackend.onrender.com' //URL del backend en la nube
const local_hosto = 'http://localhost:3000'         // UrL del local hosto del backend 
const api = axios.create({
    baseURL: URL_BACKEND ,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
    
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error); 
    }
);

export default api;