const express = require('express');
const router = express.Router();
const mongoose = require('../db/mongoose');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Customer = require('../models/customer');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

//POST /customers

router.post('/',authenticate, (req, res) => {
    const body = _.pick(req.body, ['name', 'idNo', 'dateOfIssue','placeOfIssue','phoneNumber','email']);
    body._createdBy = req.user._id;
    body._createdAt = new Date();
    const newCustomer = new Customer(body);
    newCustomer.save().then((customer) => {
        res.status(201).send(customer);
    }, (err) => {
        res.status(400).send(err);
    })
});

//GET /customers
router.get('/',authenticate, (req, res) => {
    Customer.find().then((customers) => {
        res.send({ customers });
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /customers/12323434
router.get('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Customer.findOne({
        _id: id
    }).then((customer) => {
        if (!customer) {
            return res.status(404).send();
        }
        return res.status(200).send({ customer });
    }, (err) => {
        return res.status(404).send();
    });
});

//DELETE /customers/:id
router.delete('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
        // throw new Error('id is not valid');
    }
    Customer.findOneAndRemove({
        _id: id
    }).then((customer) => {
        if (!customer) {
            return res.status(404).send();
        }
        return res.status(200).send({ customer });
    }, (err) => {
        return res.status(400).send(err);
    });
});

//PATCH /customers/:id
router.patch(`/:id`,authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'idNo', 'dateOfIssue','placeOfIssue','phoneNumber','email']);
    body._modifiedBy = req.user._id;
    body._modifiedAt = new Date();
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Customer.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, { new: true }).then((customer) => {
        if (!customer) {
            res.status(404).send(e);
        }
        res.send({ customer });
    }).catch((e) => {
        res.status(400).send(e)
    });
});
module.exports = router;