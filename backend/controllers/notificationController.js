const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const memoryStore = require('../utils/memoryStore');

// @desc Get current user notifications
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);

      const unreadCount = await Notification.countDocuments({
        userId: req.user._id,
        read: false,
      });

      return res.json({
        notifications,
        unreadCount,
      });
    } else {
      await memoryStore.seed();
      const userNotifs = memoryStore.notifications
        .filter((n) => n.userId.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20);

      const unreadCount = memoryStore.notifications.filter(
        (n) => n.userId.toString() === req.user._id.toString() && !n.read
      ).length;

      return res.json({
        notifications: userNotifs,
        unreadCount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark single notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      return res.json(notification);
    } else {
      await memoryStore.seed();
      const notif = memoryStore.notifications.find(
        (n) => n._id === req.params.id && n.userId.toString() === req.user._id.toString()
      );
      if (!notif) return res.status(404).json({ message: 'Notification not found' });

      notif.read = true;
      return res.json(notif);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark all user notifications as read
// @route PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
      return res.json({ message: 'All notifications marked as read' });
    } else {
      await memoryStore.seed();
      memoryStore.notifications.forEach((n) => {
        if (n.userId.toString() === req.user._id.toString()) n.read = true;
      });
      return res.json({ message: 'All notifications marked as read' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
