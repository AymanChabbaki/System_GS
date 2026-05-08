import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/categories';

const getAll = () => axios.get(API_URL, { headers: authHeader() });
const create = (data) => axios.post(API_URL, data, { headers: authHeader() });
const update = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
const remove = (id) => axios.delete(`${API_URL}/${id}`, { headers: authHeader() });

export default { getAll, create, update, remove };
