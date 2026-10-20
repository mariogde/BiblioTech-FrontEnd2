import { defineStore } from 'pinia'
import { api } from '../boot/axios'
import type { LoginDTO, AuthResponse } from '../types/auth'

interface AuthStoreState {
  token: string | null
  usuario: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    token: localStorage.getItem('token'),
    usuario: localStorage.getItem('usuario')
  }),

  getters: {
    estaAutenticado(state): boolean {
      return !!state.token
    },
    obterToken(state): string | null {
      return state.token
    }
  },

  actions: {
    async login(credenciais: LoginDTO): Promise<boolean> {
      try {
        const response = await api.post<AuthResponse>('/auth/login', credenciais)

        if (response.data && response.data.token) {
          const tokenRecebido = response.data.token

          this.token = tokenRecebido
          this.usuario = credenciais.email

          localStorage.setItem('token', tokenRecebido)
          localStorage.setItem('usuario', credenciais.email)

          return true
        }

        return false
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.token = null
      this.usuario = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }
})