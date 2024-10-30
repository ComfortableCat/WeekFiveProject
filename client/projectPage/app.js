const taskContainer = document.getElementById("task-container");
const returnedContainer = document.getElementById("returned-container");
const form = document.querySelector("form");
const groupDetails = JSON.parse(localStorage.getItem("details"));
const membersBtn = document.getElementById("membersBtn");
const main = document.querySelector("main");
let membersCreateCheck = true;
const documentFrag = document.createDocumentFragment();
const ToDo = document.getElementById("ToDo");
const Doing = document.getElementById("Doing");
const Done = document.getElementById("Done");
const groupTitle = document.getElementById("groupTitle");
const toggleActive = document.getElementById("toggleActive");

groupTitle.textContent = `LoopIn: ${groupDetails["group"][0].name}`;
toggleActive.addEventListener("click", () => {
  taskContainer.classList.toggle("notActive");
  returnedContainer.classList.toggle("notActive");
  if (taskContainer.classList.contains("notActive") === false) {
    toggleActive.style.transform = "rotate(0.125turn)";
  } else {
    toggleActive.style.transform = "none";
  }
});

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formObj = Object.fromEntries(formData);
  formObj.groupId = groupDetails["group"][0].id;
  console.log(formObj);

  const response = await fetch("http://localhost:8080/tasks", {
    //This works - don't touch
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formObj),
  });
  const data = await response.json();
  console.log(data);
}
form.addEventListener("submit", (event) => {
  handleSubmit(event);
  form.reset();
  getTask();
});

getTask();

// const response = await fetch("https://weekfiveproject.onrender.com/tasks", {
// const response = await fetch("http://localhost:8080/tasks", {
async function getTask() {
  ToDo.replaceChildren();
  Doing.replaceChildren();
  Done.replaceChildren();
  const toDoP = document.createElement("p");
  const doingP = document.createElement("p");
  const doneP = document.createElement("p");
  toDoP.textContent = "To Do";
  ToDo.appendChild(toDoP);
  doingP.textContent = "Doing";
  Doing.appendChild(doingP);
  doneP.textContent = "Done";
  Done.appendChild(doneP);
  const response = await fetch("https://weekfiveproject.onrender.com/tasks", {
    method: "GET",
  });
  const taskData = await response.json();
  console.log(taskData);

  taskData.forEach(taskToPage); //curr only 1 obj
}

// getTasks();
function taskToPage(task) {
  if (task["group_id"] === groupDetails["group"][0].id) {
    console.log(task);

    const name = task.name;
    const status = task.status;
    const a = document.createElement("a");
    a.textContent = `${name}`;
    // a.href = `http://127.0.0.1:5173/task/?name=${task.name}`;
    a.href = `http://127.0.0.1:5173/task/?id=${task.id}`;
    if (status === "todo") {
      ToDo.appendChild(a);
    } else if (status === "doing") {
      Doing.appendChild(a);
    } else if (status === "done") {
      Done.appendChild(a);
    }
  }
}

// getTasks();

membersBtn.addEventListener("click", loadMembers);

async function loadMembers() {
  if (membersCreateCheck === true) {
    membersCreateCheck = false;
    const membersDiv = document.createElement("div");
    const membersP = document.createElement("p");
    membersDiv.id = "membersDiv";
    membersP.id = "membersP";
    membersP.textContent = "These are the members in your group";
    membersDiv.appendChild(membersP);

    const response = await fetch(
      `http://localhost:8080/members?groupId=${groupDetails["group"][0].id}`
    );
    const members = await response.json();
    console.log("JSON data:", members);
    documentFrag.replaceChildren();
    members.forEach(drawMember);
    membersDiv.appendChild(documentFrag);
    //
    //
    main.appendChild(membersDiv);
  } else {
    const membersDiv = document.getElementById("membersDiv");
    membersDiv.remove();
    membersCreateCheck = true;
  }
}
function drawMember(member) {
  console.log(member);
  const p = document.createElement("p");
  p.className = "memberName";
  p.textContent = member.displayname;
  documentFrag.appendChild(p);
}
