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
  console.log(data);
  if (
    //check if inputs are empty
    data.displayName !== "" &&
    data.groupName !== "" &&
    data.password !== ""
  ) {
    if (data.password.length >= 6) {
      if (event.submitter.id === "join") {
        const result = await fetch(
          `http://localhost:8080/groups?groupName=${data.groupName}&displayName=${data.displayName}&password=${data.password}`
        );
        const groupDetails = await JSON.parse(await result.json());
        console.log(groupDetails);
        if (groupDetails.group === "doesntExist") {
          gnErrP.textContent = "Group name is miss spelled or does not exist";
        } else if (groupDetails.password === "bad") {
          passErrP.textContent = "Password is incorrect";
        } else {
          saveAndGo(data);
        }
      } else if (event.submitter.id === "create") {
        //create request

        const result = await fetch(`http://localhost:8080/groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const reply = await result.json();
        console.log(reply);
        if (reply === "gExists") {
          gnErrP.textContent = "Group already exists";
        } else if (reply === "created") {
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
  localStorage.setItem("groupDetails", JSON.stringify(a));
  window.location.assign(
    `https://LoopIn.onrender.com/projects?groupName=${a.groupName}`
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.submitter.id, " pressed");
  goToGroup(event);
});
