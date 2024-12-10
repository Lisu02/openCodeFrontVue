import axios from "axios";

// Tworzenie instancji axios
const api = axios.create({
  baseURL: "/api", // bazowy URL dla wszystkich zapytań
});

// Dodaj token do każdego zapytania
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
