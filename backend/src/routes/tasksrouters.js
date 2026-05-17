import express from 'express';
import { getAllTasks } from '../controllers/tasksController.js';
import { createtask } from '../controllers/tasksController.js';
import { updatetask } from '../controllers/tasksController.js';
import { deletetask } from '../controllers/tasksController.js';

const router = express.Router();


router.get("/", getAllTasks); 
router.post("/", createtask);
router.put("/:id", updatetask);
router.delete("/:id", deletetask);

export default router;
