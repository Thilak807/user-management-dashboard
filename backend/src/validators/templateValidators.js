const { body, param } = require('express-validator');

const createTemplateValidation = [
  body('name').trim().notEmpty().withMessage('Template name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage('Category must be work, personal, shopping, health, or other'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
];

const updateTemplateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Template name cannot be empty'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage('Category must be work, personal, shopping, health, or other'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
];

const templateIdValidation = [
  param('id').isMongoId().withMessage('Template id must be a valid Mongo ObjectId'),
];

module.exports = {
  createTemplateValidation,
  updateTemplateValidation,
  templateIdValidation,
};

