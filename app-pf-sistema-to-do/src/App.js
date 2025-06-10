import React, { useState, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const theme = {
  colors: {
    primary: "#6200ea",
    background: "#f5f5f5",
    surface: "#ffffff",
    error: "#b00020",
    text: "#000000",
  },
  transition: "all 0.3s ease",
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: url("https://img.freepik.com/fotos-gratis/fundo-de-papel-de-parede-colorido-embacado-artistico_58702-8664.jpg?semt=ais_hybrid&w=740") no-repeat center center fixed;
    background-size: cover;
  }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 40px auto;
  background: transparent;
`;

const FormWrapper = styled.div`
  background: rgba(255, 255, 255, 0.9); /* branco semi-transparente */
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  margin-bottom: 30px;
`;

const TaskForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  max-width: 400px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #3700b3;
  border-radius: 4px;
  outline: none;
  transition: ${(props) => props.theme.transition};

  &:focus {
    border-color: #6200ea;
  }
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #3700b3;
  border-radius: 4px;
  outline: none;
  transition: ${(props) => props.theme.transition};
  &:focus {
    border-color: #6200ea;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: ${(props) => props.theme.transition}; /* SUAVE */

  &:hover {
    background-color: #3700b3;
  }
`;

const TaskItem = styled.div`
  background: #f2e7fe;
  margin-bottom: 10px;
  padding: 10px;
  border-left: 5px solid #3700b3;
  transition: ${(props) => props.theme.transition};
  max-width: 400px;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    };
    return stored ? JSON.parse(stored) : [];
  });

  const [form, setForm] = useState({
    title: "",
    category: "",
    customCategory: "",
    status: "",
    priority: "",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setShowOtherCategory(value === "Outros");
      setForm({ ...form, category: value, customCategory: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryFinal =
      form.category === "Outros" ? form.customCategory : form.category;
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Título é obrigatório.";
    if (!form.category.trim()) newErrors.category = "Categoria é obrigatória.";

    setErrors(newErrors);
    const startEdit = (task) => {
      setForm({
        title: task.title,
        category: task.category,
        customCategory: task.category === "Outros" ? task.category : "",
        status: task.status,
        priority: task.priority,
      });
      setEditingTaskId(task.id);
    };

    if (Object.keys(newErrors).length > 0) {
      return; // tem erro, não salva
    }

    const newTask = {
      title: form.title,
      category: categoryFinal,
      status: form.status,
      priority: form.priority,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);

    setForm({
      title: "",
      category: "",
      status: "pendente",
      priority: "Baixa",
    });

    setErrors({});
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const startEdit = (task) => {
    setForm({
      title: task.title,
      category: task.category,
      customCategory: task.category === "Outros" ? task.category : "",
      status: task.status,
      priority: task.priority,
    });
    setEditingTaskId(task.id);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <h1 style={{ textAlign: "center", color: "#fff" }}>
          Organizador de Tarefas
        </h1>

        <FormWrapper>
          <TaskForm onSubmit={handleSubmit}>
            <Input
              name="title"
              placeholder="Título da Tarefa"
              value={form.title}
              onChange={handleChange}
              style={{ borderColor: errors.title ? "red" : undefined }}
            />
            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Estudos">Estudos</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Saúde">Saúde</option>
              <option value="Casa">Casa</option>
              <option value="Compras">Compras</option>
              <option value="Viagem">Viagem</option>
              <option value="Projetos">Projetos</option>
              <option value="Lazer">Lazer</option>
              <option value="Urgente">Urgente</option>
              <option value="Outros">Outros</option>
            </Select>
            {form.category === "Outros" && (
              <Input
                name="customCategory"
                placeholder="Digite a categoria"
                value={form.customCategory}
                onChange={handleChange}
              />
            )}
            {errors.title && (
              <small style={{ color: "red" }}>{errors.title}</small>
            )}

            {errors.category && (
              <small style={{ color: "red" }}>{errors.category}</small>
            )}

            <Select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="">Selecione Prioridade</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </Select>
            <Select name="status" value={form.status} onChange={handleChange}>
              <option value="">Selecione Status</option>

              <option value="pendente">Pendente</option>
              <option value="concluída">Concluída</option>
            </Select>

            <Button type="submit">Adicionar Tarefa</Button>
          </TaskForm>
        </FormWrapper>

        {tasks.map((task) => (
          <TaskItem key={task.id}>
            <p>
              <strong>Título:</strong> {task.title}
            </p>
            <p>
              <strong>Categoria:</strong> {task.category}
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(task.date).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Prioridade:</strong> {task.priority}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Button onClick={() => startEdit(task)}>Editar</Button>
              <Button onClick={() => deleteTask(task.id)}>Excluir</Button>
            </div>
          </TaskItem>
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default App;
