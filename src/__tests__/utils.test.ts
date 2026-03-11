/**
 * @jest-environment node
 */
import { AppError, isAppError } from "@/utils/app-error";
import { badRequest, toErrorResponse } from "@/utils/http-response";
import { buildTaskService } from "@/services/tasks/task.service";

// ─── AppError ───────────────────────────────────────────────
describe("AppError", () => {
  it("cria erro com code, status e message corretos", () => {
    const error = new AppError("AUTH_FAILED", "Não autorizado.", 401);
    expect(error.code).toBe("AUTH_FAILED");
    expect(error.status).toBe(401);
    expect(error.message).toBe("Não autorizado.");
  });

  it("é instância de Error", () => {
    const error = new AppError("ERR", "msg", 400);
    expect(error).toBeInstanceOf(Error);
  });
});

describe("isAppError", () => {
  it("retorna true para AppError", () => {
      expect(isAppError(new AppError("ERR", "msg", 400))).toBe(false); // errado proposital
  });

  it("retorna false para Error genérico", () => {
    expect(isAppError(new Error("msg"))).toBe(false);
  });

  it("retorna false para null", () => {
    expect(isAppError(null)).toBe(false);
  });
});

// ─── http-response ──────────────────────────────────────────
describe("toErrorResponse", () => {
  it("retorna status 401 e body correto para AppError", () => {
    const error = new AppError("AUTH_FAILED", "Não autorizado.", 401);
    const response = toErrorResponse(error);
    expect(response.status).toBe(401);
  });

  it("retorna status 500 para erro genérico", () => {
    const error = new Error("Erro inesperado");
    const response = toErrorResponse(error);
    expect(response.status).toBe(500);
  });
});

describe("badRequest", () => {
  it("lança AppError 400", () => {
    expect(() => badRequest("Campo inválido")).toThrow(AppError);
    expect(() => badRequest("Campo inválido")).toThrow(expect.objectContaining({ status: 400 }));
  });
});

// ─── taskService.getSummary ──────────────────────────────────
const mockRepository = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const service = buildTaskService({ repository: mockRepository });

beforeEach(() => jest.clearAllMocks());

describe("taskService.getSummary", () => {
  it("retorna resumo correto de tarefas", async () => {
    mockRepository.listByUser.mockResolvedValue([
      { id: "1", title: "Tarefa 1", completed: true },
      { id: "2", title: "Tarefa 2", completed: false },
      { id: "3", title: "Tarefa 3", completed: false },
    ]);

    const summary = await service.getSummary("user123");
    expect(summary).toEqual({ total: 3, completed: 1, pending: 2 });
  });

  it("retorna zeros quando não há tarefas", async () => {
    mockRepository.listByUser.mockResolvedValue([]);
    const summary = await service.getSummary("user123");
    expect(summary).toEqual({ total: 0, completed: 0, pending: 0 });
  });

  it("lança AppError 400 quando userId está vazio", async () => {
    await expect(service.getSummary("")).rejects.toMatchObject({ status: 400 });
  });
});