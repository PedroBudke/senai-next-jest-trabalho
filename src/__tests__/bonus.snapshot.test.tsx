/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import { TaskList } from "@/components/dashboard/TaskList";
import { TaskComposer } from "@/components/dashboard/TaskComposer";

/**
 * Snapshots são úteis aqui porque:
 * - TaskList com lista vazia tem UI estável — qualquer mudança acidental
 *   na mensagem "Nenhuma tarefa" seria detectada imediatamente.
 * - TaskComposer renderiza estrutura fixa de input + botão —
 *   snapshots garantem que refatorações não alterem a UI sem revisão.
 */

describe("Bônus 2 — Snapshot Tests", () => {
  it("TaskList vazia corresponde ao snapshot", () => {
    const { container } = render(
      <TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("TaskList com itens corresponde ao snapshot", () => {
    const tasks = [
      { id: "1", title: "Estudar Jest", completed: false },
      { id: "2", title: "Fazer exercícios", completed: true },
    ];
    const { container } = render(
      <TaskList tasks={tasks} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("TaskComposer corresponde ao snapshot", () => {
    const { container } = render(<TaskComposer onCreate={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});