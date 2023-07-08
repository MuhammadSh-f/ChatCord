const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

//Get room users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

//Message from server
socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit the message to the server
  socket.emit("chatMessage", msg);

  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

//Add room name to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

//Add users to DOM
const outputRoomUsers = (users) => {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
};
