const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/authenticate');
const { upload, db, UPLOAD_PATH } = require('../configs/multer.config');
const mongoose = require('../db/mongoose');

const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

router.post('/image', authenticate, upload.single('avatar'), (req, res) => {
    loadCollection('images', db)
        .then((collection) => {
            console.log(req.file);
            const data = collection.insert(req.file);
            db.saveDatabase();
            res.send({ id: data.$loki, filename: data.filename, originalname: data.originalname });
        }).catch((e) => { res.sendStatus(400).send(e); });
})

//upload multi-images
router.post('/images', authenticate, upload.array('photos', 12), (req, res) => {
    loadCollection('images', db).then((col) => {
        let data = [].concat(col.insert(req.files));
        db.saveDatabase();
        res.send(data.map(x => ({ id: x.$loki, filename: x.filename, originalname: x.originalname })));
    }).catch((e) => res.sendStatus(400).send(e));
})

//get all images
router.get('/images', authenticate, (req, res) => {
    loadCollection('images', db).then((col) => {
        res.send(col.data);
    }).catch((err) => res.sendStatus(400).send(err));
})
router.get('/image/:id', authenticate, (req, res) => {
    loadCollection('images', db).then((col) => {
        const result = col.get(req.params.id);
        if (!result) {
            return res.sendStatus(404);
        };
        res.send(result);
    }).catch((e) => {
        res.sendStatus(400).send(e);
    });
});

//get image by id
router.get('/images/:id', authenticate, (req, res) => {
    loadCollection('images', db).then((col) => {
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
