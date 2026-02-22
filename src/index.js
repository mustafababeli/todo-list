import "./styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

/* =================UTILS=================== */

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

const projectEditDialog = document.getElementById("project-edit");
const projectEditCancelBtn = document.querySelector(".btn-edit-cancel-project");
const projectEditDeleteBtn = document.querySelector(".btn-edit-delete-project");
const projectEditForm = document.getElementById("project-edit-form");
const projectEditInput = document.getElementById("project-edit-input");

const projectPopupDialog = document.getElementById("popup-add-project");
const projectPopupCloseBtn = document.querySelector(
  ".btn-close-popup-add-project",
);

/* =================DELETE TODO DIALOG DOM REFERENCES=================== */

const deleteTodoDialog = document.getElementById("delete-todo-dialog");
const confirmDeleteTodoBtn = document.getElementById("confirm-delete-todo");
const cancelDeleteTodoBtn = document.getElementById("cancel-delete-todo");

let todoToDelete = null;

/* Cancel delete */
cancelDeleteTodoBtn.addEventListener("click", () => {
  deleteTodoDialog.close();
  todoToDelete = null;
});

/* Confirm delete (DOM only) */
confirmDeleteTodoBtn.addEventListener("click", () => {
  if (!todoToDelete) return;

  todoToDelete.remove();
  deleteTodoDialog.close();
  todoToDelete = null;
});

/* =================PROJECT STATE=================== */

let editingProjectObj = null;
let editingProjectDiv = null;
let editingOldName = null;

/* project storage */
const projects = [];

/* =================PROJECT POPUP CONTROLS=================== */

projectPopupCloseBtn.addEventListener("click", () => {
  projectPopupDialog.close();
});

/* =================PROJECT EDIT MODAL CONTROLS=================== */

projectEditCancelBtn.addEventListener("click", () => {
  projectEditDialog.close();
});

/* =================PROJECT EDIT SAVE LOGIC=================== */

// ---- EDIT: SAVE (rename project) ----
projectEditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // safety: must have a selected project from the title click
  if (!editingProjectObj || !editingProjectDiv || !editingOldName) return;

  const newName = projectEditInput.value.trim().toLowerCase();
  if (!newName) return;

  // prevent duplicates (but allow saving the same name)
  const duplicate = projects.some(
    (p) => p.name.toLowerCase() === newName && p.name !== editingOldName,
  );
  if (duplicate) return;

  // 1) update the Project object
  editingProjectObj.name = newName;

  // 2) update DOM dataset + title text
  editingProjectDiv.dataset.projectName = newName;
  const titleEl = editingProjectDiv.querySelector(".project-title");
  if (titleEl) titleEl.textContent = newName.toUpperCase();

  // 3) update dropdown option (value + label)
  const opt = projectDropdown.querySelector(
    `option[value="${editingOldName}"]`,
  );
  if (opt) {
    opt.value = newName;
    opt.textContent = newName.toUpperCase();
  }

  // keep selection on the renamed project
  projectDropdown.value = newName;

  // cleanup
  editingProjectObj = null;
  editingProjectDiv = null;
  editingOldName = null;
  projectEditInput.value = "";
  projectEditDialog.close();
});

/* =================PROJECT DELETE LOGIC=================== */

projectEditDeleteBtn.addEventListener("click", () => {
  // must be editing something
  if (!editingProjectObj || !editingProjectDiv || !editingOldName) return;

  // 1) remove from projects array
  const index = projects.findIndex((p) => p === editingProjectObj);
  if (index !== -1) projects.splice(index, 1);

  // 2) remove from dropdown
  const opt = projectDropdown.querySelector(
    `option[value="${editingOldName}"]`,
  );
  if (opt) opt.remove();

  // 3) remove from DOM
  editingProjectDiv.remove();

  // 4) cleanup + close
  editingProjectObj = null;
  editingProjectDiv = null;
  editingOldName = null;
  projectEditInput.value = "";
  projectEditDialog.close();
});

/* =================PROJECT MODAL CONTROLS=================== */

/* Open project creation modal */
addProjectBtn.addEventListener("click", () => {
  projectDialog.showModal();
});

/* Close project creation modal */
projectCancelBtn.addEventListener("click", () => {
  const existingError = projectForm.querySelector(".error-msg");
  if (existingError) existingError.remove();

  projectDialog.close();
});

/* =================PROJECT CREATION LOGIC=================== */

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const existingError = projectForm.querySelector(".error-msg");
  if (existingError) existingError.remove();

  const projectName = input.value.trim().toLowerCase();
  if (!projectName) return;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].name.toLowerCase() === projectName) {
      const errorMsg = document.createElement("div");
      errorMsg.classList.add("error-msg");
      errorMsg.textContent = "Project already exists!";
      projectForm.appendChild(errorMsg);
      return;
    }
  }

  // Create project model
  const newProject = new Project(projectName);
  projects.push(newProject);

  // Add project to dropdown selector
  const option = document.createElement("option");
  option.value = projectName;
  option.textContent = projectName.toUpperCase();
  projectDropdown.appendChild(option);

  // Create project container
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-div");
  projectDiv.dataset.projectName = projectName;

  // Create title wrapper
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title-div");

  titleDiv.addEventListener("click", () => {
    editingProjectObj = newProject; // the Project instance for this project
    editingProjectDiv = projectDiv; // the DOM container for this project
    editingOldName = newProject.name; // current name (lowercase)

    projectEditInput.value = editingOldName;
    projectEditDialog.showModal();
  });

  // Create project title
  const projectTitle = document.createElement("h4");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = projectName.toUpperCase();

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
    todoDescriptoin.value,
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

  // ✅ click -> open delete dialog
  todoItem.addEventListener("click", () => {
    todoToDelete = todoItem;
    deleteTodoDialog.showModal();
  });

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
