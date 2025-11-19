const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('../utils/asyncHandler');

exports.getActivityLogs = asyncHandler(async (req, res) => {
  const { taskId, limit = 50 } = req.query;
  const filter = { user: req.user.id };

  if (taskId) {
    filter.task = taskId;
  }

  const logs = await ActivityLog.find(filter)
    .populate('task', 'title')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({ logs });
});

