const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Loki = require('lokijs');
const fs = require('fs');
const { authenticate } = require('../middleware/authenticate');
const { upload, db ,UPLOAD_PATH} = require('../configs/multer.config');

const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

router.post('/image', upload.single('avatar'), (req, res) => {
    loadCollection('images', db).then((collection) => {
        const data = collection.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, filename: data.filename, originalname: data.originalname });
    }).catch((e) => { res.sendStatus(400).send(e); });
})

//upload multi-images
router.post('/images', upload.array('photos', 12), (req, res) => {
    loadCollection('images', db).then((col) => {
        let data = [].concat(col.insert(req.files));
        db.saveDatabase();
        res.send(data.map(x => ({ id: x.$loki, filename: x.filename, originalname: x.originalname })));
    }).catch((e) => res.sendStatus(400).send(e));
})

//get all images
router.get('/images', (req, res) => {
    loadCollection('images', db).then((col) => {
        res.send(col.data);
    }).catch((err) => res.sendStatus(400).send(err));
})

//get image by id
router.get('/images/:id', (req, res) => {
    loadCollection('images', db).then((col) =>{
        const result = col.get(req.params.id);
        if (!result) {
            return res.sendStatus(404);
        };
        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
    }).catch((e) => {
        res.sendStatus(400).send(e);
    });  
})
module.exports = router;
