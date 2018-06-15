const express = require("express");
const multer = require("multer");
const { upload, db } = require('../configs/multer.config');
const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}
var uploadImage = (req, res, next) => {
    upload.single('avatar');
    loadCollection('images', db)
        .then((collection) => {
            const data = collection.insert(req.file);
            db.saveDatabase();
            const url = req.protocol + "://" + req.get("host");
            req.file.filePath = url + "/public/uploads/" + data.filename;
            next();
        }).catch((e) => next(e));
};
var uploadImages = (req, res, next) => {
    upload.array('photos', 12);
    loadCollection('images', db).then((col) => {
        let data = [].concat(col.insert(req.files));
        db.saveDatabase();
        const url = req.protocol + "://" + req.get("host");
        req.files = data.map(x => ({
            ...x,
            filePath: url + "/public/uploads/" + x.filename
        }));
        next();
    }).catch((e) => next(e));
};
module.exports = { uploadImage, uploadImages };