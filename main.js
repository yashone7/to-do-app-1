import dayjs from "dayjs";
import axios from "axios";

const form = document.forms["todo-form"];
const todoField = form["todo"];
const box = document.getElementById("list-box");
const myBtn = document.getElementById("my-btn");

// here we will also add pravatar to add some authenticity

/**
 * what do we want to capture from app?
 * 1. profile picture url (based on email)
 * 2. Name of the user
 * 3. todo content
 * 4. timestamp
 */

window.onload = function () {
  //   console.log("this function has executed");
  renderTodos();
};

async function fetchTodos() {
  const res = await axios.get("http://localhost:3004/todos");
  return res.data;
}

const todoCreated = new CustomEvent("todo-created");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // here we need to capture 1. todo-content, 2. name of the user, 3. timestamp, 4. pravatar
  let todoContent = todoField.value;
  let timestamp = dayjs(Date.now()).toISOString();
  let name = "bujji fellow"; //loginData.name
  let avatar = `https://i.pravatar.cc/150?img=4`; // loginData.avatar

  let data = JSON.stringify({
    content: todoContent,
    timestamp,
    name,
    avatar,
  });

  // here we will do API call to submit the data to server
  const res = await axios({
    method: "POST",
    url: "http://localhost:3004/todos",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(res.data);

  window.dispatchEvent(todoCreated);
});

// create the UI for my data

function createTodoUI(todos) {
  todos.forEach((todo) => {
    const card = document.createElement("div");
    card.classList.add("card", "m-5");
    card.dataset.id = todo.id;

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const media = document.createElement("div");
    media.classList.add("media", "is-align-items-center");

    const mediaLeft = document.createElement("div");
    mediaLeft.classList.add("media-left");

    const figure = document.createElement("figure");
    figure.classList.add("image", "is-48x48");

    const img = document.createElement("img");
    img.classList.add("is-rounded");
    img.src = todo.avatar;
    img.alt = "Profile Picture";

    const mediaContent = document.createElement("div");
    mediaContent.classList.add("media-content");

    const title = document.createElement("p");
    title.classList.add("title", "is-4");
    title.innerText = todo.name;

    const content = document.createElement("div");
    content.innerText = todo.content;

    const tsContainer = document.createElement("div");
    tsContainer.className = "my-3";

    const timestamp = document.createElement("time");
    timestamp.dateTime = todo.timestamp;
    timestamp.innerText = dayjs(todo.timestamp).format("YYYY-MM-DDTHH:mm:ssZ");

    tsContainer.appendChild(timestamp);

    content.appendChild(tsContainer);

    const btn = document.createElement("button");
    btn.classList.add("button", "is-danger", "my-1");
    btn.id = todo.id;
    btn.addEventListener("click", (e) => {
      console.log(`clicked`);
    });
    btn.innerText = "delete";

    const footer = document.createElement("footer");
    footer.classList.add("card-footer", "my-2");

    footer.appendChild(btn);

    // here were appending p tags to media content
    mediaContent.append(title);

    // here we are appending img to figure tag
    figure.appendChild(img);

    // add figure to mediaLeft
    mediaLeft.appendChild(figure);

    // append media-left and media content to media div
    media.append(mediaLeft, mediaContent);

    // add content and media to card-content
    cardContent.append(media, content, footer);

    // append card-content to card
    card.appendChild(cardContent);

    // here we're appending the card to box
    box.append(card);
  });
}

window.addEventListener("todo-created", () => {
  box.innerHTML = "";
  renderTodos();
});

async function renderTodos() {
  const todos = await fetchTodos();
  createTodoUI(todos);
}

box.addEventListener("click", async (event) => {
  const id = event.target.id;
  const child = document.querySelector(`[data-id="${id}"]`);
  box.removeChild(child);

  const { data } = await axios.delete(`http://localhost:3004/todos/${id}`);
  console.log(data);
});

// here we have use local storage also to persist the changes

/**
 * get the latest todos from backend
 * each time a todo is added notify the browser and add it to UI - custom events should be used
 * when user reloads, fecth from the server
 *
 * when todo is added -> raise an event -> listen for that event
 */

/**
 *
 */
