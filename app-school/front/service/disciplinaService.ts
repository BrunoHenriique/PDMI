import api from './api';
import { Disciplina } from './types';

class DisciplinaService {
  async create(disciplinaData: { descricao: string }): Promise<Disciplina> {
    const response = await api.post('/disciplina', disciplinaData);
    return response.data;
  }

  async list(): Promise<Disciplina[]> {
    const response = await api.get('/disciplina');
    return response.data;
  }

  async update(disciplinaData: { id: number; descricao: string }): Promise<Disciplina> {
    const response = await api.put('/disciplina', disciplinaData);
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete('/disciplina', { data: { id } });
    return response.data;
  }
}

export default new DisciplinaService();