let todos = [];

const todoInput        = document.getElementById('todo-input');
const addBtn           = document.getElementById('add-btn');
const searchInput      = document.getElementById('search-input');
const filterSelect     = document.getElementById('filter-select');
const themeSelect      = document.getElementById('theme-select');
const setAllCompletedBtn = document.getElementById('set-all-completed-btn');
const clearCompletedBtn  = document.getElementById('clear-completed-btn');
const clearAllBtn        = document.getElementById('clear-all-btn');

async function loadAndRender() {
    todos = await todoService.getAll();
    renderTodos(todos);
}

async function handleToggle(id, text, completed) {
    await todoService.update(id, { text, completed: !completed });
    await loadAndRender();
}

async function handleDelete(id) {
    await todoService.remove(id);
    await loadAndRender();
}

async function handleFinishEdit(id, newText) {
    newText = newText.trim();
    if (newText === '') { await loadAndRender(); return; }
    await todoService.update(id, { text: newText });
    await loadAndRender();
}

async function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    await todoService.create(text);
    todoInput.value = '';
    todoInput.focus();
    await loadAndRender();
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTodo();
});

setAllCompletedBtn.addEventListener('click', async function () {
    await todoService.setAllCompleted();
    await loadAndRender();
});

clearCompletedBtn.addEventListener('click', async function () {
    await todoService.clearCompleted();
    await loadAndRender();
});

clearAllBtn.addEventListener('click', async function () {
    await todoService.clearAll();
    await loadAndRender();
});

searchInput.addEventListener('input',    function () { renderTodos(todos); });
filterSelect.addEventListener('change',  function () { renderTodos(todos); });

themeSelect.addEventListener('change', function () {
    applyTheme(this.value);
});

async function init() {
    applyTheme(loadTheme());
    await loadAndRender();
}

init();

init();