/* =================UTILS=================== */

export default function getDaysLeft(dueDateString) {
  if (!dueDateString) return null;

  const today = new Date();
  const due = new Date(dueDateString);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
