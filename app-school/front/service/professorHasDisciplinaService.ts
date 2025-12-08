import api from './api';
import { ProfessorHasDisciplina } from './types';

class ProfessorHasDisciplinaService {
  async create(data: { professorId: number; disciplinaId: number }) {
    const response = await api.post('/professor_has_disciplina', data);
    return response.data;
  }

  async list(): Promise<ProfessorHasDisciplina[]> {
    const response = await api.get('/professor_has_disciplina');
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete('/professor_has_disciplina', { data: { id } });
    return response.data;
  }
}

export default new ProfessorHasDisciplinaService();