import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: true,
    globalLoading: false,
    notifications: [] as string[],
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setLoading(status: boolean) {
      this.globalLoading = status;
    }
  }
});