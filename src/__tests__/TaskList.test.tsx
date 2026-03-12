/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "@/components/dashboard/TaskList";

const mockTasks = [
  { id: "1", title: "Estudar Jest", completed: false },
  { id: "2", title: "Fazer exercícios", completed: true },
];

describe("TaskList", () => {
  it("exibe mensagem quando lista está vazia", () => {
    render(<TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/nenhuma tarefa/i)).toBeInTheDocument();
  });

  it("renderiza itens da lista", () => {
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Estudar Jest")).toBeInTheDocument();
    expect(screen.getByText("Fazer exercícios")).toBeInTheDocument();
  });

  it("renderiza botões Deletar para cada tarefa", () => {
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getAllByRole("button", { name: /deletar/i })).toHaveLength(2);
  });

  it("chama onDelete ao clicar em Deletar", async () => {
    const mockDelete = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={mockDelete} />);
    await user.click(screen.getAllByRole("button", { name: /deletar/i })[0]);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("chama onToggle ao clicar no checkbox", async () => {
    const mockToggle = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskList tasks={mockTasks} onToggle={mockToggle} onDelete={jest.fn()} />);
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    expect(mockToggle).toHaveBeenCalledWith("1", true);
  });

  it("não exibe botão Deletar quando lista está vazia", () => {
    render(<TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.queryByRole("button", { name: /deletar/i })).not.toBeInTheDocument();
  });
});