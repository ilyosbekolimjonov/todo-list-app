function saveTheme(theme) {
    localStorage.setItem('todo-theme', theme);
}

function loadTheme() {
    return localStorage.getItem('todo-theme') || 'light';
}
