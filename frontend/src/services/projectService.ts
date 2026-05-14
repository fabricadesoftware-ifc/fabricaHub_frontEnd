// src/services/projectService.ts
import axios from 'axios';

// Depois vamos configurar isso no Axios Interceptor, mas para o erro sumir:
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // URL do seu Django
});

export const projectService = {
  async getAllProjects() {
    // Esse método vai buscar os projetos lá no seu banco do Django
    const response = await api.get('/projetos/');
    return response.data;
  },

  async getProjectById(id: number) {
    const response = await api.get(`/projetos/${id}/`);
    return response.data;
  }
};