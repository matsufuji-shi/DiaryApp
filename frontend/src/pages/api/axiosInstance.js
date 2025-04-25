// API通信設定
import axios from "axios";

//バックエンドとのAPI通信
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;