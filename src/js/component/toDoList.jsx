import React, { useEffect, useState } from "react";

const ToDoList = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const database =
    "https://playground.4geeks.com/apis/fake/todos/user/ekaterinachavan";
  
//FETCH DATA
  useEffect(() => {
    
    fetch(database)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((savedTasks) => {
        setTasks(savedTasks);
      })
      .catch((error) => {
        if (error.status === 404) {
          fetch(database, {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((resp) => {
              console.log(resp.ok);
              console.log(resp.status);
              console.log(resp.text());
              return resp.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  }, []);

  //UPDATE TASKS WHEN TASKS ARE ADDED
  useEffect(() => {
    const updateTasksOnServer = async () => {
      try {
        if (tasks.length > 0) {
          const response = await fetch(database, {
            method: "PUT",
            body: JSON.stringify(tasks),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
        } else {
          console.log("No tasks to send in the PUT request");
        }
      } catch (error) {
        console.error("Error updating tasks:", error);
      }
    };
    updateTasksOnServer();
  }, [tasks]);


  function addTask(e) {

    e.preventDefault();
    if (newTask == "" || newTask.trim() == "") {
      alert("Please input a task");
    } else {
      setTasks((prev) => prev.concat([{ label: newTask, done: false }]));
      setNewTask("");
    }
  };

  //DELETE ALL TASKS
  function deleteAllTasks(e) {
    
    fetch(database, {
      method: "DELETE",
      body: JSON.stringify(tasks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((savedTasks) => {
        setTasks(savedTasks);
      })
      .catch((error) => {
        console.log("Looks like there was a problem: \n", error);
      });
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <ul className="list-group col-4 p-0 paper rounded-0">
        <h1 className="display-5 text-center list-group-item list-group-item-info m-0 text-primary-emphasis">
          My Tasks
        </h1>

        <form onSubmit={addTask}>
          <div>
            <input
              type="text"
              onChange={(e) => setNewTask(e.target.value)}
              value={newTask}
              className={`form-control list-group-item ${
                tasks.length > 0 ? "ps-5" : ""
              }`}
            />
          </div>
        </form>
        {tasks.length == 0 ? (
          <li className="list-group-item text-success">
            Nothing to do! You can chill <i className="far fa-grin-stars"></i>
          </li>
        ) : (
          tasks.map((task, index) => (
            <li
              className="list-group-item ps-5 d-flex justify-content-between align-items-center"
              key={index}
            >
              {task.label}{" "}
              <button
                className="btn"
                onClick={() =>
                  setTasks(
                    tasks.filter((item, currentIndex) => index != currentIndex)
                  )
                }
              >
                <i id="trash" className="fas fa-trash-alt text-white"></i>
              </button>
            </li>
          ))
        )}

        <li
          className="list-group-item text-body-tertiary ps-3"
          style={{ fontSize: "12px" }}
        >
          {tasks.length == 0
            ? "No pending tasks"
            : tasks.length == 1
            ? "1 pending task"
            : `${tasks.length} pending tasks`}{" "}
          <button
            type="button"
            onClick={deleteAllTasks}
            className="btn p-0 border-0"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            data-bs-title="Delete all"
          >
            <i
              id="master-trash"
              className="fas fa-trash-alt text-white ms-2"
            ></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ToDoList;
