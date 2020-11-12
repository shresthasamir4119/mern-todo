import React, { Component } from "react";
import axios from "axios";

const Todo = (props) => (
  <tr>
    <td>{props.todo.todo}</td>
    <td>{props.todo.isCompleted ? "true" : "false"}</td>
    <td>
      <a
        href="#"
        onClick={() => {
          props.changeCompleted(props.todo._id);
        }}
      >
        Change Completed
      </a>{" "}
      |
      <a
        href="#"
        onClick={() => {
          props.deleteTodo(props.todo._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

export default class TodoList extends Component {
  constructor(props) {
    super(props);

    this.deleteTodo = this.deleteTodo.bind(this);
    this.getTodo = this.getTodo.bind(this);
    this.changeCompleted = this.changeCompleted.bind(this);

    this.state = { todos: [] };
  }

  componentDidMount() {
    this.getTodo();
  }

  getTodo() {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }

    axios
      .get("http://localhost:50000/todos/", {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        this.setState({ todos: response.data.todos });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  changeCompleted(id) {
    const token = localStorage.getItem("auth-token");

    axios
      .post("http://localhost:50000/todos/" + id, null, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        alert(response.data.msg);
      });

    this.setState({
      todos: this.state.todos.map((el) => {
        if (el._id === id) {
          el.isCompleted = !el.isCompleted;
        }
        return el;
      }),
    });
  }

  deleteTodo(id) {
    const token = localStorage.getItem("auth-token");

    axios
      .delete("http://localhost:50000/todos/" + id, {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        alert(response.data.msg);
      });

    this.setState({
      todos: this.state.todos.filter((el) => el._id !== id),
    });
  }

  todoList() {
    return this.state.todos.map((currentTodo) => {
      return (
        <Todo
          todo={currentTodo}
          deleteTodo={this.deleteTodo}
          key={currentTodo._id}
          changeCompleted={this.changeCompleted}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>All Todo</h3>
        <table className="table">
          <thead className="thead">
            <tr>
              <th>Todo</th>
              <th>Is Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}
