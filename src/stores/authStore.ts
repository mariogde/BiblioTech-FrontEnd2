import { defineStore } from 'pinia'
import { api } from '../boot/axios'

export interface User {
  id?: number
  name?: string
  email?: string
  isAdmin?: boolean
}

interface AuthResponse {
  token: string
  isAdmin: boolean
}

interface AuthStoreState {
  user: User | false
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    user: localStorage.getItem('userEmail')
      ? {
          email: localStorage.getItem('userEmail') || '',
          isAdmin: localStorage.getItem('isAdmin') === 'true'
        }
      : false,
    token: localStorage.getItem('token')
  }),

  getters: {
    isAuthenticated(state): boolean {
      return !!state.token && !!state.user
    },
    isAdmin(state): boolean {
      return state.user ? Boolean(state.user.isAdmin) : false
    },
    userEmail(state): string {
      return state.user ? state.user.email || '' : ''
    }
  },

  actions: {
    async login(email: string, password: string): Promise<User | false> {
      this.user = false
      this.token = null

      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password
      })

      if (response.data && response.status === 200) {
        const { token, isAdmin } = response.data

        this.token = token
        this.user = {
          email,
          isAdmin
        }

        // Persistência no LocalStorage
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isAdmin', String(isAdmin))
      }

      return this.user
    },

    logout() {
      this.user = false
      this.token = null

      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('isAdmin')
    }
  }
})