import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    tipo: 'ALUNO' | 'PROFESSOR';
  };
}

class NotificationsController {
  // Professor cria uma notificação
  public async create(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.tipo !== 'PROFESSOR') {
        return res.status(403).json({ message: 'Apenas professores podem criar notificações' });
      }

      const { title, message, type = 'aviso' } = req.body;

      if (!title || !message) {
        return res.status(400).json({ message: 'Título e mensagem são obrigatórios' });
      }

      // Verificar se o professor existe na tabela Professor
      const professor = await prisma.professor.findUnique({
        where: { usuarioId: req.user.id },
      });

      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          type,
          professorId: req.user.id,
        },
      });

      res.status(201).json(notification);
    } catch (error: any) {
      console.error('Erro ao criar notificação:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Professor lista suas notificações
  public async listByProfessor(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.tipo !== 'PROFESSOR') {
        return res.status(403).json({ message: 'Apenas professores podem acessar esta rota' });
      }

      // Verificar se o professor existe
      const professor = await prisma.professor.findUnique({
        where: { usuarioId: req.user.id },
      });

      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const notifications = await prisma.notification.findMany({
        where: {
          professorId: req.user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      res.json(notifications);
    } catch (error: any) {
      console.error('Erro ao listar notificações:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Aluno lista notificações de seus professores
  public async listForStudent(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.tipo !== 'ALUNO') {
        return res.status(403).json({ message: 'Apenas alunos podem acessar esta rota' });
      }

      // Buscar todas as notificações ativas
      const notifications = await prisma.notification.findMany({
        where: {
          is_active: true,
        },
        include: {
          professor: {
            include: {
              usuario: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Simplificar os dados retornados
      const simplifiedNotifications = notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.created_at,
        professorName: notification.professor.usuario.nome,
      }));

      res.json(simplifiedNotifications);
    } catch (error: any) {
      console.error('Erro ao listar notificações para aluno:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Professor atualiza uma notificação
  public async update(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.tipo !== 'PROFESSOR') {
        return res.status(403).json({ message: 'Apenas professores podem atualizar notificações' });
      }

      // Verificar se o professor existe
      const professor = await prisma.professor.findUnique({
        where: { usuarioId: req.user.id },
      });

      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const { id } = req.params;
      const { title, message, type, isActive } = req.body;

      const notification = await prisma.notification.findUnique({
        where: { id: parseInt(id) },
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notificação não encontrada' });
      }

      if (notification.professorId !== req.user.id) {
        return res.status(403).json({ message: 'Você só pode atualizar suas próprias notificações' });
      }

      const updatedNotification = await prisma.notification.update({
        where: { id: parseInt(id) },
        data: {
          ...(title && { title }),
          ...(message && { message }),
          ...(type && { type }),
          ...(isActive !== undefined && { is_active: isActive }),
        },
      });

      res.json(updatedNotification);
    } catch (error: any) {
      console.error('Erro ao atualizar notificação:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Professor deleta uma notificação
  public async delete(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || req.user.tipo !== 'PROFESSOR') {
        return res.status(403).json({ message: 'Apenas professores podem deletar notificações' });
      }

      // Verificar se o professor existe
      const professor = await prisma.professor.findUnique({
        where: { usuarioId: req.user.id },
      });

      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id: parseInt(id) },
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notificação não encontrada' });
      }

      if (notification.professorId !== req.user.id) {
        return res.status(403).json({ message: 'Você só pode deletar suas próprias notificações' });
      }

      await prisma.notification.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: 'Notificação deletada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao deletar notificação:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new NotificationsController();