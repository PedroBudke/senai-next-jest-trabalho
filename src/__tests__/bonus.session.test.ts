/**
 * @jest-environment node
 */
import { createSessionToken, verifySessionToken } from "@/services/auth/session.service";

const mockUser = { id: "1", name: "Test", email: "test@test.com" };

beforeEach(() => {
  process.env.AUTH_SESSION_SECRET = "test-secret";
});

describe("Bônus 1 — Fake Timers: expiração de token", () => {
  it("verifySessionToken retorna payload quando token é válido", () => {
    const token = createSessionToken(mockUser);
    const result = verifySessionToken(token);
    expect(result).not.toBeNull();
    expect(result?.user.email).toBe("test@test.com");
  });

  it("verifySessionToken retorna null após expiração do token", () => {
    jest.useFakeTimers();

    const token = createSessionToken(mockUser);

    // Avança 9 horas (além do TTL de 8 horas)
    jest.advanceTimersByTime(9 * 60 * 60 * 1000);

    // Força Date.now() a refletir o tempo avançado
    const result = verifySessionToken(token);
    expect(result).toBeNull();

    jest.useRealTimers();
  });

  it("verifySessionToken retorna null para token inválido", () => {
    expect(verifySessionToken("token.invalido")).toBeNull();
  });

  it("verifySessionToken retorna null para token undefined", () => {
    expect(verifySessionToken(undefined)).toBeNull();
  });

  it("verifySessionToken retorna null para token com assinatura adulterada", () => {
    const token = createSessionToken(mockUser);
    const [payload] = token.split(".");
    const tampered = `${payload}.assinatura_falsa`;
    expect(verifySessionToken(tampered)).toBeNull();
  });
});