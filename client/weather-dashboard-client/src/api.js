import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5049/api"
});

export default api;