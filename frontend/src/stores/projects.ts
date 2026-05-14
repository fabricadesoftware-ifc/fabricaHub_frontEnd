import { defineStore } from 'pinia';
import { projectService } from '@/services/projectService';

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
  }),
  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        // Aqui entra o Service Pattern que você vai criar
        this.projects = await projectService.getAllProjects();
      } finally {
        this.loading = false;
      }
    }
  }
});