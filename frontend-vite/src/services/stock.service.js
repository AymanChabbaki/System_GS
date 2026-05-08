import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api';

const getStockMovements = () => axios.get(`${API_URL}/movements`, { headers: authHeader() });
const addMovement = (data) => axios.post(`${API_URL}/movements`, data, { headers: authHeader() });
const getDashboardData = () => axios.get(`${API_URL}/dashboard/stats`, { headers: authHeader() });
const getChartData = () => axios.get(`${API_URL}/dashboard/chart`, { headers: authHeader() });
const getCategoriesDistribution = () => axios.get(`${API_URL}/dashboard/categories-distribution`, { headers: authHeader() });

export default { getStockMovements, addMovement, getDashboardData, getChartData, getCategoriesDistribution };
