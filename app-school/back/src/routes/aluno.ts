import { Router } from "express";
import controller from "../controllers/AlunoController";

const routes = Router();

routes.post('/', controller.create);
routes.get('/', controller.list);
routes.get('/:usuarioId', controller.getById);
routes.delete('/', controller.delete);
routes.put('/', controller.update);
routes.get('/:usuarioId/bulletin', controller.getBulletin);

export default routes;
