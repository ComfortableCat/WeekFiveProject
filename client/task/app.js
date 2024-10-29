// Get DOM Nodes
const taskName = document.getElementById("task-name");
const taskStatus = document.getElementById("task-status");
const taskMembers = document.getElementById("assignee");
const taskDetails = document.getElementById("details");
const taskDue = document.getElementById("due");
const taskUpdateBtn = document.getElementById("task-update-btn");
const taskViewCalendar = document.getElementById("task-calendar-btn");

// Hard coding task Id for testing, need to get id when loading from project page
const taskId = 3;

// Get task from database
async function getTask(event) {
  const response = await fetch(`https://weekfiveproject.onrender.com/tasks`, {
    method: "GET",
  });
  const taskData = await response.json();

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
  const { name, status, member_id, description, duedate } = taskData[index];

  // Update DOM with task
  taskName.value = name;
  taskStatus.value = status;
  taskMembers.value = member_id;
  taskDetails.value = description;
  taskDue.value = duedate;
}

async function updateTask(event) {
  const id = taskId;
  const name = taskName.value;
  const status = taskStatus.value;
  const member_id = taskMembers.value;
  const description = taskDetails.value;
  const duedate = taskDue.value;
  const data = [id, name, status, member_id, description, duedate];
  console.log(data);
  const response = fetch(`https://weekfiveproject.onrender.com/tasks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Temp button for running task fetch
taskViewCalendar.addEventListener("click", getTask);

taskUpdateBtn.addEventListener("click", updateTask);
