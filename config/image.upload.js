const cloudinary = require('cloudinary');
const path = require('path');
const config = require('config');
const fs = require('fs');
const multer = require('multer');
const {nanoid} = require('nanoid');

cloudinary.config(config.get('cloudinaryConfig'));

const uploadImage = (path) => {
  return cloudinary.v2.uploader.upload(path, (error, result) => {
      if (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(result);
    });
}
const removeImage = (id) => {
  return new Promise(((resolve) => {
    cloudinary.uploader.destroy(id, (result) => {
      resolve(result);
    });
  }));
}
const deleteLocalImage = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, e => {
      if (e) {
        return reject(e);
      }
      return resolve(true);
    });
  });
};


const uploadPath = path.join(__dirname, '..', 'public');

const tryToCreateDir = async dirName => {
  const dirPath = path.join(uploadPath, dirName);

  try {
    await fs.promises.access(dirPath);
  } catch (e) {
    await fs.promises.mkdir(dirPath, {recursive: true});
  }
};

const createMulter = dirName => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await tryToCreateDir(dirName);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = nanoid() + path.extname(file.originalname);
      const filepath = path.join(dirName, filename);

      cb(null, filepath);
    }
  });

  return multer({storage});
};

const uploads = createMulter('uploads');
const avatar = createMulter('avatars');

module.exports = {
  uploads,
  avatar,
  uploadPath,
  uploadImage,
  removeImage,
  deleteLocalImage,
};
