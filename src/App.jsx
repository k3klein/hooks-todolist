import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import 'uikit/dist/css/uikit.css';
import UIkit from 'uikit';
import './App.css';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/js/uikit.js';

UIkit.use(Icons);

function Task({ index, task, removeTask, setCompleted }) {
  //const [completed, setCompleted] = useState(false);
  return (
    <div className={"uk-container uk-animation-fade uk-margin-top"}>
      {/*console.log(task.text)*/}
      <span className={"uk-text-lead uk-text-middle uk-text-break"}>{task.completed ? <s>{task.text}</s> : task.text}</span>
      <div className={"uk-align-right"}>
        <button className={"uk-button uk-button-default uk-margin-left uk-margin-right"} onClick={() => setCompleted(index)}>Completed</button>
        <button className={"uk-button uk-button-danger"} onClick={() => removeTask(index)}>X</button>
      </div>
      <hr className={"uk-divider-small"} />
    </div>
  );
}

function Input({ addTask }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  }

  const handleKey = e => {
    if (e.key === 'Enter') {
      (text !== "" ? addTask(text) : UIkit.notification('Please type in something.', 'danger'));
    }
  }

  return (
    <div>
      <input className={"uk-input"} placeholder={"Write something here."} type="text" onKeyPress={handleKey} onChange={handleChange} />
      <button className={"uk-button uk-button-primary uk-margin-top"} onClick={() => { text !== "" ? addTask(text) : UIkit.notification('Please type in something.', 'danger') }}>Add Task</button>
    </div>
  );
}


function App() {
  const initialTasks = () => JSON.parse(window.localStorage.getItem("tasks")) ||
    [
      { text: "Hi, this is a Task!", completed: false }
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
    if (tasks.length === 0) {
      UIkit.notification('No tasks.', 'danger');
    } else {
      let newTasks = [...tasks];
      for (let index = 0; index < newTasks.length; index++) {
        const element = newTasks[index];
        element.completed = true;
      }
      setTasks(newTasks);
    }
  }

  const removeAllTasks = () => {
    UIkit.modal.confirm('Are you sure?').then(function () {
      console.log('Confirmed.')
      setTasks([]);
    }, function () {
      console.log('Rejected.')
    });
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
      FileSaver.saveAs(blob, "tasks.txt");
    } else {
      UIkit.notification('Add one task at least.', 'danger');
    }

  }


  return (
    <React.Fragment>
      <h1 className={"uk-background-primary uk-padding-small uk-animation-fade uk-text-bold"}>Neat Task Manager</h1>
      <div className={"uk-container uk-animation-fade uk-margin-large-top"}>
        <h1 className={"uk-text-primary"}><p>Remaining Tasks: {tasks.filter(task => task.completed === false).length}</p></h1>
        <h5><p>Total Tasks: <span className="uk-badge">{tasks.length}</span></p></h5>
        {tasks.map((task, index) => <Task key={index} index={index} task={task} removeTask={removeTask} setCompleted={setCompleted} />)}
        <hr className="uk-divider-icon"></hr>
        <Input addTask={addTask} />
        <div className={"uk-margin-large-bottom"}>
          <button className={"uk-button uk-button-default uk-margin-top uk-margin-right"} onClick={setAllCompleted}>Set all to Completed</button>
          <button className={"uk-button uk-button-default uk-margin-top uk-margin-right"} onClick={removeAllTasks}>Remove all Tasks</button>
          <button className={"uk-button uk-button-default uk-margin-top uk-margin-right"} onClick={saveTasks}>
            <span uk-icon="download"></span> Save all tasks as txt
          </button>
        </div>
      </div >
    </React.Fragment>
  );
}

export default App;