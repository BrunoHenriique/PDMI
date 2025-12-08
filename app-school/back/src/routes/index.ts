import { Router, Request, Response } from "express";
import professor from "./professores";
import disciplina from "./disciplinas";
import professor_has_disciplina from "./professor_has_disciplinas";
import aluno from "./aluno";
import matricula from "./matricula";
import auth from "./auth";
import notifications from "./notificationsRoutes";


const routes = Router();

routes.use("/auth", auth);
routes.use("/professor",  professor);
routes.use("/disciplina",  disciplina);
routes.use("/professor_has_disciplina",  professor_has_disciplina);
routes.use("/aluno",  aluno);
routes.use("/matricula", matricula);
routes.use("/notifications", notifications);

//aceita qualquer método HTTP ou URL
routes.use((_: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export default routes;
