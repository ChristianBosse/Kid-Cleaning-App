import axios from "axios";

// Create a new Axios instance with the backend server URL
const api = axios.create({
    baseURL: "http://localhost:5000", // Replace with your backend server URL
});

export default api;
