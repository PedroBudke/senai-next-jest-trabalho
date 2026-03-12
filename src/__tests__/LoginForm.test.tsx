/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/LoginForm";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => null }),
}));

const mockLogin = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
  }),
}));

beforeEach(() => {
  mockLogin.mockReset();
});

describe("LoginForm", () => {
  it("renderiza campo de e-mail e senha", () => {
    render(<LoginForm />);
    expect(screen.getByRole("textbox", { name: /e-mail/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it("renderiza botão Entrar", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("exibe erro quando login falha", async () => {
    mockLogin.mockResolvedValue({ ok: false, message: "Credenciais inválidas." });
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText("Credenciais inválidas.")).toBeInTheDocument();
  });

  it("não exibe erro quando formulário está limpo", () => {
    render(<LoginForm />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});