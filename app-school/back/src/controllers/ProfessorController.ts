import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class ProfessorController {
  public async create(req: Request, res: Response): Promise<any> {
    const { nome, email, senha, tipo } = req.body; // dados do usuário
    const hashedPassword = await bcrypt.hash(senha, 8);
    try {
      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          tipo,
        },
      });
  
      const professor = await prisma.professor.create({
        data: {
          usuarioId: usuario.id,
        },
      });
  
      res.json({ usuario, professor });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email já em uso' });
      }
      res.status(500).json({ message: 'Erro ao criar professor', error });
    }
  }
  

  public async list(_: Request, res: Response) {
    try {
      const professors = await prisma.professor.findMany({
        include: {
          usuario: true,
        },
      });
      res.json(professors);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar professores', error });
    }
  }
  
  public async delete(req: Request, res: Response): Promise<any> {
    const { usuarioId } = req.body;  // mudou de id para usuarioId
    try {
      await prisma.professor_has_Disciplina.deleteMany({ where: { professorId: usuarioId } });
      await prisma.professor.delete({ where: { usuarioId } });
      await prisma.usuario.delete({ where: { id: usuarioId } });
      res.json({ message: 'Professor excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir professor', error });
    }
  }
  
  public async update(req: Request, res: Response): Promise<any> {
    const { usuarioId, nome, email } = req.body;  // idem
    try {
      const updated = await prisma.professor.update({
        where: { usuarioId },
        data: { usuario: { update: { nome, email } } },
      });
      res.json(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'CPF ou e-Mail já em uso' });
      }
      res.status(500).json({ message: 'Erro ao atualizar professor', error });
    }
  }
  
}

export default new ProfessorController();
