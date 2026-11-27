import axios from 'axios'

/**
 * Instância do Axios para a API do FabricaHUB.
 * Só os módulos de `src/api/` podem importar este arquivo.
 * Defina VITE_API_URL no .env (ex.: http://localhost:8000/api).
 */
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})
