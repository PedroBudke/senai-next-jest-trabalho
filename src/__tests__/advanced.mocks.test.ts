/**
 * @jest-environment node
 */
import { POST } from "@/app/api/login/route";
import { AppError } from "@/utils/app-error";

jest.mock("@/services/auth/auth.service", () => ({
  validateLoginPayload: jest.fn().mockReturnValue({}),
  hasValidationErrors: jest.fn().mockReturnValue(false),
  authenticateUser: jest.fn(),
}));

jest.mock("@/services/auth/session.service", () => ({
  createSessionToken: jest.fn().mockReturnValue("fake-token"),
  getSessionCookieOptions: jest.fn().mockReturnValue({
    name: "session",
    cookieOptions: { httpOnly: true, path: "/" },
  }),
}));

import {
  authenticateUser,
  hasValidationErrors,
  validateLoginPayload,
} from "@/services/auth/auth.service";

const mockAuthenticateUser = authenticateUser as jest.Mock;
const mockHasValidationErrors = hasValidationErrors as jest.Mock;
const mockValidateLoginPayload = validateLoginPayload as jest.Mock;

function makeRequest(body: object) {
  return new Request("http://localhost/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockValidateLoginPayload.mockReturnValue({});
  mockHasValidationErrors.mockReturnValue(false);
});

describe("Erro 500 da API", () => {
  it("retorna 500 quando authenticateUser lança erro inesperado", async () => {
    mockAuthenticateUser.mockRejectedValue(new Error("Erro interno do servidor"));

    const response = await POST(makeRequest({ email: "a@b.com", password: "123456" }));
    expect(response.status).toBe(999); // errado proposital
  });
});

describe("Mock condicional de authenticateUser", () => {
  it("retorna 200 na primeira chamada e 401 na segunda", async () => {
    mockAuthenticateUser
      .mockResolvedValueOnce({ id: "1", name: "User", email: "a@b.com" })
      .mockRejectedValueOnce(new AppError("INVALID_CREDENTIALS", "Inválido.", 401));

    const first = await POST(makeRequest({ email: "a@b.com", password: "123456" }));
    expect(first.status).toBe(200);

    const second = await POST(makeRequest({ email: "a@b.com", password: "errada" }));
    expect(second.status).toBe(401);
  });

  it("retorna 401 quando credenciais são inválidas", async () => {
    mockAuthenticateUser.mockRejectedValue(
      new AppError("INVALID_CREDENTIALS", "Credenciais inválidas.", 401),
    );

    const response = await POST(makeRequest({ email: "errado@test.com", password: "123456" }));
    expect(response.status).toBe(401);
  });
});

describe("Timeout na requisição", () => {
  it("trata timeout ao chamar authenticateUser", async () => {
    mockAuthenticateUser.mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 100),
        ),
    );

    const response = await POST(makeRequest({ email: "a@b.com", password: "123456" }));
    expect(response.status).toBe(500);
  }, 3000);
});

describe("spyOn global.fetch", () => {
  it("trata erro 500 simulado via spyOn", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Erro interno" }),
    } as Response);

    const response = await fetch("/api/login");
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);

    fetchSpy.mockRestore();
  });
});