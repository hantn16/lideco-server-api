const multer = require('multer');
const path = require('path');
const Loki = require('lokijs');
const fs = require('fs');

const UPLOAD_PATH = path.join(__dirname, '..', '..', 'public/uploads');
const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${UPLOAD_PATH}/`)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).toLowerCase().split(" ").join("-");
    cb(null, name + "-" + Date.now() + ext)
  }
})

const loadCollection = function (colName, db) {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const _collection = db.getCollection(colName) || db.addCollection(colName);
      resolve(_collection);
    })
  });
}
// setup
const DB_NAME = 'db.json';

const upload = multer({ storage: storage, fileFilter: imageFilter }); // multer configuration
const db = new Loki(path.join(UPLOAD_PATH, DB_NAME), { persistenceMethod: 'fs' });
module.exports = { upload, db, UPLOAD_PATH, loadCollection };
