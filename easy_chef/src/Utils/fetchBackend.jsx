import axios from 'axios';

const fetchBackend = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export default fetchBackend;
