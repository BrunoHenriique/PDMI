import express from "express";
import routes from './routes';
import dotenv from "dotenv";
import cors from "cors";



dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express(); 

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
console.log(`Rodando na porta ${PORT}`);
});

app.use(routes);