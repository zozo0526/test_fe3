import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;
console.log(import.meta.env);
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

export default apiClient;
