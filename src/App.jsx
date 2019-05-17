import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit';
import './App.css';

function Task({ index, task, removeTask, setCompleted }) {
  //const [completed, setCompleted] = useState(false);
  return (
    <div className={"uk-container uk-animation-fade"}>
      {/*console.log(task.text)*/}
      {task.completed ? <s>{task.text}</s> : task.text}
      <button className={"uk-button uk-button-default uk-margin-left uk-margin-right uk-align-right"} onClick={() => setCompleted(index)}>Completed</button>
      <button className={"uk-button uk-button-danger uk-align-right"} onClick={() => removeTask(index)}>X</button>
    </div>
  );
}

function Input({ addTask }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  }
  return (
    <div>
      <input className={"uk-input"} placeholder={"Write something here."} type="text" onChange={handleChange} />
      <button className={"uk-button uk-button-default"} onClick={() => { text !== "" ? addTask(text) : alert("Enter Text to add.") }}>Add Task</button>
    </div>
  );
}


function App() {
  const initialTasks = () => JSON.parse(window.localStorage.getItem("tasks")) ||
    [
      { text: "Task Number 1", completed: false },
      { text: "Task Number 2", completed: false },
      { text: "Task Number 3", completed: false },
      { text: "Task Number 4", completed: false },
    ];

  //console.log(JSON.parse(window.localStorage.getItem("tasks")));

  //init state from local storage
  const [tasks, setTasks] = useState(initialTasks);

  const setCompleted = (index) => {
    let newTasks = [...tasks];
    const text = newTasks[index].text;
    const completed = !newTasks[index].completed;
    newTasks[index] = { text, completed };
    setTasks(newTasks);
  }

  const setAllCompleted = () => {
    let newTasks = [...tasks];
    for (let index = 0; index < newTasks.length; index++) {
      const element = newTasks[index];
      element.completed = true;
    }
    setTasks(newTasks);
  }

  const removeAllTasks = () => {
    setTasks([]);
  }

  useEffect(() => {
    document.title = "Task List || Total Tasks: " + tasks.length;
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  const addTask = (text) => {
    const newTasks = [...tasks, { text: text, completed: false }];
    setTasks(newTasks);
  }

  const removeTask = (index) => {
    let newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  }

  const saveTasks = () => {
    if (tasks.length !== 0) {
      let text = "";
      for (let index = 0; index < tasks.length; index++) {
        const element = tasks[index];
        text += ("Task Number " + (index + 1) + ":   " + element.text + "   \n\n");
      }
      console.log(text);
      var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "hello world.txt");
    } else {
      window.alert("At least add one task.");
    }

  }


  return (
    <div className={"uk-container uk-animation-fade"}>
      <p><h1>Remaining Tasks: {tasks.filter(task => task.completed === false).length}</h1></p>
      <p><h3>Total Tasks: {tasks.length}</h3></p>
      {tasks.map((task, index) => <Task key={index} index={index} task={task} removeTask={removeTask} setCompleted={setCompleted} />)}
      <Input addTask={addTask} />
      <button className={"uk-button uk-button-default"} onClick={setAllCompleted}>Set all to Completed</button>
      <button className={"uk-button uk-button-default"} onClick={removeAllTasks}>Remove all Tasks</button>
      <button className={"uk-button uk-button-default"} onClick={saveTasks}>Save all tasks as txt</button>
    </div>
  );
}

export default App;