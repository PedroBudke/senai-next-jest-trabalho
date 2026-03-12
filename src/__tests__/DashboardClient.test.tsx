/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
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
});