const API_BASE = 'http://localhost:5000/api/todos';

const todoService = {
    async getAll() {
        const res = await axios.get(API_BASE);
        return res.data.data;
    },

    async create(text) {
        const res = await axios.post(API_BASE, { text });
        return res.data.data;
    },

    async update(id, fields) {
        const res = await axios.put(`${API_BASE}/${id}`, fields);
        return res.data.data;
    },

    async remove(id) {
        const res = await axios.delete(`${API_BASE}/${id}`);
        return res.data.data;
    },

    async setAllCompleted() {
        const res = await axios.patch(`${API_BASE}/complete-all`);
        return res.data.data;
    },

    async clearCompleted() {
        const res = await axios.delete(`${API_BASE}/completed`);
        return res.data.data;
    },

    async clearAll() {
        const res = await axios.delete(API_BASE);
        return res.data.data;
    },
};
