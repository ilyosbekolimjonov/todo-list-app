import todoService from '../services/todoService.js';

const todoController = {
  async getAll(req, res) {
    try {
      const todos = await todoService.getAllTodos();
      res.json({ success: true, data: todos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { text } = req.body;
      const todo = await todoService.createTodo(text);
      res.status(201).json({ success: true, data: todo });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const todo = await todoService.updateTodo(id, req.body);
      res.json({ success: true, data: todo });
    } catch (err) {
      const status = err.message === 'Todo not found' ? 404 : 400;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const todo = await todoService.deleteTodo(id);
      res.json({ success: true, data: todo });
    } catch (err) {
      const status = err.message === 'Todo not found' ? 404 : 500;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  async setAllCompleted(req, res) {
    try {
      const todos = await todoService.setAllCompleted();
      res.json({ success: true, data: todos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async clearCompleted(req, res) {
    try {
      const todos = await todoService.clearCompleted();
      res.json({ success: true, data: todos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async clearAll(req, res) {
    try {
      const todos = await todoService.clearAll();
      res.json({ success: true, data: todos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

export default todoController;
