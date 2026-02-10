const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const themeSelect = document.getElementById('theme-select');
const totalCounter = document.getElementById('total-counter');
const setAllCompletedBtn = document.getElementById('set-all-completed-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

let todos = [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

function saveTheme(theme) {
    localStorage.setItem('todo-theme', theme);
}

function loadTheme() {
    return localStorage.getItem('todo-theme') || 'light';
}

function applyTheme(theme) {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    themeSelect.value = theme;
    saveTheme(theme);
}

themeSelect.addEventListener('change', function () {
    applyTheme(this.value);
});

function formatTimestamp(ts) {
    const d = new Date(ts);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}


function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        id: generateId(),
        text: text,
        completed: false,
        timestamp: Date.now()
    };

    todos.unshift(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function deleteTodo(id) {
    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].completed = !todos[i].completed;
            break;
        }
    }
    saveTodos();
    renderTodos();
}

function startEdit(id) {
    let todo = null;
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todo = todos[i];
            break;
        }
    }
    if (!todo) return;

    const taskEl = document.querySelector(`[data-id="${id}"]`);
    if (!taskEl) return;

    const contentDiv = taskEl.querySelector('.task-content');
    contentDiv.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'edit-input';
    contentDiv.appendChild(input);
    input.select();

    let cancelled = false;

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') finishEdit(id, input.value);
        if (e.key === 'Escape') {
            cancelled = true;
            renderTodos();
        }
    });

    input.addEventListener('blur', function () {
        if (!cancelled) finishEdit(id, input.value);
    });
}

function finishEdit(id, newText) {
    newText = newText.trim();
    if (newText === '') {
        renderTodos();
        return;
    }
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].text = newText;
            break;
        }
    }
    saveTodos();
    renderTodos();
}


function renderTodos() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filterValue = filterSelect.value;

    const filtered = todos.filter(function (todo) {
        const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
        let matchesFilter = true;
        if (filterValue === 'active') matchesFilter = !todo.completed;
        else if (filterValue === 'completed') matchesFilter = todo.completed;
        return matchesSearch && matchesFilter;
    });

    taskList.innerHTML = '';

    if (filtered.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-msg';
        emptyMsg.textContent = 'Empty... add your first task';
        taskList.appendChild(emptyMsg);
    } else {
        for (let i = 0; i < filtered.length; i++) {
            const taskEl = createTaskElement(filtered[i]);
            taskList.appendChild(taskEl);
        }
    }

    totalCounter.textContent = 'Total: ' + filtered.length;
}


function createTaskElement(todo) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', function () {
        toggleTodo(todo.id);
    });

    const content = document.createElement('div');
    content.className = 'task-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    if (todo.completed) textSpan.classList.add('completed');
    textSpan.textContent = todo.text;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-timestamp';
    if (todo.completed) timeSpan.classList.add('completed');
    timeSpan.textContent = formatTimestamp(todo.timestamp);

    content.appendChild(textSpan);
    content.appendChild(timeSpan);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.title = 'Edit task';
    const editImg = document.createElement('img');
    editImg.src = './images/marker-solid-full.svg';
    editImg.alt = 'edit';
    editBtn.appendChild(editImg);
    editBtn.addEventListener('click', function () {
        startEdit(todo.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete task';
    const deleteImg = document.createElement('img');
    deleteImg.src = './images/eraser-solid-full.svg';
    deleteImg.alt = 'delete';
    deleteBtn.appendChild(deleteImg);
    deleteBtn.addEventListener('click', function () {
        deleteTodo(todo.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(content);
    taskItem.appendChild(actions);

    return taskItem;
}


setAllCompletedBtn.addEventListener('click', function () {
    for (let i = 0; i < todos.length; i++) {
        todos[i].completed = true;
    }
    saveTodos();
    renderTodos();
});

clearCompletedBtn.addEventListener('click', function () {
    todos = todos.filter(function (todo) {
        return !todo.completed;
    });
    saveTodos();
    renderTodos();
});

clearAllBtn.addEventListener('click', function () {
    todos = [];
    saveTodos();
    renderTodos();
});

searchInput.addEventListener('input', renderTodos);
filterSelect.addEventListener('change', renderTodos);

function init() {
    applyTheme(loadTheme());
    loadTodos();
    renderTodos();
}

init();