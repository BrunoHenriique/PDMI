import api from './api';
import { Notification } from './types';

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type?: 'lembrete' | 'comunicado' | 'aviso' | 'urgente';
  target_audience?: 'meus_alunos' | 'todos_alunos';
  expires_at?: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  message?: string;
  type?: 'lembrete' | 'comunicado' | 'aviso' | 'urgente';
  target_audience?: 'meus_alunos' | 'todos_alunos';
  expires_at?: string;
  is_active?: boolean;
}

class NotificationService {
  // Para professores
  async create(data: CreateNotificationRequest): Promise<Notification> {
    const response = await api.post('/notifications', data);
    return response.data;
  }

  async listByProfessor(): Promise<Notification[]> {
    const response = await api.get('/notifications/professor');
    return response.data;
  }

  async update(id: number, data: UpdateNotificationRequest): Promise<Notification> {
    const response = await api.put(`/notifications/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }

  // Para alunos
  async listForStudent(): Promise<Notification[]> {
    const response = await api.get('/notifications/student');
    return response.data;
  }

  async markAsRead(id: number): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  }

  // Utilitários
  getTypeColor(type: string): string {
    switch (type) {
      case 'urgente': return '#dc3545';
      case 'comunicado': return '#007bff';
      case 'lembrete': return '#ffc107';
      case 'aviso': 
      default: return '#28a745';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'urgente': return '🚨';
      case 'comunicado': return '📢';
      case 'lembrete': return '⏰';
      case 'aviso': 
      default: return '📝';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default new NotificationService();