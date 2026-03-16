/**
 * @jest-environment node
 */
import { buildTaskService } from "@/services/tasks/task.service";

const mockRepositoryUserA = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const mockRepositoryUserB = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const serviceA = buildTaskService({ repository: mockRepositoryUserA });
const serviceB = buildTaskService({ repository: mockRepositoryUserB });

beforeEach(() => {
  jest.clearAllMocks();

  mockRepositoryUserA.listByUser.mockResolvedValue([
    { id: "1", title: "Tarefa do usuário A", completed: false },
    { id: "2", title: "Estudar Jest", completed: true },
  ]);

  mockRepositoryUserB.listByUser.mockResolvedValue([
    { id: "3", title: "Tarefa do usuário B", completed: false },
  ]);
});

describe("Bônus 3 — Múltiplos usuários", () => {
  it("usuário A e B têm listas de tarefas diferentes", async () => {
    const tasksA = await serviceA.listTasks("userA");
    const tasksB = await serviceB.listTasks("userB");

    expect(tasksA).toHaveLength(2);
    expect(tasksB).toHaveLength(1);
    expect(tasksA[0].title).toBe("Tarefa do usuário A");
    expect(tasksB[0].title).toBe("Tarefa do usuário B");
  });

  it("tarefas do usuário A não aparecem para o usuário B", async () => {
    const tasksA = await serviceA.listTasks("userA");
    const tasksB = await serviceB.listTasks("userB");

    const titlesB = tasksB.map((t) => t.title);
    tasksA.forEach((task) => {
      expect(titlesB).not.toContain(task.title);
    });
  });

  it("resumo de tarefas é calculado independentemente por usuário", async () => {
    const summaryA = await serviceA.getSummary("userA");
    const summaryB = await serviceB.getSummary("userB");

    expect(summaryA).toEqual({ total: 2, completed: 1, pending: 1 });
    expect(summaryB).toEqual({ total: 1, completed: 0, pending: 1 });
  });

  it("criar tarefa para usuário A não afeta usuário B", async () => {
    mockRepositoryUserA.createForUser.mockResolvedValue({
      id: "99", title: "Nova tarefa A", completed: false,
    });

    await serviceA.createTask({ userId: "userA", title: "Nova tarefa A" });

    expect(mockRepositoryUserA.createForUser).toHaveBeenCalledWith("userA", "Nova tarefa A");
    expect(mockRepositoryUserB.createForUser).not.toHaveBeenCalled();
  });
});