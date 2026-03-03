function formatTimestamp(ts) {
    const d = new Date(Number(ts));
    const day     = String(d.getDate()).padStart(2, '0');
    const month   = String(d.getMonth() + 1).padStart(2, '0');
    const year    = d.getFullYear();
    const hours   = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function applyTheme(theme) {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    document.getElementById('theme-select').value = theme;
    saveTheme(theme);
}

function renderTodos(todos) {
    const taskList    = document.getElementById('task-list');
    const totalCounter = document.getElementById('total-counter');
    const searchTerm  = document.getElementById('search-input').value.trim().toLowerCase();
    const filterValue = document.getElementById('filter-select').value;

    const filtered = todos.filter(function (todo) {
        const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
        let matchesFilter = true;
        if (filterValue === 'active')    matchesFilter = !todo.completed;
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
        filtered.forEach(function (todo) {
            taskList.appendChild(createTaskElement(todo));
        });
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
    checkbox.addEventListener('change', async function () {
        await handleToggle(todo.id, todo.text, todo.completed);
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
        startEdit(todo.id, todo.text);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete task';
    const deleteImg = document.createElement('img');
    deleteImg.src = './images/eraser-solid-full.svg';
    deleteImg.alt = 'delete';
    deleteBtn.appendChild(deleteImg);
    deleteBtn.addEventListener('click', async function () {
        await handleDelete(todo.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(content);
    taskItem.appendChild(actions);

    return taskItem;
}

function startEdit(id, currentText) {
    const taskEl = document.querySelector(`[data-id="${id}"]`);
    if (!taskEl) return;

    const contentDiv = taskEl.querySelector('.task-content');
    contentDiv.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    contentDiv.appendChild(input);
    input.select();

    let cancelled = false;

    input.addEventListener('keydown', async function (e) {
        if (e.key === 'Enter') await handleFinishEdit(id, input.value);
        if (e.key === 'Escape') { cancelled = true; await loadAndRender(); }
    });

    input.addEventListener('blur', async function () {
        if (!cancelled) await handleFinishEdit(id, input.value);
    });
}
