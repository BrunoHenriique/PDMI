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

  public async getById(req: Request, res: Response): Promise<any> {
    const { usuarioId } = req.params;
    
    if (!usuarioId) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }

    try {
      const aluno = await prisma.usuario.findFirst({
        where: {
          id: parseInt(usuarioId),
          tipo: 'ALUNO'
        },
        include: {
          aluno: true
        }
      });

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }

      // Remover senha do retorno
      const { senha, ...userWithoutPassword } = aluno;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({ message: 'Erro ao buscar aluno', error: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<any> {
    const { usuarioId, nome, email, senha, matricula } = req.body;
    
    console.log('Dados recebidos para atualização:', { usuarioId, nome, email, matricula });
    
    // Validações
    if (!usuarioId) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }
    
    if (nome && (nome.trim().length < 2 || nome.trim().length > 100)) {
      return res.status(400).json({ message: 'Nome deve ter entre 2 e 100 caracteres' });
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }
    
    if (matricula && matricula.trim().length === 0) {
      return res.status(400).json({ message: 'Matrícula não pode estar vazia' });
    }
    
    if (senha && senha.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }

    try {
      // Preparar dados para atualização
      const updateData: any = {};
      
      if (nome) updateData.nome = nome.trim();
      if (email) updateData.email = email.trim();
      if (senha) updateData.senha = await bcrypt.hash(senha, 8);
      
      const alunoUpdateData: any = {};
      if (matricula) alunoUpdateData.matricula = matricula.trim();

      const updated = await prisma.usuario.update({
        where: { 
          id: usuarioId,
          tipo: 'ALUNO'
        },
        data: {
          ...updateData,
          ...(Object.keys(alunoUpdateData).length > 0 && {
            aluno: {
              update: alunoUpdateData
            }
          })
        },
        include: {
          aluno: true
        }
      });
      
      // Remover senha do retorno
      const { senha: _, ...userWithoutPassword } = updated;
      res.json({ message: 'Dados atualizados com sucesso', usuario: userWithoutPassword });
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email ou matrícula já em uso' });
      }
      res.status(500).json({ message: 'Erro ao atualizar aluno', error: error.message });
    }
  }
}

export default new AlunoController();
