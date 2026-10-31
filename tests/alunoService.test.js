import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/prisma.js", () => ({
  prisma: {
    aluno: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../src/prisma.js";
import {
  validarAluno,
  cadastrarAluno,
  listarAlunos,
  buscarAlunoPorId,
} from "../src/services/alunoService.js";

describe("alunoService", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("validarAluno", () => {
    it("aceita dados válidos", () => {
      expect(() =>
        validarAluno({ nome: "Maria Silva", email: "maria@email.com" })
      ).not.toThrow();
    });

    it("rejeita nome curto", () => {
      expect(() => validarAluno({ nome: "Jo", email: "jo@email.com" })).toThrow(
        "Nome deve ter pelo menos 3 caracteres"
      );
    });

    it("rejeita e-mail inválido", () => {
      expect(() => validarAluno({ nome: "João Souza", email: "invalido" })).toThrow(
        "E-mail inválido"
      );
    });
  });

  describe("cadastrarAluno", () => {
    it("chama prisma.aluno.create com dados normalizados", async () => {
      prisma.aluno.create.mockResolvedValue({ id: 1, nome: "Maria", email: "maria@email.com" });

      const resultado = await cadastrarAluno({
        nome: "  Maria  ",
        email: "MARIA@EMAIL.COM",
      });

      expect(prisma.aluno.create).toHaveBeenCalledWith({
        data: { nome: "Maria", email: "maria@email.com" },
      });
      expect(resultado.id).toBe(1);
    });

    it("não chama o banco quando a validação falha", async () => {
      await expect(cadastrarAluno({ nome: "", email: "x" })).rejects.toThrow();
      expect(prisma.aluno.create).not.toHaveBeenCalled();
    });
  });

  it("listarAlunos retorna a lista do banco", async () => {
    prisma.aluno.findMany.mockResolvedValue([{ id: 1, nome: "Ana" }]);
    expect(await listarAlunos()).toEqual([{ id: 1, nome: "Ana" }]);
  });

  it("buscarAlunoPorId retorna null quando não existe", async () => {
    prisma.aluno.findUnique.mockResolvedValue(null);
    expect(await buscarAlunoPorId(99)).toBeNull();
  });
});