const express = require('express');
const router = express.Router();
const mongoose = require('../db/mongoose');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Contract = require('../models/contract');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

//POST /contracts

router.post('/',authenticate, (req, res) => {
    const body = _.pick(req.body, ['name', 'signDay', 'contractPrice']);
    body._createdBy = req.user._id;
    body._createdAt = new Date();
    const newContract = new Contract(body);
    newContract.save().then((contract) => {
        res.status(201).send(contract);
    }, (err) => {
        res.status(400).send(err);
    })
});

//GET /contracts
router.get('/',authenticate, (req, res) => {
    Contract.find().then((contracts) => {
        res.send({ contracts });
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /contracts/12323434
router.get('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Contract.findOne({
        _id: id
    }).then((contract) => {
        if (!contract) {
            return res.status(404).send();
        }
        return res.status(200).send({ contract });
    }, (err) => {
        return res.status(404).send();
    });
});

//DELETE /contracts/:id
router.delete('/:id',authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
        // throw new Error('id is not valid');
    }
    Contract.findOneAndRemove({
        _id: id
    }).then((contract) => {
        if (!contract) {
            return res.status(404).send();
        }
        return res.status(200).send({ contract });
    }, (err) => {
        return res.status(400).send(err);
    });
});

//PATCH /contracts/:id
router.patch(`/:id`,authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'idNo', 'dateOfIssue','placeOfIssue','phoneNumber','email']);
    body._modifiedBy = req.user._id;
    body._modifiedAt = new Date();
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Contract.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, { new: true }).then((contract) => {
        if (!contract) {
            res.status(404).send(e);
        }
        res.send({ contract });
    }).catch((e) => {
        res.status(400).send(e)
    });
});
module.exports = router;