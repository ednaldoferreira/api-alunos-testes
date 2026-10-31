import { prisma } from "../prisma.js";

export function validarAluno({ nome, email }) {
  if (!nome || nome.trim().length < 3) {
    throw new Error("Nome deve ter pelo menos 3 caracteres");
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("E-mail inválido");
  }
}

export async function cadastrarAluno(dados) {
  validarAluno(dados);
  return prisma.aluno.create({
    data: { nome: dados.nome.trim(), email: dados.email.toLowerCase() },
  });
}

export async function listarAlunos() {
  return prisma.aluno.findMany({ orderBy: { nome: "asc" } });
}

export async function buscarAlunoPorId(id) {
  return prisma.aluno.findUnique({ where: { id } });
}