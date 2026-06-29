import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-expense-settlement-tracker.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;