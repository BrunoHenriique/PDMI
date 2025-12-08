import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AlunoController {
  public async create(req: Request, res: Response): Promise<any> {
    const { nome, email, senha, tipo, matricula } = req.body;
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
  
      const aluno = await prisma.aluno.create({
        data: {
          usuarioId: usuario.id,
          matricula,
        },
      });
  
      res.json({ usuario, aluno });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email ou matrícula já em uso' });
      }
      res.status(500).json({ message: 'Erro ao criar aluno', error });
    }
  }

  public async list(_: Request, res: Response) {
    try {
      const alunos = await prisma.aluno.findMany({
        include: {
          usuario: true,
        },
      });
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar alunos', error });
    }
  }

  public async delete(req: Request, res: Response): Promise<any> {
    const { usuarioId } = req.body;
    try {
      await prisma.matriculaAluno.deleteMany({ where: { alunoId: usuarioId } });
      await prisma.aluno.delete({ where: { usuarioId } });
      await prisma.usuario.delete({ where: { id: usuarioId } });
      res.json({ message: 'Aluno excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir aluno', error });
    }
  }

  public async getBulletin(req: Request, res: Response): Promise<any> {
    const { usuarioId } = req.params;
    try {
      const bulletin = await prisma.aluno.findUnique({
        where: { usuarioId: Number(usuarioId) },
        include: {
          disciplinas: {
            include: {
              disciplina: true,
            },
          },
        },
      });

      if (!bulletin) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }

      res.json(bulletin);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar boletim', error });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { usuarioId, nome, email, matricula } = req.body;
    try {
      const updated = await prisma.usuario.update({
        where: { id: usuarioId },
        data: { 
          nome, 
          email,
          aluno: {
            update: {
              matricula,
            }
          }
        },
      });
      res.json(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email ou matrícula já em uso' });
      }
      res.status(500).json({ message: 'Erro ao atualizar aluno', error });
    }
  }
}

export default new AlunoController();
