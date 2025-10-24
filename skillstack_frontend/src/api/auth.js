// src/api/auth.js
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE}/api/token/`, { username, password });
    // res.data should contain access and refresh
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
