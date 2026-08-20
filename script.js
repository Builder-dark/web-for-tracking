// State Management (Saved in LocalStorage)
let lists = JSON.parse(localStorage.getItem('gt_lists')) || ['My Tasks', 'Assignments', 'Personal'];
let activeList = localStorage.getItem('gt_activeList') || 'My Tasks';
let tasks = JSON.parse(localStorage.getItem('gt_tasks')) || [];
let selectedTaskId = null;

// DOM Elements
const listsContainer = document.getElementById('listsContainer');
const currentListTitle = document.getElementById('currentListTitle');
const newListBtn = document.getElementById('newListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

const quickTaskInput = document.getElementById('quickTaskInput');
const quickAddBtn = document.getElementById('quickAddBtn');

const pendingTasksList = document.getElementById('pendingTasksList');
const completedTasksList = document.getElementById('completedTasksList');
const completedCount = document.getElementById('completedCount');

const detailPanel = document.getElementById('detailPanel');
const closeDetailBtn = document.getElementById('closeDetailBtn');
const detailTitle = document.getElementById('detailTitle');
const detailSubject = document.getElementById('detailSubject');
const detailType = document.getElementById('detailType');
const detailDescription = document.getElementById('detailDescription');
const saveDetailBtn = document.getElementById('saveDetailBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');

// Helper: Save to LocalStorage
function saveData() {
  localStorage.setItem('gt_lists', JSON.stringify(lists));
  localStorage.setItem('gt_activeList', activeList);
  localStorage.setItem('gt_tasks', JSON.stringify(tasks));
}

// Initialize Application
function init() {
  renderLists();
  renderTasks();
  attachEvents();
}

// Render Side Lists
function renderLists() {
  listsContainer.innerHTML = '';
  lists.forEach(listName => {
    const item = document.createElement('div');
    item.className = `list-item ${listName === activeList ? 'active' : ''}`;
    item.textContent = listName;
    item.onclick = () => {
      activeList = listName;
      closeDrawer();
      saveData();
      renderLists();
      renderTasks();
    };
    listsContainer.appendChild(item);
  });
  currentListTitle.textContent = activeList;
}

// Render Task List Area
function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  const listTasks = tasks.filter(t => t.list === activeList);
  const pending = listTasks.filter(t => !t.completed);
  const completed = listTasks.filter(t => t.completed);

  completedCount.textContent = completed.length;

  // Render Pending Tasks
  pending.forEach(task => {
    pendingTasksList.appendChild(createTaskCard(task));
  });

  // Render Completed Tasks
  completed.forEach(task => {
    completedTasksList.appendChild(createTaskCard(task));
  });
}

// Create Card HTML DOM Element
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.completed ? 'completed' : ''}`;
  card.onclick = (e) => {
    if (!e.target.closest('.checkbox-btn')) {
      openDetailDrawer(task.id);
    }
  };

  card.innerHTML = `
    <button class="checkbox-btn ${task.completed ? 'checked' : ''}" onclick="toggleTaskStatus(${task.id})">
      <span class="material-symbols-outlined">
        ${task.completed ? 'check_circle' : 'radio_button_unchecked'}
      </span>
    </button>
    <div class="task-info">
      <div class="task-title">${escapeHTML(task.title)}</div>
      <div class="task-meta">
        ${task.subject ? `<span class="badge subject-badge">${escapeHTML(task.subject)}</span>` : ''}
        ${task.type ? `<span class="badge">${escapeHTML(task.type)}</span>` : ''}
      </div>
      ${task.description ? `<div class="task-desc-preview">${escapeHTML(task.description)}</div>` : ''}
    </div>
  `;

  return card;
}

// Quick Add Task
function addTask() {
  const title = quickTaskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now(),
    list: activeList,
    title: title,
    subject: '',
    type: 'General',
    description: '',
    completed: false
  };

  tasks.push(newTask);
  quickTaskInput.value = '';
  saveData();
  renderTasks();
}

// Toggle Completed State
window.toggleTaskStatus = function(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveData();
  renderTasks();
};

// Detail Drawer Management
function openDetailDrawer(taskId) {
  selectedTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  detailTitle.value = task.title || '';
  detailSubject.value = task.subject || '';
  detailType.value = task.type || 'General';
  detailDescription.value = task.description || '';

  detailPanel.classList.add('open');
}

function closeDrawer() {
  selectedTaskId = null;
  detailPanel.classList.remove('open');
}

// Save Expanded Task Details
saveDetailBtn.addEventListener('click', () => {
  if (!selectedTaskId) return;

  tasks = tasks.map(t => {
    if (t.id === selectedTaskId) {
      return {
        ...t,
        title: detailTitle.value.trim() || t.title,
        subject: detailSubject.value.trim(),
        type: detailType.value,
        description: detailDescription.value.trim()
      };
    }
    return t;
  });

  saveData();
  renderTasks();
  closeDrawer();
});

// Delete Task
deleteTaskBtn.addEventListener('click', () => {
  if (!selectedTaskId) return;
  tasks = tasks.filter(t => t.id !== selectedTaskId);
  saveData();
  renderTasks();
  closeDrawer();
});

// Event Listeners Initialization
function attachEvents() {
  quickAddBtn.addEventListener('click', addTask);
  quickTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  closeDetailBtn.addEventListener('click', closeDrawer);

  // New List
  newListBtn.addEventListener('click', () => {
    const name = prompt('Enter new list name:');
    if (name && !lists.includes(name.trim())) {
      const cleanName = name.trim();
      lists.push(cleanName);
      activeList = cleanName;
      saveData();
      renderLists();
      renderTasks();
    }
  });

  // Delete List
  deleteListBtn.addEventListener('click', () => {
    if (lists.length <= 1) {
      alert('You must keep at least one list.');
      return;
    }
    if (confirm(`Delete list "${activeList}" and all its tasks?`)) {
      tasks = tasks.filter(t => t.list !== activeList);
      lists = lists.filter(l => l !== activeList);
      activeList = lists[0];
      closeDrawer();
      saveData();
      renderLists();
      renderTasks();
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

init();
