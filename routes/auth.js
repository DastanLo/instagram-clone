const {Router} = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Chat = require('../models/Chat');
const router = Router();
const auth = require('../middlewares/auth.middleware');
const removeImage = require('../config/image.upload').removeImage;
const upload = require('../config/image.upload').avatar;
const deleteImage = require('../config/image.upload').deleteLocalImage;
const imageUpload = require('../config/image.upload').uploadImage;


router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({min: 6})
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Минимальная длина пароля 6 символов'
        });
      }

      const {email, password, username, fullName} = req.body;

      const user = new User({email, password, username, fullName});

      await user.save();

      res.status(201).json({message: 'Пользователь создан'});

    } catch (e) {
      res.status(500).json(e);
    }
  })

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }

      const {email, password} = req.body;

      const user = await User.findOne({email}).populate('followers').populate('follows');

      if (!user) {
        return res.status(400).json({message: 'Пользователь не найден'});
      }

      const isMatch = await user.checkPassword(password);

      if (!isMatch) {
        return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
      }

      const token = jwt.sign(
        {userId: user._id},
        config.get('jwtSecret'),
        {expiresIn: '2h'}
      );
      delete user.password;
      res.json({user, token});
    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'});
    }
  });

router.get('/profile/:id', [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers').populate('follows');
    if (!user) {
      return res.status(400).json({message: 'Пользователь не найден'});
    }
    delete user.password;
    return res.status(200).json(user);
  } catch (e) {
    res.status(400).json({message: 'Что-то пошло не так'});
  }
});

router.delete('/login', [auth], async (req, res) => {
  res.sendStatus(200);
});

router.post('/subscribe', [auth], async (req, res) => {
  const {id} = req.body;
  try {
    // await User.updateOne({_id: req.user._id}, {
    //   $push: {
    //     follows: id,
    //   }
    // }, {runValidators: true});
    // await User.updateOne({_id: id}, {
    //   $push: {
    //     followers: req.user._id,
    //   }
    // }, {runValidators: true});
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/unsubscribe', [auth], async (req, res) => {
  const {id} = req.body;
  try {
    await User.updateOne({_id: req.user._id}, {
      $pull: {
        follows: id,
      }
    }, {runValidators: true});
    await User.updateOne({_id: id}, {
      $pull: {
        followers: req.user._id,
      }
    }, {runValidators: true});
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/search', [auth], async (req, res) => {
  try {
    const user = await User.find({username: {$regex: req.body.username}});
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так'});
  }
});

router.put('/profile', [auth, upload.single('avatar')], async (req, res) => {
  try {
    if (req.file) {
      if (req.user.avatar) {
        const response = await removeImage(req.user.avatarId);
        console.log(response);
      }
      const result = await imageUpload(req.file.path);
      await deleteImage(req.file.path);
      req.user.avatar = result.secure_url;
      req.user.avatarId = result.public_id;
    }
    await req.user.save();
    return res.status(200).json(req.user);
  } catch (e) {
    return res.sendStatus(500);
  }
});
router.get('/chats', [auth], async (req, res) => {
  const chats = await Chat.find({users: req.user._id}).populate('users');
  res.json({chats, id: req.user._id});
})


module.exports = router;
