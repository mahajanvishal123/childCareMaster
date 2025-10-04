import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api/', // ✅ Yaha pe tum apna real backend lagana future me
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}` 
  }
});

export default api;
