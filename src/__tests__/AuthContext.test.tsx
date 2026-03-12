/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

function TestConsumer() {
  const { user, login } = useAuth();
  return (
    <div>
      <span data-testid="user-email">{user?.email ?? "null"}</span>
      <button onClick={() => login("a@b.com", "123456")}>Login</button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("filhos recebem valor do contexto", () => {
    render(
      <AuthProvider initialUser={{ id: "1", name: "Test", email: "test@test.com" }}>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("ERRADO_PROPOSITAL"); // 🔴 Red
  });

  it("estado inicial user é o initialUser passado", () => {
    render(
      <AuthProvider initialUser={{ id: "1", name: "Test", email: "test@test.com" }}>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("test@test.com");
  });

  it("estado inicial user é null quando não passado", () => {
    render(
      <AuthProvider initialUser={null}>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("null");
  });

  it("atualiza user após login bem-sucedido", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1", name: "Test", email: "a@b.com" } }),
    });

    render(
      <AuthProvider initialUser={null}>
        <TestConsumer />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("a@b.com");
    });
  });

  it("chama router.push para /dashboard após login", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1", name: "Test", email: "a@b.com" } }),
    });

    render(
      <AuthProvider initialUser={null}>
        <TestConsumer />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});

describe("useAuth fora do Provider", () => {
  it("lança erro quando usado fora do AuthProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    function ComponenteSemProvider() {
      useAuth();
      return null;
    }

    expect(() => render(<ComponenteSemProvider />)).toThrow(
      "useAuth deve ser usado dentro de <AuthProvider />.",
    );

    consoleError.mockRestore();
  });
});