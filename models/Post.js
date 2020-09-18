const {Schema, model, Types} = require('mongoose');


const PostSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  postImageId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [{
    _id: {
      type: String,
      default: Date.now,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [{type: Types.ObjectId}],
  }],
  likes: [{type: Types.ObjectId, ref: 'User'}],
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});


const Post = model('Post', PostSchema);

module.exports = Post;
