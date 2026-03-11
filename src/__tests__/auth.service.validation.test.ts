import { hasValidationErrors, validateLoginPayload } from "@/services/auth/auth.service";

describe("validateLoginPayload", () => {
  it("retorna erro quando e-mail está vazio", () => {
    const result = validateLoginPayload({ email: "", password: "123456" });
    expect(result.email).toBe("E-mail é obrigatório.");
  });

  it("retorna erro quando formato de e-mail é inválido", () => {
    const result = validateLoginPayload({ email: "invalido", password: "123456" });
    expect(result.email).toBe("Formato de e-mail inválido.");
  });

  it("retorna erro quando senha está vazia", () => {
    const result = validateLoginPayload({ email: "a@b.com", password: "123" });
    expect(result.password).toBe("Senha é obrigatória.");
  });

  it("retorna erro quando senha é muito curta", () => {
    const result = validateLoginPayload({ email: "a@b.com", password: "12345" });
    expect(result.password).toBe("Senha deve conter pelo menos 6 caracteres.");
  });

  it("retorna objeto vazio quando dados são válidos", () => {
    const result = validateLoginPayload({ email: "a@b.com", password: "123456" });
    expect(result).toEqual({});
  });

  it("ignora espaços em branco (trim) e valida corretamente", () => {
    const result = validateLoginPayload({ email: " a@b.com ", password: " 123456 " });
    expect(result).toEqual({});
  });
});

describe("hasValidationErrors", () => {
  it("retorna false quando não há erros", () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it("retorna true quando há erros", () => {
    expect(hasValidationErrors({ email: "E-mail é obrigatório." })).toBe(true);
  });
});