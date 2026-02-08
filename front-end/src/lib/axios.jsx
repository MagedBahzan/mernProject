import axios from "axios";

const api = axios.create({
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Content-Type": "application/json",
    },
    baseURL: "http://127.0.0.1:5001/api/v1",
});

export default api;
