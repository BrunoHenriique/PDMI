export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ALUNO' | 'PROFESSOR';
}

export interface Aluno {
  usuarioId: number;
  matricula: string;
  usuario: Usuario;
}

export interface Professor {
  usuarioId: number;
  usuario: Usuario;
}

export interface Disciplina {
  id: number;
  descricao: string;
}

export interface MatriculaAluno {
  id: number;
  alunoId: number;
  disciplinaId: number;
  nota?: number;
  aluno: Aluno;
  disciplina: Disciplina;
}

export interface ProfessorHasDisciplina {
  id: number;
  professorId: number;
  disciplinaId: number;
  professor: Professor;
  disciplina: Disciplina;
}

export interface Notification {
  id: number;
  professor_id: number;
  title: string;
  message: string;
  type: 'lembrete' | 'comunicado' | 'aviso' | 'urgente';
  target_audience: 'meus_alunos' | 'todos_alunos';
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  professor_name?: string;
  is_read?: boolean;
  read_at?: string;
  total_reads?: number;
  total_students?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  userTipo: 'ALUNO' | 'PROFESSOR';
  userId: number;
  alunoId?: number;
  professorId?: number;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: 'ALUNO' | 'PROFESSOR';
  matricula?: string; // Obrigatório para ALUNO
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UpdatePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}