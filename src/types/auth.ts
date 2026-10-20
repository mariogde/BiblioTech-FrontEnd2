export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}