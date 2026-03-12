/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskComposer } from "@/components/dashboard/TaskComposer";

describe("TaskComposer", () => {
  it("renderiza input e botão Adicionar", () => {
    render(<TaskComposer onCreate={jest.fn()} />);
    expect(screen.getByPlaceholderText(/nova tarefa/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeInTheDocument();
  });

  it("exibe erro quando título está vazio", async () => {
    const user = userEvent.setup();
    render(<TaskComposer onCreate={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(await screen.findByText(/digite um título/i)).toBeInTheDocument();
  });

  it("chama onCreate com título correto", async () => {
    const mockCreate = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskComposer onCreate={mockCreate} />);
    await user.type(screen.getByPlaceholderText(/nova tarefa/i), "Estudar Jest");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(mockCreate).toHaveBeenCalledWith("Estudar Jest");
  });

  it("não exibe erro quando formulário está limpo", () => {
    render(<TaskComposer onCreate={jest.fn()} />);
    expect(screen.queryByText(/digite um título/i)).not.toBeInTheDocument();
  });
});