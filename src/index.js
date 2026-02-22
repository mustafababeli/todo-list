import "./styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

function getDaysLeft(dueDateString) {
  if (!dueDateString) return null;

  const today = new Date();
  const due = new Date(dueDateString);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/* =================PROJECT DOM REFERENCES=================== */

const addProjectBtn = document.getElementById("btn-add-project");
const projectDialog = document.getElementById("project-dialog");
const projectForm = document.getElementById("project-form");
const input = document.getElementById("project-name-input");
const projectCancelBtn = document.querySelector(".btn-cancel-project");
const projectDropdown = document.getElementById("projects-dropdown");

/* project storage */
const projects = [];

/* =================PROJECT MODAL CONTROLS=================== */

/* Open project creation modal */
addProjectBtn.addEventListener("click", () => {
  projectDialog.showModal();
});

/* Close project creation moda */
projectCancelBtn.addEventListener("click", () => {
  projectDialog.close();
});

/* =================PROJECT CREATION LOGIC=================== */

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const projectName = input.value.trim();
  if (!projectName) return;

  // Create project model
  const newProject = new Project(projectName);
  projects.push(newProject);

  // Add project to dropdown selector
  const option = document.createElement("option");
  option.value = projectName;
  option.textContent = projectName;
  projectDropdown.appendChild(option);

  // Create project container
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-div");
  projectDiv.dataset.projectName = projectName;

  // Create title wrapper
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title-div");

  // Create project title
  const projectTitle = document.createElement("h4");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = projectName;

  // Container where todos will be inserted
  const projectTodos = document.createElement("div");
  projectTodos.classList.add("project-todos");

  // Assemble structure
  projectDiv.appendChild(titleDiv);
  titleDiv.appendChild(projectTitle);
  projectDiv.appendChild(projectTodos);

  // Attach to main content
  const todoContent = document.getElementById("todo-content");
  todoContent.appendChild(projectDiv);

  input.value = "";
  projectDialog.close();
});

/* ====================TODO DOM REFERENCES====================== */

const addTodoBtn = document.getElementById("btn-add-todo");
const todoDialog = document.getElementById("todo-dialog");
const todoForm = document.getElementById("todo-form");
const todoCancelBtn = document.getElementById("btn-cancel-todo");
const todoName = document.getElementById("todo-name-input");
const todoDescriptoin = document.getElementById("todo-description-input");
const dueDate = document.getElementById("todo-dueDate-input");

/* =====================TODO MODAL CONTROLs====================== */

/*Open todo creation modal*/
addTodoBtn.addEventListener("click", () => {
  todoDialog.showModal();
});

/*Close todo creation modal*/
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
    todoDescriptoin.value,
    dueDate.value,
    priority,
  );

  if (!project) return;

  project.addTodo(newTodo);

  // Calculate due date text
  const daysLeft = getDaysLeft(newTodo.dueDate);

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

  const todoNameEL = document.createElement("a");
  todoNameEL.classList.add("todo-name");
  todoNameEL.textContent = newTodo.title;

  const tododescriptionEL = document.createElement("a");
  tododescriptionEL.classList.add("todo-description");
  tododescriptionEL.textContent = newTodo.description;

  const todoDateEL = document.createElement("a");
  todoDateEL.classList.add("todo-date");
  todoDateEL.textContent = dueText;

  const todoPriorityEL = document.createElement("div");
  todoPriorityEL.classList.add("todo-priority");
  todoPriorityEL.textContent = newTodo.priority;

  todoPriorityEL.textContent = newTodo.priority;
  todoPriorityEL.classList.add(`priority-${newTodo.priority}`);

  // Render todo display text
  todoItem.appendChild(todoNameEL);
  todoItem.appendChild(tododescriptionEL);
  todoItem.appendChild(todoDateEL);
  todoItem.appendChild(todoPriorityEL);

  // Find correct project container
  const projectDiv = document.querySelector(
    `[data-project-name="${selectedProjectName}"]`,
  );

  const projectTodos = projectDiv.querySelector(".project-todos");

  // Attach todo to project
  projectTodos.appendChild(todoItem);

  todoDialog.close();
});
