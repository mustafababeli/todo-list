import "./styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

/* =========================
   PROJECT STUFF
========================= */

const addProjectBtn = document.getElementById("btn-add-project");
const projectDialog = document.getElementById("project-dialog");
const projectForm = document.getElementById("project-form");
const input = document.getElementById("project-name-input");
const projectCancelBtn = document.querySelector(".btn-cancel-project");
const projectDropdown = document.getElementById("projects-dropdown");

const projects = [];

projectCancelBtn.addEventListener("click", () => {
  projectDialog.close();
});

addProjectBtn.addEventListener("click", () => {
  projectDialog.showModal();
});

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const projectName = input.value.trim();
  if (!projectName) return;

  const newProject = new Project(projectName);
  projects.push(newProject);

  const option = document.createElement("option");
  option.value = projectName;
  option.textContent = projectName;
  projectDropdown.appendChild(option);

  input.value = "";
  projectDialog.close();
});

/* =========================
   TODO STUFF
========================= */

const addTodoBtn = document.getElementById("btn-add-todo");
const todoDialog = document.getElementById("todo-dialog");
const todoForm = document.getElementById("todo-form");
const todoCancelBtn = document.getElementById("btn-cancel-todo");
const todoName = document.getElementById("todo-name-input");
const todoDescriptoin = document.getElementById("todo-description-input");
const dueDate = document.getElementById("todo-dueDate-input");

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const priority = document.querySelector(
    'input[name="todo-priority"]:checked',
  )?.value;

  const newTodo = new Todo(
    todoName.value,
    todoDescriptoin.value,
    dueDate.value,
    priority,
  );
  console.log(newTodo);
});

addTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
});

todoCancelBtn.addEventListener("click", () => {
  todoDialog.close();
});
