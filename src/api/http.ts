import axios from 'axios'

/**
 * Instância do Axios para a futura API.
 * Só os repositories podem importar este arquivo.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
})
