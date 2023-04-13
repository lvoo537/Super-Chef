import axios from 'axios';

const fetchBackend = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

fetchBackend.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default fetchBackend;
