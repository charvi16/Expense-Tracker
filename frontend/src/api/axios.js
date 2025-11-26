import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// attach token
const token = localStorage.getItem("token");
if(token){
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default API;
