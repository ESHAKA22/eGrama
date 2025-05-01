import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // The base URL of your backend
});

export default api;  // Default export of the api instance
