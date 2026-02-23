import Todo from "../todo.js";

import {
  addProjectBtn,
  projectCancelBtn,
  projectEditCancelBtn,
  projectEditDeleteBtn,
  projectPopupCloseBtn,
} from "./project-btn-reference.js";

import Project from "../project.js";

const projectDialog = document.getElementById("project-dialog");
const projectForm = document.getElementById("project-form");
const input = document.getElementById("project-name-input");
const projectDropdown = document.getElementById("projects-dropdown");
const projectEditDialog = document.getElementById("project-edit");
const projectEditForm = document.getElementById("project-edit-form");
const projectEditInput = document.getElementById("project-edit-input");
const projectPopupDialog = document.getElementById("popup-add-project");

export { saveProjects };

export {
  projectDialog,
  projectForm,
  projects,
  projectDropdown,
  projectPopupDialog,
};

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

/* project storage */
const projects = [];

//local storage function //

const STORAGE_KEY = "todo-projects";

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadProjects() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) return;

  const parsedProjects = JSON.parse(storedData);

  parsedProjects.forEach((projectData) => {
    const restoredProject = new Project(projectData.name);

    // restore todos
    if (projectData.todos && projectData.todos.length > 0) {
      projectData.todos.forEach((todoData) => {
        const restoredTodo = new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.id,
        );

        restoredTodo.status = todoData.status;

        restoredProject.addTodo(restoredTodo);
      });
    }
    projects.push(restoredProject);
  });
}

/* =================PROJECT STATE=================== */

let editingProjectObj = null;
let editingProjectDiv = null;
let editingOldName = null;

function renderProject(project) {
  const projectName = project.name;

  // Add project to dropdown
  const option = document.createElement("option");
  option.value = projectName;
  option.textContent = projectName.toUpperCase();
  projectDropdown.appendChild(option);

  // Create project container
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-div");
  projectDiv.dataset.projectName = projectName;

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title-div");

  titleDiv.addEventListener("click", () => {
    editingProjectObj = project;
    editingProjectDiv = projectDiv;
    editingOldName = project.name;

    projectEditInput.value = editingOldName;
    projectEditDialog.showModal();
  });

  const projectTitle = document.createElement("h4");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = projectName.toUpperCase();

  const projectTodos = document.createElement("div");
  projectTodos.classList.add("project-todos");

  projectDiv.appendChild(titleDiv);
  titleDiv.appendChild(projectTitle);
  projectDiv.appendChild(projectTodos);

  const todoContent = document.getElementById("todo-content");
  todoContent.appendChild(projectDiv);
}
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

  //save to local storage//
  saveProjects();

  renderProject(newProject);

  input.value = "";
  projectDialog.close();
});

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

  //save tp local storagee//
  saveProjects();

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

  ///save to local storage//
  saveProjects();

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

loadProjects();

projects.forEach((project) => {
  renderProject(project);
});
