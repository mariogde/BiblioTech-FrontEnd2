export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  isAdmin: boolean;
}

export interface User {
  id?: number;
  name?: string;
  email: string;
  isAdmin: boolean;
}