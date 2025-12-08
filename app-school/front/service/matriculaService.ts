import api from './api';
import { MatriculaAluno } from './types';

class MatriculaService {
  async create(matriculaData: { alunoId: number; disciplinaId: number }) {
    const response = await api.post('/matricula', matriculaData);
    return response.data;
  }

  async list(): Promise<MatriculaAluno[]> {
    const response = await api.get('/matricula/list');
    return response.data;
  }

  async update(id: number, nota: number) {
    const response = await api.put(`/matricula/update/${id}`, { nota });
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete(`/matricula/delete/${id}`);
    return response.data;
  }

  async getByAluno(alunoId: number): Promise<MatriculaAluno[]> {
    const response = await api.get(`/matricula/aluno/${alunoId}`);
    return response.data;
  }

  async getByDisciplina(disciplinaId: number): Promise<MatriculaAluno[]> {
    const response = await api.get(`/matricula/disciplina/${disciplinaId}`);
    return response.data;
  }
}

export default new MatriculaService();