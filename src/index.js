import "./styles.css";
import Todo from "./todo.js";
import Project from "./project.js";

const addProjectBtn = document.getElementById("my-projects");
const dialog = document.getElementById("add-project");
const form = document.getElementById("project-form");
const input = document.getElementById("project-input");

const projects = [];

addProjectBtn.addEventListener("click", () => {
  dialog.showModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const projectName = input.value.trim();
  if (!projectName) return;

  const newProject = new Project(projectName);
  projects.push(newProject);

  console.log(projects);

  input.value = "";
  dialog.close();
});
