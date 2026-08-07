import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const notifyAdmins = async ({ fromUser, title, message }) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const notificationPromises = admins.map(admin => 
      Notification.create({
        user: admin._id,
        fromUser: fromUser || null,
        title,
        message
      })
    );
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error('Failed to notify admins:', error);
  }
};
