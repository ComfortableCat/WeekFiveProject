// Get DOM Nodes
const taskName = document.getElementById("task-name");
const taskStatus = document.getElementById("task-status");
const taskPriority = document.getElementById("task-priority");
const taskMembers = document.getElementById("assignee");
const taskDetails = document.getElementById("details");
const taskDue = document.getElementById("due");
const taskButtons = document.getElementById("task-buttons");
const taskUpdateBtn = document.getElementById("task-update-btn");
const taskDeleteBtn = document.getElementById("task-delete-btn");
const taskViewCalendar = document.getElementById("task-calendar-btn");

// Hard coding task Id for testing, need to get id when loading from project page
const taskId = 3;

// Get task from database
async function getTask(event) {
  // const response = await fetch(`https://weekfiveproject.onrender.com/tasks`, {
  const response = await fetch(`http://localhost:8080/tasks`, {
    method: "GET",
  });
  const taskData = await response.json();
  console.log(taskData);
  // Loop through tasks until task with correct ID found
  let index = -1;
  let found = false;
  while (!found) {
    index++;
    if (taskData[index].id === taskId) {
      console.log(index);
      found = true;
    }
  }
  // Create variables from retrieved task data
  const { name, status, priority, member_id, description, duedate } =
    taskData[index];

  // Update DOM with task
  taskName.value = name;
  taskStatus.value = status;
  taskPriority.value = priority;
  taskMembers.value = member_id;
  taskDetails.value = description;
  taskDue.value = duedate;
}

async function updateTask(event) {
  const id = taskId;
  const name = taskName.value;
  const status = taskStatus.value;
  const priority = taskPriority.value;
  const member_id = taskMembers.value;
  const description = taskDetails.value;
  const duedate = taskDue.value;
  const data = [id, name, status, priority, member_id, description, duedate];
  console.log(data);
  // const response = fetch(`https://weekfiveproject.onrender.com/tasks`, {
  const response = fetch(`http://localhost:8080/tasks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  displayNotification("update");
}

function deleteTask() {
  const response = fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "DELETE",
  });
  displayNotification("delete");
}

function displayNotification(action) {
  const actionMessage = document.createElement("p");
  if (action === "update") {
    actionMessage.textContent = `Task ${action} complete.`;
  }
  if (action === "delete") {
    actionMessage.textContent = `Task ${action} complete. Redirecting...`;
  }
  taskButtons.append(actionMessage);
  setTimeout(() => {
    actionMessage.remove();
    if (action === "delete") {
      window.location.href = "http://localhost:5173/projectPage/";
    }
  }, 3000);
}

// Temp button for running task fetch
taskViewCalendar.addEventListener("click", getTask);

taskUpdateBtn.addEventListener("click", updateTask);

taskDeleteBtn.addEventListener("click", deleteTask);
