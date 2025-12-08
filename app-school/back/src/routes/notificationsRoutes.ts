import { Router } from 'express';
import notificationsController from '../controllers/NotificationsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas necessitam autenticação
router.use(authMiddleware);

// Rotas para professores
router.post('/', notificationsController.create);
router.get('/professor', notificationsController.listByProfessor);
router.put('/:id', notificationsController.update);
router.delete('/:id', notificationsController.delete);

// Rotas para alunos
router.get('/student', notificationsController.listForStudent);

export default router;