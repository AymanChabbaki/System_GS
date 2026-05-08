import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/users';

const getAll = () => axios.get(API_URL, { headers: authHeader() });
const getById = (id) => axios.get(`${API_URL}/${id}`, { headers: authHeader() });
const create = (data) => axios.post(API_URL, data, { headers: authHeader() });
const update = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
const changePassword = (id, newPassword) => axios.put(`${API_URL}/${id}/change-password`, newPassword, { headers: { ...authHeader(), 'Content-Type': 'text/plain' } });
const approve = (id) => axios.put(`${API_URL}/${id}/approve`, {}, { headers: authHeader() });
const reject = (id) => axios.delete(`${API_URL}/${id}/reject`, { headers: authHeader() });
const remove = (id) => axios.delete(`${API_URL}/${id}`, { headers: authHeader() });

export default { getAll, getById, create, update, changePassword, approve, reject, remove };
