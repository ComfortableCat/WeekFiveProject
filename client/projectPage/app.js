const taskContainer = document.getElementById("tasks-container");
const returnedContainer = document.getElementById("returned-container");
const form = document.querySelector("form");
const groupDetails = JSON.parse(localStorage.getItem("details")) || {
  group: [{ id: 2, name: "TestName2", password: "TestPassword2" }],
};
const membersBtn = document.getElementById("membersBtn");
const main = document.querySelector("main");
let membersCreateCheck = true;
const documentFrag = document.createDocumentFragment();

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formObj = Object.fromEntries(formData);

  const response = await fetch("https://weekfiveproject.onrender.com/tasks", {
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
});

getTask();

// const response = await fetch("https://weekfiveproject.onrender.com/tasks", {
// const response = await fetch("http://localhost:8080/tasks", {
async function getTask() {
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
    const ToDo = document.getElementById("ToDo");
    const Doing = document.getElementById("Doing");
    const Done = document.getElementById("Done");
    const name = task.name;
    const status = task.status;
    const a = document.createElement("a");
    a.textContent = `${name}`;
    a.href = `http://127.0.0.1:5173?name=${task.name}`;
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
    //need to change
    const groupId = 1;
    //
    const response = await fetch(
      `http://localhost:8080/members?groupId=${groupId}`
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
