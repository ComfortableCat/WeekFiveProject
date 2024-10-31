const form = document.querySelector("form");
const joinBtn = document.getElementById("join");
const createBtn = document.getElementById("create");
const gnErrP = document.getElementById("groupNameError");
const dnErrP = document.getElementById("displayNameError");
const passErrP = document.getElementById("passwordError");

async function goToGroup(event) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  gnErrP.textContent = "";
  dnErrP.textContent = "";
  passErrP.textContent = "";
  form.reset();
  if (
    //check if inputs are empty
    data.displayName !== "" &&
    data.groupName !== "" &&
    data.password !== ""
  ) {
    if (data.password.length >= 6) {
      if (event.submitter.id === "join") {
        const result = await fetch(
          `https://weekfiveproject.onrender.com/groups?groupName=${data.groupName}&displayName=${data.displayName}&password=${data.password}`
        );
        const reply = await result.json();
        if (reply.message.group === "doesntExist") {
          gnErrP.textContent = "Group name is miss spelled or does not exist";
        } else if (reply.message.password === "bad") {
          passErrP.textContent = "Password is incorrect";
        } else if (Object.keys(reply).length === 3) {
          //TEST THIS
          saveAndGo(reply);
        } else {
          alert("unexpected join error");
        }
      } else if (event.submitter.id === "create") {
        //create request

        const result = await fetch(
          `https://weekfiveproject.onrender.com/groups`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const reply = await result.json();
        if (reply === "gExists") {
          gnErrP.textContent = "Group already exists";
        } else if (Object.keys(reply).length === 2) {
          saveAndGo(data);
        } else {
          alert("unexpected create error");
        }
      } else {
        alert("unexpected error");
      }
    } else {
      passErrP.textContent = "Password must be 6 characters or more";
    }
  } else {
    dnErrP.textContent = "Inputs cannot be empty";
  }
}
function saveAndGo(a) {
  localStorage.setItem(
    "details",
    JSON.stringify({ group: a.group, member: a.member })
  );
  window.location.assign(`https://loopin.onrender.com/projectPage/`);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.submitter.id, " pressed");
  goToGroup(event);
});
