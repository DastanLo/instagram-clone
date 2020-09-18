const {Schema, model, Types} = require('mongoose')
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        if (!this.isModified('email')) return true;
        const user = await User.findOne({email: value});
        if (user) throw new Error('Пользователь с таким email уже существует');
        return true;
      },
      message: 'Пользователь с таким email уже существует'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        if (!this.isModified('username')) return true;
        const user = await User.findOne({username: value});
        if (user) throw new Error('Пользователь с таким username уже существует');
        return true;
      },
      message: 'Пользователь с таким username уже существует'
    }
  },
  fullName: {type: String, required: true},
  password: {type: String, required: true},
  avatar: {type: String},
  avatarId: {type: String},
  followers: [{type: Types.ObjectId, ref: 'User'}],
  follows: [{type: Types.ObjectId, ref: 'User'}],
});
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

schema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};


const User = model('User', schema);
module.exports = User;
