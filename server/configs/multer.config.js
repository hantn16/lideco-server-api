const multer = require('multer');
const path = require('path');
const Loki = require('lokijs');
const fs = require('fs');

// setup
const DB_NAME = 'db.json';
const UPLOAD_PATH = path.join(__dirname,'..','..','dist/mean-stack-angularcli/uploads');
const upload = multer({ dest: `${UPLOAD_PATH}/` }); // multer configuration
const db = new Loki(path.join(UPLOAD_PATH,DB_NAME), { persistenceMethod: 'fs' });
module.exports = {upload, db, UPLOAD_PATH};
