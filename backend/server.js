import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import todoRepository from './repositories/todoRepository.js';

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.get('/', (req, res) => res.json({ message: 'Todo API is running' }));

async function start() {
  try {
    await todoRepository.init();
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
