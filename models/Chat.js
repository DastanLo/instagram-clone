const {Schema, model, Types} = require('mongoose');

const ChatSchema = Schema({
  users: [{type: Types.ObjectId, ref: 'User', required: true}],
});

const Chat = model('Chat', ChatSchema);
module.exports = Chat;
