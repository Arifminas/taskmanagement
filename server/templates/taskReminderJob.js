const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

cron.schedule('0 8 * * *', async () => {
  // Runs daily at 8:00 AM
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days later

  const tasksDueSoon = await Task.find({
    dueDate: { $gte: now, $lte: soon },
    status: { $ne: 'completed' }
  }).populate('assignee');

  for (const task of tasksDueSoon) {
    if (task.assignee) {
      await sendEmail(
        task.assignee.email,
        `Reminder: Task Due Soon: ${task.title}`,
        `Your task "${task.title}" is due on ${task.dueDate}. Please take necessary action.`,
        `<p>Your task <strong>${task.title}</strong> is due on <strong>${task.dueDate}</strong>.</p>`
      );
    }
  }
});
module.exports = cron;