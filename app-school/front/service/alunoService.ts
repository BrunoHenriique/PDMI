import api from './api';
import { Aluno } from './types';

class AlunoService {
  async create(alunoData: { nome: string; email: string; senha: string; matricula: string }) {
    const response = await api.post('/aluno', alunoData);
    return response.data;
  }

  async list(): Promise<Aluno[]> {
    const response = await api.get('/aluno');
    return response.data;
  }

  async getById(usuarioId: number) {
    const response = await api.get(`/aluno/${usuarioId}`);
    return response.data;
  }

  async update(alunoData: { usuarioId: number; nome?: string; email?: string; senha?: string; matricula?: string }) {
    const response = await api.put('/aluno', alunoData);
    return response.data;
  }

  async delete(usuarioId: number) {
    const response = await api.delete('/aluno', { data: { usuarioId } });
    return response.data;
  }

  async getBulletin(usuarioId: number) {
    const response = await api.get(`/aluno/${usuarioId}/bulletin`);
    return response.data;
  }
}

export default new AlunoService();