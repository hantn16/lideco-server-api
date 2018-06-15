const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');
const { ObjectID } = require('mongodb');
const mongoose = require('../db/mongoose');
const { uploadImage } = require('../middleware/uploadImage');
const { upload, loadCollection, db } = require('../configs/multer.config');

//POST /users
router.post('/', upload.single('avatar'), (req, res) => {
    loadCollection('images', db)
        .then((collection) => {
            const data = collection.insert(req.file);
            db.saveDatabase();
            const url = req.protocol + "://" + req.get("host");
            const filePath = url + "/public/uploads/" + data.filename;
            const body = _.pick(req.body, ['email', 'password', 'name', 'fullName']);
            const newUser = new User({ ...body, imgLink: filePath });
            newUser.save().then(() => {
                return newUser.generateAuthToken();
            }).then((token) => {
                res.header('x-auth', token).send({ idToken: token, expiresIn: 300 });
            })
        }).catch((err) => {
            res.status(400).send(err);
        })
});

//POST /users/login
router.post('/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({ idToken: token, expiresIn: 6000 });
        });
    }).catch((e) => {
        res.status(400).send(e);
    });

});

// DELETE /users/me/token
router.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /users/me
router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

//GET /users
router.get('/getall', authenticate, (req, res, next) => {
    User.find().then((users) => {
        res.send({ users });
    }, (err) => {
        res.status(400).send(err);
    });
});
//PATCH /users/:id
router.patch(`/:id`, authenticate, upload.single('avatar'), (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send('ObjectID is not valid');
    }
    loadCollection('images', db)
        .then((collection) => {
            const data = collection.insert(req.file);
            db.saveDatabase();
            const url = req.protocol + "://" + req.get("host");
            const filePath = url + "/public/uploads/" + data.filename;
            const body = _.pick(req.body, ['email', 'name', 'fullName']);
            body._modifiedBy = req.user._id;
            User.findOneAndUpdate({
                _id: req.params.id
            }, {
                    $set: { ...body, imgLink: filePath }
                }, { new: true }).then((user) => {
                    if (!user) {
                        res.status(404).send(e);
                    }
                    res.send({ user });
                }).catch((e) => {
                    res.send(e);
                });
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        })
});
module.exports = router;