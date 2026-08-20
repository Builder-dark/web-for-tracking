// Array to hold tasks
let tasks = [];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const taskGrid = document.getElementById('taskGrid');
const newGroupInput = document.getElementById('newGroupInput');
const addGroupBtn = document.getElementById('addGroupBtn');
const deleteGroupBtn = document.getElementById('deleteGroupBtn');

// 1. Add Task Function
addBtn.addEventListener('click', function() {
  const text = taskInput.value;
  const category = categorySelect.value;

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    category: category,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  render();
});

// 2. Render Tasks on Screen
function render() {
  taskGrid.innerHTML = "";

  tasks.forEach(function(task) {
    const card = document.createElement('div');
    card.className = "card" + (task.completed ? " done" : "");

    card.innerHTML = `
      <div>
        <div class="badge">${task.category}</div>
        <div>${task.text}</div>
      </div>
      <div class="card-actions">
        <button class="btn-complete" onclick="toggleTask(${task.id})">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskGrid.appendChild(card);
  });
}

// 3. Mark Task Complete / Undo
function toggleTask(id) {
  tasks = tasks.map(function(task) {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  render();
}

// 4. Delete Task
function deleteTask(id) {
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });
  render();
}

// 5. Add Custom Group
addGroupBtn.addEventListener('click', function() {
  const groupName = newGroupInput.value;
  if (groupName === "") return;

  const option = document.createElement('option');
  option.value = groupName;
  option.textContent = groupName;
  
  categorySelect.appendChild(option);
  categorySelect.value = groupName;
  newGroupInput.value = "";
});

// 6. Delete Selected Group
deleteGroupBtn.addEventListener('click', function() {
  const selectedIndex = categorySelect.selectedIndex;
  if (categorySelect.options.length <= 1) return; // Keep at least one

  categorySelect.remove(selectedIndex);
});
