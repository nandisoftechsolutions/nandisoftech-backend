const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/admins/');
  },
  filename: (req, file, cb) => {
    cb(null, `admin_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isValid) cb(null, true);
  else cb(new Error('Only JPEG/PNG images allowed!'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
