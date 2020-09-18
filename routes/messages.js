const io = require('../app').io;
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const ac = require('../utils/events');

let connectedUsers = {};
module.exports = (socket) => {

  socket.on(ac.CONNECT_USER, (id,) => {
    connectedUsers[id] = socket.id;
    socket.socketId = id;
  });

  socket.on(ac.GET_CHAT, async (users) => {
    const chat = await Chat.findOne({users: {$all: users}}).populate('users');
    socket.emit(ac.SEND_CHAT, chat);
  });

  socket.on(ac.NEW_MESSAGE, async ({message, users, sender}) => {
    const chat = await Chat.findOne({users: {$all: users}});
    let newMessage;
    if (chat) {
      newMessage = new Message({
        message,
        users: users,
        sender,
        chat_id: chat._id,
      });
      await newMessage.save();
    } else {
      const newChat = new Chat({users});
      await newChat.save();
      newMessage = new Message({
        message,
        users: users,
        sender,
        chat_id: newChat._id,
      });
      await newMessage.save();
    }
    if (Object.keys(connectedUsers).includes(users[1])) {
      io.to(connectedUsers[users[1]]).emit(ac.SEND_MESSAGE, {newMessage, id: users[1]});
    }
  });

  socket.on(ac.GET_MESSAGES, async (chat_id) => {
    const messages = await Message.find({chat_id}).sort({updatedAt: -1})
      .limit(20);
    socket.emit(ac.GET_ALL_MESSAGES, {messages, chat_id});
  });

  socket.on('disconnect', () => {
    delete connectedUsers[socket.socketId];
  });
}

