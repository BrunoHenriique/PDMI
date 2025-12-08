import { Router } from 'express';
import MatriculaAlunoController from '../controllers/MatriculaAlunoController';

const router = Router();

router.get('/list', MatriculaAlunoController.list);
router.post('/', MatriculaAlunoController.create);
router.put('/update/:id', MatriculaAlunoController.update);
router.delete('/delete/:id', MatriculaAlunoController.delete);
router.get('/aluno/:alunoId', MatriculaAlunoController.getByAlunoId);
router.get('/disciplina/:disciplinaId', MatriculaAlunoController.getByDisciplinaId);

export default router;
