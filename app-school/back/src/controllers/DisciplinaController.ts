import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

class DisciplinaController {
  public async create(req: Request, res: Response) {
    const { descricao } = req.body;
    try {
      const disciplina = await prisma.disciplina.create({ data: { descricao } });
      res.json(disciplina);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar disciplina', error });
    }
  }

  public async list(_: Request, res: Response) {
    try {
      const disciplinas = await prisma.disciplina.findMany({ orderBy: { descricao: 'asc' } });
      res.json(disciplinas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar disciplinas', error });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.body;
    try {
      await prisma.professor_has_Disciplina.deleteMany({ where: { disciplinaId: id } });
      await prisma.matriculaAluno.deleteMany({ where: { disciplinaId: id } });
      const deleted = await prisma.disciplina.delete({ where: { id } });
      res.json({ message: 'Disciplina excluída com sucesso', disciplina: deleted });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir disciplina', error });
    }
  }

  public async update(req: Request, res: Response) {
    const { id, descricao } = req.body;
    try {
      const updated = await prisma.disciplina.update({
        where: { id },
        data: { descricao },
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar disciplina', error });
    }
  }
}

export default new DisciplinaController();
