import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "Dados incompletos.", errors: { email: "E-mail é obrigatório." } },
        { status: 400 },
      );
    }

    if (body.email === "aluno@authtask.dev" && body.password === "123456") {
      return HttpResponse.json(
        { user: { id: "1", name: "Aluno Demo", email: "aluno@authtask.dev" } },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: "Credenciais inválidas." },
      { status: 401 },
    );
  }),

  http.get("/api/tasks", () => {
    return HttpResponse.json(
      {
        tasks: [
          { id: "1", title: "Tarefa MSW", completed: false },
          { id: "2", title: "Outra tarefa", completed: true },
        ],
      },
      { status: 200 },
    );
  }),
];