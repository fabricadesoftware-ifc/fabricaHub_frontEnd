import { defineStore } from 'pinia'

import api from '@/api'

interface User {
  id: string
  usuario: string
  usuario_nome: string
  usuario_username: string
  curso: string
  semestre: number
  squad: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {

  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

  actions: {

    async login(
      username: string,
      password: string
    ) {

      const response = await api.post(
        '/token/',
        {
          username,
          password
        }
      )

      const { access, refresh } = response.data

      this.setTokens(
        access,
        refresh
      )

      await this.fetchUser()

      return response.data
    },

    async fetchUser() {

      const response = await api.get(
        '/api/membros/me/'
      )

      this.user = response.data
    },

    setTokens(
      accessToken: string,
      refreshToken: string
    ) {

      this.accessToken = accessToken
      this.refreshToken = refreshToken

      localStorage.setItem(
        'accessToken',
        accessToken
      )

      localStorage.setItem(
        'refreshToken',
        refreshToken
      )
    },

    logout() {

      this.accessToken = null
      this.refreshToken = null
      this.user = null

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})
