const form = document.querySelector("form");
const joinBtn = document.getElementById("join");
const createBtn = document.getElementById("create");
const gnErrP = document.getElementById("groupNameError");
const dnErrP = document.getElementById("displayNameError");
const passErrP = document.getElementById("passwordError");

async function goToGroup(event) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log(data);
  if (
    //check if inputs are empty
    data.displayName === "" ||
    data.groupName === "" ||
    data.password === ""
  ) {
    //if empty show error
    console.log(`data is empty`);
  } else if (event.submitter.id === "join") {
    const result = await fetch(
      `http://localhost:8080/groups?groupName=${data.groupName}`
    );
    const groupDetails = await result.json();
    console.log(groupDetails);
    if (groupDetails.length === 0) {
      //need to check for unique display name
      form.reset();
      gnErrP.textContent = "Group name is miss spelled or does not exist";
    } else if (groupDetails[0].password === data.password) {
      console.log("yippee");
      form.reset();
      saveAndGo(data);
    } else {
      alert("unexpected join error");
    }
  } else if (event.submitter.id === "create") {
    //create request
    const result = await fetch(`http://localhost:8080/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const reply = await response.json();
    console.log(reply);
    if (reply === "gExists") {
      gnErrP.textContent = "Group already exists";
    } else {
      saveAndGo(data);
    }
  } else {
    alert("unexpected error");
  }
}

function saveAndGo(a) {
  localStorage.setItem("groupDetails", JSON.stringify(a));
  window.location.assign(
    `https://LoopIn.onrender.com/projects?groupName=${a.groupName}`
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.submitter.id);
  goToGroup(event);
});
