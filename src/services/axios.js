import axios from "axios";

// Tworzenie instancji axios
const api = axios.create({
  baseURL: `https://0049970.xyz`, // bazowy URL dla wszystkich zapytań https://16.171.165.136
});
//https://16.171.165.136/api
// Dodaj token do każdego zapytania
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = `application/json`;
    config.headers["Accept"] = "application/json";
    return config;
  },
  (response) => response,
  (error) => {
    console.log("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
