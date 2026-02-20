export default class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = false;

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      priority = "low";
    }
    this.priority = priority;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  get statusText() {
    return this.status ? "Completed" : "Not completed";
  }
}
