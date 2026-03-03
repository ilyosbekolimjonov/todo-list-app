import pool from '../config/db.js';

const todoRepository = {
    async init() {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id        VARCHAR(20)  PRIMARY KEY,
        text      TEXT         NOT NULL,
        completed BOOLEAN      NOT NULL DEFAULT false,
        timestamp BIGINT       NOT NULL
      );
    `);
    },

    async findAll() {
        const result = await pool.query(
            'SELECT * FROM todos ORDER BY timestamp DESC'
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            'SELECT * FROM todos WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    async create({ id, text, completed, timestamp }) {
        const result = await pool.query(
            `INSERT INTO todos (id, text, completed, timestamp)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, text, completed, timestamp]
        );
        return result.rows[0];
    },

    async update(id, fields) {
        const { text, completed } = fields;
        const result = await pool.query(
            `UPDATE todos SET text = $1, completed = $2
       WHERE id = $3 RETURNING *`,
            [text, completed, id]
        );
        return result.rows[0] || null;
    },

    async setAllCompleted() {
        const result = await pool.query(
            'UPDATE todos SET completed = true RETURNING *'
        );
        return result.rows;
    },

    async deleteById(id) {
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0] || null;
    },

    async deleteCompleted() {
        const result = await pool.query(
            'DELETE FROM todos WHERE completed = true RETURNING *'
        );
        return result.rows;
    },

    async deleteAll() {
        const result = await pool.query('DELETE FROM todos RETURNING *');
        return result.rows;
    },
};

export default todoRepository;
