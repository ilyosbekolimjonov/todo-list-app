import todoRepository from '../repositories/todoRepository.js';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const todoService = {
    async getAllTodos() {
        return await todoRepository.findAll();
    },

    async createTodo(text) {
        if (!text || text.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }
        const newTodo = {
            id: generateId(),
            text: text.trim(),
            completed: false,
            timestamp: Date.now(),
        };
        return await todoRepository.create(newTodo);
    },

    async updateTodo(id, fields) {
        const existing = await todoRepository.findById(id);
        if (!existing) {
            throw new Error('Todo not found');
        }

        const updated = {
            text: fields.text !== undefined ? fields.text.trim() : existing.text,
            completed: fields.completed !== undefined ? fields.completed : existing.completed,
        };

        if (updated.text === '') {
            throw new Error('Todo text cannot be empty');
        }

        return await todoRepository.update(id, updated);
    },

    async deleteTodo(id) {
        const deleted = await todoRepository.deleteById(id);
        if (!deleted) {
            throw new Error('Todo not found');
        }
        return deleted;
    },

    async setAllCompleted() {
        return await todoRepository.setAllCompleted();
    },

    async clearCompleted() {
        return await todoRepository.deleteCompleted();
    },

    async clearAll() {
        return await todoRepository.deleteAll();
    },
};

export default todoService;
