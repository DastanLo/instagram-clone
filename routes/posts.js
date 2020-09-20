const express = require('express');
const {nanoid} = require('nanoid');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const auth = require('../middlewares/auth.middleware');
const uploads = require('../config/image.upload').uploads;
const removeImage = require('../config/image.upload').deleteLocalImage;
const imageUpload = require('../config/image.upload').uploadImage;

const router = express.Router();

router.get('/', [auth], async (req, res) => {
  const posts = await Post.find({user: {$in: [...req.user.follows, req.user._id]}})
    .sort({date: -1})
    .limit(25)
    .populate('user')
    .populate('comments.user');
  res.send(posts);
});

router.get('/user-posts/:id', [auth], async (req, res) => {
  const posts = await Post.find({user: req.params.id});
  res.send(posts);
});

router.get('/:id', [auth], async (req, res) => {
  const post = await Post.findOne({_id: req.params.id}).populate('user').populate('comments.user');
  res.send(post);
});

router.post('/', [auth, uploads.single('image')], async (req, res) => {
  try {
    if (!req.body.description || !req.file) {
      return res.status(400).json({message: 'Все поля должны быть заполнены'});
    }
    const result = await imageUpload(req.file.path);
    await removeImage(req.file.path);
    const postData = {
      description: req.body.description,
      user: req.user._id,
      image: result.secure_url,
    };

    const post = new Post(postData);

    await post.save();

    return res.status(201).json({id: post._id});
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.post('/comment', [auth], async (req, res) => {
  try {
    const commentData = {
      user: req.user._id,
      text: req.body.text,
      _id: nanoid(),
    };
    await Post.updateOne({_id: req.body.post}, {
      $push: {
        comments: {...commentData},
      }
    });
    return res.status(201).json({...commentData, user: req.user});
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.post('/like', [auth], async (req, res) => {
  try {
    await Post.updateOne({_id: req.body.id}, {
      $push: {
        likes: req.user._id,
      }
    });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/unLike', [auth], async (req, res) => {
  try {
    await Post.updateOne({_id: req.body.id}, {
      $pull: {
        likes: req.user._id,
      }
    });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/comment-like', [auth], async (req, res) => {
  try {
    const {commentId, postId} = req.body;
    const post = await Post.findById(postId);
    const index = post.comments.findIndex(c => c._id === commentId);
    post.comments[index].likes.push(req.user._id);
    await post.save();
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/comment-unlike', [auth], async (req, res) => {
  try {
    const {commentId, postId} = req.body;
    const post = await Post.findById(postId);
    const index = post.comments.findIndex(c => String(c._id) === String(commentId));
    post.comments[index].likes = post.comments[index].likes.filter(l => String(l) !== String(req.user._id));
    await post.save();
    return res.sendStatus(200);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post('/share', [auth], async (req, res) => {
  try {
    const chat = await Chat.findOne({users: {$all: req.body.users}});
    let newMessage;
    if (chat) {
      newMessage = new Message({...req.body, chat_id: chat._id});
      await newMessage.save();
    } else {
      const newChat = new Chat({users: req.body.users});
      await newChat.save();
      newMessage = new Message({...req.body, chat_id: newChat._id});
      await newMessage.save();
    }
    res.sendStatus(201);
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = router;
