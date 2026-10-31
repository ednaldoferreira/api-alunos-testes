import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../src/services/alunoService.js", () => ({
  cadastrarAluno: vi.fn(),
  listarAlunos: vi.fn(),
  buscarAlunoPorId: vi.fn(),
}));

import app from "../src/app.js";
import {
  cadastrarAluno,
  listarAlunos,
  buscarAlunoPorId,
} from "../src/services/alunoService.js";

describe("Rotas /alunos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("POST /alunos retorna 201 ao cadastrar", async () => {
    cadastrarAluno.mockResolvedValue({ id: 1, nome: "Maria", email: "maria@email.com" });

    const res = await request(app)
      .post("/alunos")
      .send({ nome: "Maria", email: "maria@email.com" });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  it("POST /alunos retorna 400 quando o service lança erro", async () => {
    cadastrarAluno.mockRejectedValue(new Error("E-mail inválido"));

    const res = await request(app).post("/alunos").send({ nome: "Maria", email: "x" });

    expect(res.status).toBe(400);
    expect(res.body.erro).toBe("E-mail inválido");
  });

  it("GET /alunos retorna a lista", async () => {
    listarAlunos.mockResolvedValue([{ id: 1, nome: "Ana" }]);

    const res = await request(app).get("/alunos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("GET /alunos/:id retorna 404 quando não encontra", async () => {
    buscarAlunoPorId.mockResolvedValue(null);

    const res = await request(app).get("/alunos/99");

    expect(res.status).toBe(404);
  });

  it("GET /alunos/:id retorna 200 quando encontra", async () => {
    buscarAlunoPorId.mockResolvedValue({ id: 1, nome: "Ana" });

    const res = await request(app).get("/alunos/1");

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Ana");
  });
});