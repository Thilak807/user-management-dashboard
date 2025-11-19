const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const taskSummary = await Task.aggregate([
    { $match: { user: user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const summary = taskSummary.reduce(
    (acc, item) => {
      acc[item._id] = item.count;
      return acc;
    },
    { todo: 0, 'in-progress': 0, done: 0 }
  );

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    stats: summary,
  });
});

