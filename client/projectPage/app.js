const tasksContainer = document.getElementById("tasks-container");
const form = document.querySelector("form");
const membersBtn = document.getElementById("membersBtn");
const main = document.querySelector("main");
let membersCreateCheck = true;
const documentFrag = document.createDocumentFragment();

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
