import { buildTaskService, validateTaskTitle } from "@/services/tasks/task.service";
import { AppError } from "@/utils/app-error";

const mockRepository = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const service = buildTaskService({ repository: mockRepository });

beforeEach(() => {
  jest.clearAllMocks();
});

describe("validateTaskTitle", () => {
  it("lança AppError 400 quando título está vazio", () => {
    expect(() => validateTaskTitle("")).toThrow(AppError);
    expect(() => validateTaskTitle("")).toThrow(expect.objectContaining({ status: 400 }));
  });

  it("lança AppError 400 quando título contém apenas espaços", () => {
    expect(() => validateTaskTitle("   ")).toThrow(AppError);
  });

  it("lança AppError 400 quando título é muito curto", () => {
    expect(() => validateTaskTitle("ab")).toThrow(AppError);
    expect(() => validateTaskTitle("ab")).toThrow(expect.objectContaining({ status: 400 }));
  });

  it("lança AppError 400 quando título é muito longo", () => {
    expect(() => validateTaskTitle("a".repeat(121))).toThrow(AppError);
    expect(() => validateTaskTitle("a".repeat(121))).toThrow(expect.objectContaining({ status: 400 }));
  });

  it("retorna título com trim quando válido", () => {
    expect(validateTaskTitle(" Fazer exercícios ")).toBe("Fazer exercícios");
  });
});

describe("buildTaskService", () => {
  it("listTasks chama repository.listByUser com userId correto", async () => {
    mockRepository.listByUser.mockResolvedValue([]);
    await service.listTasks("user123");
    expect(mockRepository.listByUser).toHaveBeenCalledWith("user123");
  });

it("createTask chama repository.createForUser com userId e title válidos", async () => {
  mockRepository.createForUser.mockResolvedValue({ id: "1", title: "Estudar Jest" });
  await service.createTask({ userId: "user123", title: "Estudar Jest" });
  expect(mockRepository.createForUser).toHaveBeenCalledWith("user123", "Estudar Jest");
});

it("deleteTask chama repository.deleteForUser com userId e taskId", async () => {
  mockRepository.deleteForUser.mockResolvedValue(undefined);
  await service.deleteTask({ userId: "user123", taskId: "task456" });
  expect(mockRepository.deleteForUser).toHaveBeenCalledWith("user123", "task456");
});

  it("lança AppError 400 quando userId está vazio (assertIdentifier)", async () => {
    await expect(service.listTasks("")).rejects.toThrow(AppError);
    await expect(service.listTasks("")).rejects.toMatchObject({ status: 400 });
  });

  it("retorna título com trim quando válido", () => {
  expect(validateTaskTitle(" Fazer exercícios ")).toBe("VALOR_ERRADO_PROPOSITAL");
});
});