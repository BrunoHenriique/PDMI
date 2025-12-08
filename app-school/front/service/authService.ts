import api from './api';
import { AuthResponse, CreateUserRequest, LoginRequest, UpdatePasswordRequest } from './types';

class AuthService {
  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    const response = await api.post('/auth', userData);
    return response.data;
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/signin', loginData);
    return response.data;
  }

  async updatePassword(passwordData: UpdatePasswordRequest): Promise<{ message: string }> {
    const response = await api.put('/auth', passwordData);
    return response.data;
  }
}

export default new AuthService();