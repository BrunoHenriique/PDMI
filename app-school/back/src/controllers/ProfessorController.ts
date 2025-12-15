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

  public async getById(req: Request, res: Response): Promise<any> {
    const { usuarioId } = req.params;
    
    if (!usuarioId) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }

    try {
      const professor = await prisma.usuario.findFirst({
        where: {
          id: parseInt(usuarioId),
          tipo: 'PROFESSOR'
        },
        include: {
          professor: true
        }
      });

      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      // Remover senha do retorno
      const { senha, ...userWithoutPassword } = professor;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Erro ao buscar professor:', error);
      res.status(500).json({ message: 'Erro ao buscar professor', error: error.message });
    }
  }
  
  public async update(req: Request, res: Response): Promise<any> {
    const { usuarioId, nome, email, senha } = req.body;
    
    console.log('Dados recebidos para atualização:', { usuarioId, nome, email });
    
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
    
    if (senha && senha.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }

    try {
      // Preparar dados para atualização
      const updateData: any = {};
      
      if (nome) updateData.nome = nome.trim();
      if (email) updateData.email = email.trim();
      if (senha) updateData.senha = await bcrypt.hash(senha, 8);

      const updated = await prisma.usuario.update({
        where: { 
          id: usuarioId,
          tipo: 'PROFESSOR'
        },
        data: updateData,
        include: {
          professor: true
        }
      });
      
      // Remover senha do retorno
      const { senha: _, ...userWithoutPassword } = updated;
      res.json({ message: 'Dados atualizados com sucesso', usuario: userWithoutPassword });
    } catch (error: any) {
      console.error('Erro ao atualizar professor:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email já em uso' });
      }
      res.status(500).json({ message: 'Erro ao atualizar professor', error: error.message });
    }
  }
  
}

export default new ProfessorController();
