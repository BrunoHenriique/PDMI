import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class MatriculaAlunoController {

  public async list(_: Request, res: Response) {
    try {
      const matriculas = await prisma.matriculaAluno.findMany({
        include: {
          aluno: {
            include: {
              usuario: true
            }
          },
          disciplina: true
        }
      });

      res.json(matriculas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar matrículas', error });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { alunoId, disciplinaId } = req.body;

      const matricula = await prisma.matriculaAluno.create({
        data: { alunoId, disciplinaId },
        include: {
          aluno: {
            include: {
              usuario: true
            }
          },
          disciplina: true
        }
      });

      res.json(matricula);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar matrícula', error });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nota } = req.body;

      const matricula = await prisma.matriculaAluno.update({
        where: { id: Number(id) },
        data: { nota },
        include: {
          aluno: {
            include: {
              usuario: true
            }
          },
          disciplina: true
        }
      });

      res.json(matricula);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar matrícula', error });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.matriculaAluno.delete({
        where: { id: Number(id) }
      });

      res.json({ message: 'Matrícula excluída com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir matrícula', error });
    }
  }
   public async getByAlunoId(req: Request, res: Response) {
    const { alunoId } = req.params;
    try {
      const matriculas = await prisma.matriculaAluno.findMany({
        where: {
          alunoId: Number(alunoId),
        },
        include: {
          disciplina: true,
          aluno: {
            include: {
              usuario: true,
            },
          },
        },
      });
      res.json(matriculas);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao listar matrículas do aluno', error });
    }
  }

  public async getByDisciplinaId(req: Request, res: Response) {
    const { disciplinaId } = req.params;
    try {
      const matriculas = await prisma.matriculaAluno.findMany({
        where: {
          disciplinaId: Number(disciplinaId),
        },
        include: {
          aluno: {
            include: {
              usuario: true,
            },
          },
          disciplina: true,
        },
      });
      res.json(matriculas);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro ao listar matrículas da disciplina', error });
    }
  }
}

export default new MatriculaAlunoController();
