/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor  } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

const mockLogout = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "1", name: "Test", email: "test@test.com" },
    logout: mockLogout,
    isLoading: false,
  }),
}));

beforeEach(() => {
  mockLogout.mockReset();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ tasks: [] }),
  });
});

describe("DashboardClient", () => {
  it("renderiza cabeçalho com título do painel", async () => {
    render(<DashboardClient />);
    expect(await screen.findByText("Painel de Tarefas")).toBeInTheDocument();
  });

  it("exibe e-mail do usuário autenticado", async () => {
    render(<DashboardClient />);
    expect(await screen.findByText(/test@test\.com/i)).toBeInTheDocument();
  });

  it("renderiza botão Logout", async () => {
    render(<DashboardClient />);
    expect(await screen.findByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("chama logout ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<DashboardClient />);
    await user.click(await screen.findByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("exibe erro quando fetch falha", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Erro ao carregar tarefas." }),
    });
    render(<DashboardClient />);
    expect(await screen.findByText("Erro ao carregar tarefas.")).toBeInTheDocument();
  });
  
  it("cria tarefa e adiciona à lista", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [{ id: "1", title: "Tarefa existente", completed: false }] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ task: { id: "2", title: "Nova tarefa", completed: false } }),
    });

  const user = userEvent.setup();
  render(<DashboardClient />);
  await screen.findByText("Painel de Tarefas");

  const input = screen.getByPlaceholderText(/nova tarefa/i);
  await user.type(input, "Nova tarefa");
  await user.click(screen.getByRole("button", { name: /adicionar/i }));

  expect(await screen.findByText("Nova tarefa")).toBeInTheDocument();
});

it("deleta tarefa da lista", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [{ id: "1", title: "Tarefa para deletar", completed: false }] }),
    })
    .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  const user = userEvent.setup();
  render(<DashboardClient />);
  await screen.findByText("Tarefa para deletar");

  await user.click(screen.getByRole("button", { name: /deletar/i }));
  await waitFor(() => {
    expect(screen.queryByText("Tarefa para deletar")).not.toBeInTheDocument();
  });
});

it("toggle tarefa como concluída", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [{ id: "1", title: "Tarefa toggle", completed: false }] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ task: { id: "1", title: "Tarefa toggle", completed: true } }),
    });

  const user = userEvent.setup();
  render(<DashboardClient />);
  await screen.findByText("Tarefa toggle");

  const checkbox = screen.getByRole("checkbox");
  await user.click(checkbox);
  expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});