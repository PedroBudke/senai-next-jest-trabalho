/**
 * @jest-environment node
 */

describe("Bônus 4 — MSW: Mock Service Worker", () => {
  it("login bem-sucedido via fetch mockado", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { id: "1", name: "Aluno Demo", email: "aluno@authtask.dev" } }),
    });

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "aluno@authtask.dev", password: "123456" }),
    });

    const data = await response.json() as { user?: { email: string } };
    expect(response.status).toBe(200);
    expect(data.user?.email).toBe("aluno@authtask.dev");
  });

  it("login com credenciais inválidas retorna 401", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Credenciais inválidas." }),
    });

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "errado@test.com", password: "errada" }),
    });

    expect(response.status).toBe(401);
  });

  it("GET /api/tasks retorna lista de tarefas", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        tasks: [
          { id: "1", title: "Tarefa MSW", completed: false },
          { id: "2", title: "Outra tarefa", completed: true },
        ],
      }),
    });

    const response = await fetch("/api/tasks");
    const data = await response.json() as { tasks: { id: string }[] };
    expect(response.status).toBe(200);
    expect(data.tasks).toHaveLength(2);
  });
});