import React, { Component } from "react";
import axios from "axios";

import "./todo.css";

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
    this.showAll = this.showAll.bind(this);
    this.showInComplete = this.showInComplete.bind(this);
    this.showCompleted = this.showCompleted.bind(this);
    this.changeTodoText = this.changeTodoText.bind(this);
    this.addTodo = this.addTodo.bind(this);

    this.state = { todos: [], title: "All Todos", todoText: "" };
  }

  componentDidMount() {
    this.getTodo();
    this.setState({
      title: "All Todos",
    });
  }

  async showAll() {
    await this.getTodo();
  }

  async showCompleted() {
    await this.getTodo();
    this.setState({
      todos: this.state.todos.filter((todo) => todo.isCompleted === true),
      title: "Completed",
    });
  }

  async showInComplete() {
    await this.getTodo();
    this.setState({
      todos: this.state.todos.filter((todo) => todo.isCompleted === false),
      title: "Incomplete",
    });
  }

  async getTodo() {
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }

    await axios
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

  changeTodoText(e) {
    this.setState({
      todoText: e.target.value,
    });
  }

  async addTodo() {
    const token = localStorage.getItem("auth-token");
    const payload = {
      todo: this.state.todoText,
    };

    await axios
      .post("http://localhost:50000/todos/", payload, {
        headers: { "x-auth-token": token },
      })
      .then((res) => alert(res.data.msg));

    this.setState({
      todoText: "",
    });

    if (this.state.title === "All Todos") this.showAll();
    if (this.state.title === "Completed") this.showCompleted();
    if (this.state.title === "Incomplete") this.showInComplete();
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
      <div className="todo">
        <h3>{this.state.title}</h3>
        <div>
          <input
            placeholder="Add todo"
            value={this.state.todoText}
            onChange={this.changeTodoText}
          ></input>
          <button type="button" onClick={this.addTodo}>
            ADD
          </button>
        </div>
        <button onClick={this.showAll}>All</button>
        <button onClick={this.showCompleted}>completed</button>
        <button onClick={this.showInComplete}>incomplete</button>
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
