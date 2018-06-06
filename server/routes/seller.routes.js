const express = require('express');
const router = express.Router();
const mongoose = require('../db/mongoose');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Seller = require('../models/seller');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

//POST /sellers

router.post('/',authenticate, (req, res) => {
    const body = _.pick(req.body, ['commonName','companyName', 'taxCode', 'address']);
    body._createdBy = req.user._id;
    body._createdAt = new Date();
    console.log(body._creator);
    const newSeller = new Seller(body);
    newSeller.save().then((seller) => {
        res.send(seller);
    }, (err) => {
        res.status(400).send(err);
    })
});

//GET /sellers
router.get('/getall', (req, res) => {
    Seller.find().then((sellers) => {
        res.send({ sellers });
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /sellers/12323434
router.get('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Seller.findOne({
        _id: id
    }).then((seller) => {
        if (!seller) {
            return res.status(404).send();
        }
        return res.status(200).send({ seller });
    }, (err) => {
        return res.status(404).send();
    });
});

//DELETE /sellers/:id
router.delete('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
        // throw new Error('id is not valid');
    }
    Seller.findOneAndRemove({
        _id: id
    }).then((seller) => {
        if (!seller) {
            return res.status(404).send();
        }
        return res.status(200).send({ seller });
    }, (err) => {
        return res.status(400).send(err);
    });
});

//PATCH /sellers/:id
router.patch(`/:id`,authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['commonName','companyName', 'taxCode', 'address']);
    body._modifiedBy = req.user._id;
    body._modifiedAt = new Date();
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Seller.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, { new: true }).then((seller) => {
        if (!seller) {
            res.status(404).send(e);
        }
        res.send({ seller });
    }).catch((e) => {
        res.status(400).send(e)
    });
});
module.exports = router;