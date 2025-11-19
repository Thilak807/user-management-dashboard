const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createTemplateValidation,
  updateTemplateValidation,
  templateIdValidation,
} = require('../validators/templateValidators');
const {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  createTaskFromTemplate,
} = require('../controllers/templateController');

const router = express.Router();

router.use(authMiddleware);
router.route('/').get(getTemplates).post(createTemplateValidation, createTemplate);
router
  .route('/:id')
  .get(templateIdValidation, getTemplate)
  .put(templateIdValidation, updateTemplateValidation, updateTemplate)
  .delete(templateIdValidation, deleteTemplate);
router.post('/:id/create-task', templateIdValidation, createTaskFromTemplate);

module.exports = router;

