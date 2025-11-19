const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('../utils/asyncHandler');

exports.createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const payload = { ...req.body, user: req.user.id };
  const task = await Task.create(payload);

  // Log activity
  await ActivityLog.create({
    user: req.user.id,
    task: task._id,
    action: 'created',
    description: `Task "${task.title}" created`,
  });

  res.status(201).json({ task });
});

exports.getTasks = asyncHandler(async (req, res) => {
  const { q, status, priority, category, dateFilter, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const filter = { user: req.user.id };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (category) {
    filter.category = category;
  }

  // Date filtering
  if (dateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (dateFilter) {
      case 'today':
        filter.dueDate = { $gte: today, $lt: tomorrow };
        break;
      case 'this-week':
        filter.dueDate = { $gte: today, $lt: nextWeek };
        break;
      case 'overdue':
        filter.dueDate = { $lt: today };
        filter.status = { $ne: 'done' };
        break;
      case 'upcoming':
        filter.dueDate = { $gte: today };
        break;
    }
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { notes: { $regex: q, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const tasks = await Task.find(filter).sort(sortOptions);
  res.json({ tasks });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const oldTask = await Task.findOne({ _id: id, user: req.user.id });
  if (!oldTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const payload = { ...req.body };
  delete payload.user;

  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    payload,
    { new: true }
  );

  // Log activity for status/priority changes
  const changes = {};
  if (payload.status && payload.status !== oldTask.status) {
    changes.status = { from: oldTask.status, to: payload.status };
    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      action: 'status_changed',
      changes: { status: { from: oldTask.status, to: payload.status } },
      description: `Status changed from ${oldTask.status} to ${payload.status}`,
    });
  }
  if (payload.priority && payload.priority !== oldTask.priority) {
    changes.priority = { from: oldTask.priority, to: payload.priority };
    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      action: 'priority_changed',
      changes: { priority: { from: oldTask.priority, to: payload.priority } },
      description: `Priority changed from ${oldTask.priority} to ${payload.priority}`,
    });
  }
  if (Object.keys(changes).length === 0) {
    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      action: 'updated',
      description: `Task "${task.title}" updated`,
    });
  }

  res.json({ task });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Log activity
  await ActivityLog.create({
    user: req.user.id,
    task: task._id,
    action: 'deleted',
    description: `Task "${task.title}" deleted`,
  });

  res.json({ message: 'Task deleted' });
});

exports.bulkUpdate = asyncHandler(async (req, res) => {
  const { taskIds, updates } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ message: 'taskIds must be a non-empty array' });
  }

  const result = await Task.updateMany(
    { _id: { $in: taskIds }, user: req.user.id },
    { $set: updates }
  );

  // Log bulk activity
  for (const taskId of taskIds) {
    await ActivityLog.create({
      user: req.user.id,
      task: taskId,
      action: 'updated',
      description: 'Bulk update applied',
      changes: updates,
    });
  }

  res.json({ message: `${result.modifiedCount} tasks updated` });
});

exports.bulkDelete = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ message: 'taskIds must be a non-empty array' });
  }

  const tasks = await Task.find({ _id: { $in: taskIds }, user: req.user.id });

  // Log activities before deletion
  for (const task of tasks) {
    await ActivityLog.create({
      user: req.user.id,
      task: task._id,
      action: 'deleted',
      description: `Task "${task.title}" deleted (bulk)`,
    });
  }

  const result = await Task.deleteMany({ _id: { $in: taskIds }, user: req.user.id });

  res.json({ message: `${result.deletedCount} tasks deleted` });
});

exports.getStatistics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    tasksByCategory,
    overdueTasks,
    tasksThisWeek,
    completionRate,
  ] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
    Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    }),
    Task.countDocuments({
      user: userId,
      dueDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
        $lt: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7)),
      },
    }),
    Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          done: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const stats = {
    total: totalTasks,
    byStatus: tasksByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byPriority: tasksByPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byCategory: tasksByCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    overdue: overdueTasks,
    thisWeek: tasksThisWeek,
    completionRate:
      completionRate[0] && completionRate[0].total > 0
        ? Math.round((completionRate[0].done / completionRate[0].total) * 100)
        : 0,
  };

  res.json({ stats });
});

