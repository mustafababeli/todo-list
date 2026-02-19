export default class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      priority = "low";
    }

    this.priority = priority;
    this.status = false;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  get statusText() {
    return this.status ? "Completed" : "Not completed";
  }
}
