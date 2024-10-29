const tasksContainer = document.getElementById("tasks-container");
const form = document.querySelector("form");

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formObj = Object.fromEntries(formData);
  console.log(data);

  const response = await fetch("http://localhost:8080/Tasks", {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);
}
form.addEventListener("submit", handleSubmit);

// OTHER TASKS -AS PROJECT SUMMARIES- NEED TO SHOW ON THE SCREEN
async function getTasks() {
  const response = await fetch("server address here");
  const tasks = await response.json();

  for (let i = 0; i < tasks.length; i++) {
    const name = tasks[i].username;
    const description = tasks[i].description;
    const status = tasks[i].status;
    const duedate = tasks[i].duedate;
    const priority = tasks[i].priority;

    const p = document.createElement("p");
    p.textContent = `${status} ${name} ${description}`;

    tasksContainer.appendChild(p);
  }
}
gettasks();
