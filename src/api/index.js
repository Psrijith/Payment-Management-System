import axios from "axios";

const api = axios.create({
  baseURL: "https://68cc236b716562cf507693eb.mockapi.io",  
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
