import { Router } from "express";
import {
  cadastrarAluno,
  listarAlunos,
  buscarAlunoPorId,
} from "../services/alunoService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const aluno = await cadastrarAluno(req.body);
    res.status(201).json(aluno);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.get("/", async (_req, res) => {
  res.json(await listarAlunos());
});

router.get("/:id", async (req, res) => {
  const aluno = await buscarAlunoPorId(Number(req.params.id));
  if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
  res.json(aluno);
});

export default router;