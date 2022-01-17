let socket = io();
let username;
let typing = false;
let timeout;

let statusElm = document.getElementById("status");

while (!username) {
  username = prompt("What is your name?");
}

appendMsg(`<strong><i>You joined the chat</i></strong>`, "left msg");

socket.emit("new-user", username);

document.getElementById("m").addEventListener("keypress", (e) => {
  const KEY_CODE = e.keyCode || e.which;
  if (KEY_CODE != 13) {
    typing = true;
    socket.emit("typing", { user: username, typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 1000);
  } else {
    clearTimeout(timeout);
    typingTimeout();
  }
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let m = document.getElementById("m");
  if(m.value!="")appendMsg(`<strong>You</strong>: ${m.value}`, "right msg");
  socket.emit("chat-message", m.value);
  m.value = "";
  m.focus();
  return false;
});

socket.on("typing_status", (data) => {
  if (data.typing) {
    statusElm.innerText = `${data.user} is typing...`;
  } else {
    statusElm.innerText = ``;
  }
});

socket.on("chat-message", (data) => {
  appendMsg(`<strong>${data.username}</strong>: ${data.message}`, "left msg");
  var audio = new Audio("/tone");
  audio.play();
});

socket.on("user-connected", (user) => {
  appendMsg(`<strong><i>${user} joined the chat</i></strong>`, "left msg");
});

socket.on("user-disconnected", (user) => {
  appendMsg(`<strong><i>${user} left the chat</i></strong>`, "left msg");
});

function appendMsg(data, className) {
  let li = document.createElement("li");
  li.className = className;
  li.innerHTML = data;
  const msgs = document.getElementById("messages");
  var shouldScroll = msgs.scrollTop + msgs.clientHeight === msgs.scrollHeight;
  msgs.appendChild(li);
  if(!shouldScroll){
    msgs.scrollTop = msgs.scrollHeight; 
  }
}

function typingTimeout() {
  socket.emit("typing", { user: username, typing: false });
}
