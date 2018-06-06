const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { User } = require('../models/user');
const _ = require('lodash');
const { authenticate } = require('../middleware/authenticate');

//POST /users
router.post('/', (req, res) => {
    const body = _.pick(req.body, ['email', 'password','name','fullName','imgLink']);
    const newUser = new User(body);
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({idToken:token,expiresIn: 300});
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

module.exports = router;