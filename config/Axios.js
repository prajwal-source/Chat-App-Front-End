import axios from "axios"

export const baseURL = import.meta.env.VITE_BACKEND_API_URL;

export const httpClient=axios.create({
    baseURL:baseURL
})