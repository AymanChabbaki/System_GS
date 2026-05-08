import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth/';
const login = (username, password) => {
  return axios.post(API_URL + 'login', { username, password })
    .then((response) => {
      if (response.data.token) { localStorage.setItem('user', JSON.stringify(response.data)); }
      return response.data;
    });
};
const register = (username, email, password) => {
  return axios.post(API_URL + 'register', { username, email, password });
};
const logout = () => { localStorage.removeItem('user'); };
const getCurrentUser = () => { 
  const user = JSON.parse(localStorage.getItem('user'));
  return (user && user.token) ? user : null; 
};
export default { login, logout, register, getCurrentUser };
