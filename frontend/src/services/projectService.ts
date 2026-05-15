import api from '@/api';

export const projectService = {
  async getAllProjects() {
    const response = await api.get('/projetos/');
    return response.data;
  },

  async getProjectById(id: number) {
    const response = await api.get(`/projetos/${id}/`);
    return response.data;
  }
};