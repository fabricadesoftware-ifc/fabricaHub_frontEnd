import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
})

api.interceptors.request.use(
  (config) => {

    const authStore = useAuthStore()

    if (authStore.accessToken) {
      config.headers.Authorization =
        `Bearer ${authStore.accessToken}`
    }

    return config
  },

  (error) => Promise.reject(error)
)

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const authStore = useAuthStore()

    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {

      originalRequest._retry = true

      try {

        const response = await axios.post(
          `${api.defaults.baseURL}/token/refresh/`,
          {
            refresh: authStore.refreshToken
          }
        )

        const newAccessToken = response.data.access

        authStore.setTokens(
          newAccessToken,
          authStore.refreshToken
        )

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch {

        authStore.logout()

        router.push('/login')

        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
