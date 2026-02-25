
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "https://todo-application-backend-yhsh.onrender.com/todolist";
  const COUNT_URL = "https://todo-application-backend-yhsh.onrender.com/counts";

  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, completed: 0 });

  // Load tasks when page loads
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        loadCounts();
      });
  }, []);

  // Load the counts
  const loadCounts = () => {
    fetch(COUNT_URL)
      .then((res) => res.json())
      .then((data) => {
        setCounts(data);
      });
  };

  // Add Task
  const addTask = () => {
    const text = taskInput.trim();

    if (text === "") {
      alert("Please enter a task");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: text }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTaskInput("");
        loadCounts();
      });
  };

  // Toggle Complete
  const toggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => {
      const updatedTasks = tasks.map((task) =>
        task._id === id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      loadCounts();
    });
  };

  // Delete Task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      const filteredTasks = tasks.filter((task) => task._id !== id);
      setTasks(filteredTasks);
      loadCounts();
    });
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
          onKeyPress={(e) => {
            if (e.key === "Enter") addTask();
          }}
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