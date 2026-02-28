import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "https://todo-application-backend-yhsh.onrender.com/todolist";
  const COUNT_URL = "https://todo-application-backend-yhsh.onrender.com/counts";

  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    loadTasks();
    loadCounts();
  }, []);

  // ================= LOAD TASKS =================
  const loadTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  // ================= LOAD COUNTS =================
  const loadCounts = async () => {
    const res = await fetch(COUNT_URL);
    const data = await res.json();
    setCounts(data);
  };

  // ================= ADD TASK =================
  const addTask = async () => {
    const text = taskInput.trim();
    if (text === "") {
      alert("Please enter a task");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: text }),
    });

    setTaskInput("");

    await loadTasks();   // 🔥 reload from DB
    await loadCounts();  // 🔥 reload counts
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (id, currentStatus) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !currentStatus }),
    });

    await loadTasks();
    await loadCounts();
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    await loadTasks();
    await loadCounts();
  };

  return (
    <div>
      <h1>To-Do List</h1>

      <div className="container">
        <input
          type="text"
          placeholder="Enter a task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <p>
        Total: {counts.total} | Completed: {counts.completed}
      </p>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`checkBtn ${
                  task.status ? "completedCircle" : ""
                }`}
                onClick={() => toggleStatus(task._id, task.status)}
              ></div>

              <span
                style={{ marginLeft: "10px" }}
                className={task.status ? "completed" : ""}
              >
                {task.userTask}
              </span>
            </div>

            <button
              className="deleteBtn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;