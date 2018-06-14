const express = require("express");
const multer = require("multer");
const {upload, db} = require('../configs/multer.config');
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
        req.file.filePath = req.protocol + "://" + req.get("host") + "/public/uploads/" + data.filename;
        next();
    }).catch((e) => next(e));
};
module.exports = { uploadImage };