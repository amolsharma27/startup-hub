import { Server } from 'socket.io';
import Message from '../models/Message.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinStartup', (startupId) => {
      socket.join(startupId);
    });

    socket.on('sendMessage', async ({ startupId, senderId, text }) => {
      const message = await Message.create({ startup: startupId, sender: senderId, text });
      const populated = await message.populate('sender', 'name profilePhoto');
      io.to(startupId).emit('newMessage', populated);
    });
  });
};
