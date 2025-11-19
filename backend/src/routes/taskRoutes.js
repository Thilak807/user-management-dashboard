const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  bulkUpdateValidation,
  bulkDeleteValidation,
} = require('../validators/taskValidators');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  bulkUpdate,
  bulkDelete,
  getStatistics,
} = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);
router.route('/').get(getTasks).post(createTaskValidation, createTask);
router.post('/bulk-update', bulkUpdateValidation, bulkUpdate);
router.post('/bulk-delete', bulkDeleteValidation, bulkDelete);
router.get('/statistics', getStatistics);
router
  .route('/:id')
  .put(taskIdValidation, updateTaskValidation, updateTask)
  .delete(taskIdValidation, deleteTask);

module.exports = router;

