import {
  addTodoBtn,
  todoCancelBtn,
  deleteTodoDialog,
  confirmDeleteTodoBtn,
  cancelDeleteTodoBtn,
} from "./todo-btn-reference.js";

import {
  projects,
  projectPopupDialog,
  saveProjects,
} from "./project-dialog-logic.js";

import Todo from "../todo.js";

import { projectDropdown } from "./project-dialog-logic.js";

import getDaysLeft from "../utils/days-left.js";

const todoDialog = document.getElementById("todo-dialog");
const todoForm = document.getElementById("todo-form");
const todoName = document.getElementById("todo-name-input");
const todoDescription = document.getElementById("todo-description-input");
const dueDate = document.getElementById("todo-dueDate-input");

function renderTodo(todo, projectName) {
  // Calculate due date text
  const daysLeft = getDaysLeft(todo.dueDate);

  let dueText;
  if (daysLeft === null) {
    dueText = "No due date";
  } else if (daysLeft < 0) {
    dueText = `Overdue by ${Math.abs(daysLeft)} days`;
  } else if (daysLeft === 0) {
    dueText = "Due today";
  } else {
    dueText = `${daysLeft} days left`;
  }

  // Create todo container
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  todoItem.dataset.todoId = todo.id;

  // click -> open delete dialog
  todoItem.addEventListener("click", () => {
    todoToDelete = todoItem;
    deleteTodoDialog.showModal();
  });

  const todoNameEL = document.createElement("a");
  todoNameEL.classList.add("todo-name");
  todoNameEL.textContent = todo.title;

  const tododescriptionEL = document.createElement("a");
  tododescriptionEL.classList.add("todo-description");
  tododescriptionEL.textContent = todo.description;

  const todoDateEL = document.createElement("a");
  todoDateEL.classList.add("todo-date");
  todoDateEL.textContent = dueText;

  const todoPriorityEL = document.createElement("div");
  todoPriorityEL.classList.add("todo-priority");
  todoPriorityEL.textContent = todo.priority;
  todoPriorityEL.classList.add(`priority-${todo.priority}`);

  todoItem.appendChild(todoNameEL);
  todoItem.appendChild(tododescriptionEL);
  todoItem.appendChild(todoDateEL);
  todoItem.appendChild(todoPriorityEL);

  const projectDiv = document.querySelector(
    `[data-project-name="${projectName}"]`,
  );
  if (!projectDiv) return;

  const projectTodos = projectDiv.querySelector(".project-todos");
  if (!projectTodos) return;

  projectTodos.appendChild(todoItem);
}

/* =====================TODO MODAL CONTROLS====================== */

/* Open todo creation modal */
addTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
});

/* Close todo creation modal */
todoCancelBtn.addEventListener("click", () => {
  todoDialog.close();
});

/* =====================TODO CREATION LOGIC==================== */

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedProjectName = projectDropdown.value;
  const project = projects.find((p) => p.name === selectedProjectName);

  const priority = document.querySelector(
    'input[name="todo-priority"]:checked',
  )?.value;

  const newTodo = new Todo(
    todoName.value,
    todoDescription.value,
    dueDate.value,
    priority,
  );

  if (projects.length === 0) {
    todoDialog.close();
    projectPopupDialog.showModal();
    return;
  }

  if (!project) return;

  project.addTodo(newTodo);
  saveProjects();
  renderTodo(newTodo, selectedProjectName);

  todoDialog.close();
});

let todoToDelete = null;

/* Cancel delete */
cancelDeleteTodoBtn.addEventListener("click", () => {
  deleteTodoDialog.close();
  todoToDelete = null;
});

/* Confirm delete (MODEL + DOM) */
confirmDeleteTodoBtn.addEventListener("click", () => {
  if (!todoToDelete) return;

  const todoId = todoToDelete.dataset.todoId;
  const projectDiv = todoToDelete.closest(".project-div");
  const projectName = projectDiv?.dataset.projectName;

  if (projectName && todoId) {
    const project = projects.find((p) => p.name === projectName);
    if (project) {
      project.todos = project.todos.filter((t) => t.id !== todoId);
      saveProjects();
    }
  }

  todoToDelete.remove();
  deleteTodoDialog.close();
  todoToDelete = null;
});

// Render todos that were loaded from localStorage
projects.forEach((project) => {
  project.todos.forEach((todo) => {
    renderTodo(todo, project.name);
  });
});
