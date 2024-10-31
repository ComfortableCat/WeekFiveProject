const chatContainer = document.getElementById("chatContainer");
const msgForm = document.getElementById("msgForm");
const message = document.getElementById("message");
const msgBtn = document.getElementById("msgBtn");
const groupTitle = document.getElementById("groupTitle");
const groupDetails = JSON.parse(localStorage.getItem("details"));
const msgFragment = document.createDocumentFragment();

if (groupDetails === undefined || groupDetails === null) {
  window.location.assign("https://loopin.onrender.com/");
}
groupTitle.textContent = `LoopIn: ${groupDetails["group"][0].name}`;
chatsToPage();
console.log(groupDetails["group"][0].id);
async function chatsToPage() {
  const result = await fetch(
    `https://weekfiveproject.onrender.com/chat?groupId=${groupDetails["group"][0].id}`
  );
  const chats = await result.json();
  console.log(chats);
  msgFragment.replaceChildren();
  chats.forEach(chatBox);
  chatContainer.replaceChildren();
  chatContainer.appendChild(msgFragment);
}

function chatBox(chat) {
  const chatDiv = document.createElement("div");
  const name = document.createElement("p");
  const message = document.createElement("p");
  chatDiv.classList.add("chatDiv");
  name.classList.add("name");
  message.classList.add("message");
  name.textContent = chat.displayname; //
  message.textContent = chat.message;
  chatDiv.appendChild(name);
  chatDiv.appendChild(message);
  msgFragment.append(chatDiv);
}

async function submitMsg(event) {
  event.preventDefault();
  const formData = new FormData(msgForm);
  const formObj = Object.fromEntries(formData);
  formObj.groupId = groupDetails["group"][0].id;
  formObj.memberId = groupDetails["member"][0].id;
  const result = await fetch(`https://weekfiveproject.onrender.com/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formObj),
  });
  chatsToPage();
}

msgForm.addEventListener("submit", (event) => {
  submitMsg(event);

  msgForm.reset();
});
