import express from "express";
import alunosRouter from "./routes/alunos.js";

const app = express();
app.use(express.json());
app.use("/alunos", alunosRouter);

export default app;