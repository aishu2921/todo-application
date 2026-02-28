import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "https://todo-application-backend-yhsh.onrender.com/todolist";
  const COUNT_URL = "https://todo-application-backend-yhsh.onrender.com/counts";

  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const taskRes = await fetch(API_URL);
    const taskData = await taskRes.json();
    setTasks(taskData);

    const countRes = await fetch(COUNT_URL);
    const countData = await countRes.json();
    setCounts(countData);
  };

  const addTask = async () => {
    if (taskInput.trim() === "") {
      alert("Please enter a task");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: taskInput }),
    });

    setTaskInput("");
    loadData(); // 🔥 reload everything
  };

  const toggleStatus = async (id, currentStatus) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !currentStatus }),
    });

    loadData(); // 🔥 reload everything
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    loadData(); // 🔥 reload everything
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