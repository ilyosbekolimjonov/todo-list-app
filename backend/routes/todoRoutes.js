import { Router } from 'express';
import todoController from '../controllers/todoController.js';

const router = Router();

router.patch('/complete-all', todoController.setAllCompleted);
router.delete('/completed',   todoController.clearCompleted);
router.delete('/',            todoController.clearAll);
router.get('/',               todoController.getAll);
router.post('/',              todoController.create);
router.put('/:id',            todoController.update);
router.delete('/:id',         todoController.remove);

export default router;
