const {Schema, model, Types} = require('mongoose');

const MessageSchema = Schema({
  message: {type: String, required: true},
  chat_id: {type: Types.ObjectId, ref: 'Chat', required: true},
  sender: {type: Types.ObjectId, ref: 'User', required: true},
  date: {type: Date, default: Date.now},
  isLink: {type: Boolean, default: false},
});

const Message = model('Message', MessageSchema);
module.exports = Message;
