const { body, param } = require('express-validator');

const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('notes').optional().trim(),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage('Category must be work, personal, shopping, health, or other'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().toDate().withMessage('dueDate must be a valid date'),
];

const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('notes').optional().trim(),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage('Category must be work, personal, shopping, health, or other'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().toDate().withMessage('dueDate must be a valid date'),
];

const taskIdValidation = [
  param('id').isMongoId().withMessage('Task id must be a valid Mongo ObjectId'),
];

const bulkUpdateValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('taskIds must be a non-empty array'),
  body('taskIds.*').isMongoId().withMessage('Each taskId must be a valid Mongo ObjectId'),
  body('updates')
    .optional()
    .isObject()
    .withMessage('updates must be an object'),
  body('updates.status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('updates.priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('updates.category')
    .optional()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage('Category must be work, personal, shopping, health, or other'),
];

const bulkDeleteValidation = [
  body('taskIds')
    .isArray({ min: 1 })
    .withMessage('taskIds must be a non-empty array'),
  body('taskIds.*').isMongoId().withMessage('Each taskId must be a valid Mongo ObjectId'),
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  bulkUpdateValidation,
  bulkDeleteValidation,
};

