const { validationResult } = require('express-validator');
const TaskTemplate = require('../models/TaskTemplate');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

exports.createTemplate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const payload = { ...req.body, user: req.user.id };
  const template = await TaskTemplate.create(payload);
  res.status(201).json({ template });
});

exports.getTemplates = asyncHandler(async (req, res) => {
  const templates = await TaskTemplate.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ templates });
});

exports.getTemplate = asyncHandler(async (req, res) => {
  const template = await TaskTemplate.findOne({ _id: req.params.id, user: req.user.id });
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  res.json({ template });
});

exports.updateTemplate = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const template = await TaskTemplate.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.json({ template });
});

exports.deleteTemplate = asyncHandler(async (req, res) => {
  const template = await TaskTemplate.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  res.json({ message: 'Template deleted' });
});

exports.createTaskFromTemplate = asyncHandler(async (req, res) => {
  const template = await TaskTemplate.findOne({ _id: req.params.id, user: req.user.id });
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  const taskData = {
    user: req.user.id,
    title: template.title,
    description: template.description,
    category: template.category,
    priority: template.priority,
    templateId: template._id,
  };

  const task = await Task.create(taskData);
  res.status(201).json({ task });
});

