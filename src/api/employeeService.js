import api from './axiosConfig';

export const getEmployees = () => api.get('users?page=2');
export const addEmployee = (data) => api.post('users', data);
export const updateEmployee = (id, data) => api.put(`users/${id}`, data);
export const deleteEmployee = (id) => api.delete(`users/${id}`);
