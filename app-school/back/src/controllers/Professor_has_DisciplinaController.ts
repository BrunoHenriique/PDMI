import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

class ProfessorHasDisciplinaController {
  public async create(req: Request, res: Response) {
    const { professorId, disciplinaId } = req.body;
    try {
      const relacao = await prisma.professor_has_Disciplina.create({
        data: {
          professorId,
          disciplinaId,
        },
      });
      res.json(relacao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar relação', error });
    }
  }

  public async list(_: Request, res: Response) {
    try {
      const relacoes = await prisma.professor_has_Disciplina.findMany({
        include: {
          professor: true,
          disciplina: true,
        },
        orderBy: { professorId: 'asc' },
      });
      res.json(relacoes);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar relações', error });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.body;
    try {
      const deleted = await prisma.professor_has_Disciplina.delete({ where: { id } });
      res.json({ message: 'Relação excluída com sucesso', relacao: deleted });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir relação', error });
    }
  }

  public async update(req: Request, res: Response) {
    const { id, professorId, disciplinaId } = req.body;
    try {
      const updated = await prisma.professor_has_Disciplina.update({
        where: { id },
        data: { professorId, disciplinaId },
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar relação', error });
    }
  }
}

export default new ProfessorHasDisciplinaController();
