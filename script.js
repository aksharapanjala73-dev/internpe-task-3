let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(){
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if(text === ""){
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed:false
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

function renderTasks(){
  const taskList = document.getElementById("taskList");
  const emptyMsg = document.getElementById("emptyMsg");

  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task=>{
    if(currentFilter === "completed") return task.completed;
    if(currentFilter === "pending") return !task.completed;
    return true;
  });

  if(filteredTasks.length === 0){
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  filteredTasks.forEach(task=>{
    const div = document.createElement("div");
    div.className = `task ${task.completed ? "completed" : ""}`;

    div.innerHTML = `
      <div class="left">
        <input type="checkbox" class="check"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${task.id})">

        <span class="task-text">${task.text}</span>
      </div>

      <div class="actions">
        <button class="icon-btn edit"
          onclick="editTask(${task.id})">✏️</button>

        <button class="icon-btn delete"
          onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    taskList.appendChild(div);
  });

  updateStats();
}

function toggleTask(id){
  tasks = tasks.map(task=>{
    if(task.id === id){
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id){
  tasks = tasks.filter(task=>task.id !== id);

  saveTasks();
  renderTasks();
}

function editTask(id){
  const task = tasks.find(task=>task.id === id);

  const updated = prompt("Edit your task:", task.text);

  if(updated !== null && updated.trim() !== ""){
    task.text = updated;

    saveTasks();
    renderTasks();
  }
}

function updateStats(){
  document.getElementById("totalTasks").innerText = tasks.length;

  const completed = tasks.filter(task=>task.completed).length;

  document.getElementById("completedTasks").innerText = completed;

  document.getElementById("pendingTasks").innerText =
    tasks.length - completed;
}

function filterTasks(type,btn){
  currentFilter = type;

  document.querySelectorAll(".filter-btn")
  .forEach(button=>button.classList.remove("active"));

  btn.classList.add("active");

  renderTasks();
}

document.getElementById("taskInput")
.addEventListener("keypress",function(e){
  if(e.key === "Enter"){
    addTask();
  }
});

renderTasks();
