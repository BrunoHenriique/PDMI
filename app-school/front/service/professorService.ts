import api from './api';
import { Professor } from './types';

class ProfessorService {
  async create(professorData: { nome: string; email: string; senha: string }) {
    const response = await api.post('/professor', professorData);
    return response.data;
  }

  async list(): Promise<Professor[]> {
    const response = await api.get('/professor');
    return response.data;
  }

  async getById(usuarioId: number) {
    const response = await api.get(`/professor/${usuarioId}`);
    return response.data;
  }

  async update(professorData: { usuarioId: number; nome?: string; email?: string; senha?: string }) {
    const response = await api.put('/professor', professorData);
    return response.data;
  }

  async delete(usuarioId: number) {
    const response = await api.delete('/professor', { data: { usuarioId } });
    return response.data;
  }
}

export default new ProfessorService();