const express = require('express');
const router = express.Router();
const mongoose = require('../db/mongoose');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Apartment = require('../models/apartment');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

//POST /apartments

router.post('/',authenticate, (req, res) => {
    const body = _.pick(req.body, ['code', 'description', 'buildupArea','carpetArea','expectedPrice','status']);
    body._createdBy = req.user._id;
    // body._createdAt = new Date();
    const newApartment = new Apartment(body);
    newApartment.save().then((apartment) => {
        res.status(201).send(apartment);
    }, (err) => {
        res.status(400).send(err);
    })
});

//GET /apartments
router.get('/',authenticate, (req, res) => {
    Apartment.find().then((apartments) => {
        res.send({ apartments });
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /apartments/12323434
router.get('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Apartment.findOne({
        _id: id
    }).then((apartment) => {
        if (!apartment) {
            return res.status(404).send();
        }
        return res.status(200).send({ apartment });
    }, (err) => {
        return res.status(404).send();
    });
});

//DELETE /apartments/:id
router.delete('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
        // throw new Error('id is not valid');
    }
    Apartment.findOneAndRemove({
        _id: id
    }).then((apartment) => {
        if (!apartment) {
            return res.status(404).send();
        }
        return res.status(200).send({ apartment });
    }, (err) => {
        return res.status(400).send(err);
    });
});

//PATCH /apartments/:id
router.patch(`/:id`,authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['code', 'description', 'expectedPrice','status','buildupArea','carpetArea','_createdBy']);
    body._modifiedBy = req.user._id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Apartment.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, { new: true }).then((apartment) => {
        if (!apartment) {
            res.status(404).send(e);
        }
        res.send({ apartment });
    }).catch((e) => {
        res.status(400).send(e)
    });
});
module.exports = router;