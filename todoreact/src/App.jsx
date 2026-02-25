

import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

   const API_URL = "https://todo-application-backend-yhsh.onrender.com/todolist";

  useEffect( () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((tasks) => 
        setList(tasks)
      )
  }, [] );

  const addTask = () => {
    if(task === ""){
      return alert("Please enter a task");
    }
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask:  task}),
    })
      .then((res) => res.json())
      .then((newtask) => {
        setList([...list, newtask]);
        setTask("");
      });


   
  };

   const complete = (id, status) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !status }),
    })
      .then((res) => res.json())
      .then((newvalue) => {
        const newList = list.map((tasks) => (tasks._id == id ? newvalue : tasks));
        setList(newList);
      });

    
   };


  const deletee = (id) => {

    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
       const newlist = list.filter((t) => t._id != id);
       setList([...newlist]);
    });
    
  };

  return (
    <div className="container">
      <h1> Add your tasks</h1>
      <input
        className="inp"
        value={task}
        onChange={(event) => {
          setTask(event.target.value);
        }}></input>
      <button className="add-btn" onClick={addTask}>
        Add
      </button>
      <ul className="tasklist">
        {list.map((task) => (
          <li key={task._id}>
            <button
              className={`comp-btn ${task.status ? "marked" : ""}`}
              onClick={() => {
                complete(task._id, task.status);
              }}>
              {task.status && ""}
            </button>
            <span className={`tasktext ${task.status ? "taskcomp" : ""}`}>
              {task.userTask}
            </span>
            <button className="dlt-btn"
            onClick={() => {deletee(task._id)}}
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


