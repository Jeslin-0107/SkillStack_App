// src/api/refreshToken.js
import axios from 'axios';

// change baseURL if your backend URL differs
const API_BASE = 'http://127.0.0.1:8000';

export const refreshTokenRequest = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;

  try {
    const res = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh });
    const newAccess = res.data.access;
    localStorage.setItem('access', newAccess);
    return newAccess;
  } catch (err) {
    console.error('refresh token failed', err);
    // cleanup tokens on fail
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return null;
  }
};
