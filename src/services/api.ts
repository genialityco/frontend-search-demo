import axios from "axios";
import { Activity } from "../types";

// Configuración de Axios
const API = axios.create({
  baseURL: "https://backend-search-demo.onrender.com", // Cambia esto si tu backend usa otro puerto
});

// Obtener actividades con paginación y búsqueda
export const fetchActivities = async (
  page: number,
  limit: number,
  query?: string
): Promise<{ data: Activity[]; total: number }> => {
  const params: { page: number; limit: number; query?: string } = {
    page,
    limit,
  };
  if (query) params.query = query;
  const res = await API.get("/activities", { params });
  return res.data;
};

export const fetchSearchActivities = async (
  page: number,
  limit: number,
  query?: string
): Promise<{ data: Activity[]; total: number }> => {
  const params: { page: number; limit: number; query?: string } = {
    page,
    limit,
  };
  if (query) params.query = query;
  const res = await API.get("/activities/search", { params });
  return res.data;
};

export const fetchSemanticSearch = async (query: string) => {
  const res = await fetch(`http://localhost:3000/activities/search?query=${query}`);
  return res.json();
};


export default API;
