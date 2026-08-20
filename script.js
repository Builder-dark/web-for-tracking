// State
let tasks = [];
let categories = ['Personal', 'Work', 'Assignments'];
let activeCategory = 'Personal';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tabsContainer = document.getElementById('tabsContainer');
const taskGrid = document.getElementById('taskGrid');
const newGroupInput = document.getElementById('newGroupInput');
const addGroupBtn = document.getElementById('addGroupBtn');
const deleteGroupBtn = document.getElementById('deleteGroupBtn');

// Initialize
function init() {
  renderTabs();
  renderTasks();
}

// Render Tabs
function renderTabs() {
  tabsContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `tab ${activeCategory === cat ? 'active' : ''}`;
    btn.textContent = cat;
    btn.onclick = () => {
      activeCategory = cat;
      renderTabs();
      renderTasks();
    };
    tabsContainer.appendChild(btn);
  });
}

// Render Task Grid
function renderTasks() {
  taskGrid.innerHTML = '';

  const filteredTasks = tasks.filter(t => t.category === activeCategory);

  if (filteredTasks.length === 0) {
    taskGrid.innerHTML = `<div style="color: #9ca3af; font-size: 0.875rem;">No tasks in this group.</div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const card = document.createElement('div');
    card.className = `card ${task.completed ? 'done' : ''}`;
    card.innerHTML = `
      <div>
        <div class="category-tag">${task.category}</div>
        <div class="card-text">${escapeHTML(task.text)}</div>
      </div>
      <div class="card-actions">
        <button class="action-link" onclick="toggleTask(${task.id})">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button class="action-link delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskGrid.appendChild(card);
  });
}

// Add Task
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    category: activeCategory,
    completed: false
  });

  taskInput.value = '';
  renderTasks();
});

// Toggle Task Done/Undo
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Add New Group
addGroupBtn.addEventListener('click', () => {
  const name = newGroupInput.value.trim();
  if (name && !categories.includes(name)) {
    categories.push(name);
    activeCategory = name;
    newGroupInput.value = '';
    renderTabs();
    renderTasks();
  }
});

// Delete Active Group
deleteGroupBtn.addEventListener('click', () => {
  if (categories.length <= 1) return;

  // Reassign tasks in this group to another existing category
  categories = categories.filter(c => c !== activeCategory);
  tasks = tasks.filter(t => t.category !== activeCategory);

  activeCategory = categories[0];
  renderTabs();
  renderTasks();
});

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

init();
