var express = require('express');
var router = express.Router();
var userRoutes = require('./user.routes');
var sellerRoutes = require('./seller.routes');
var customerRoutes = require('./customer.routes');
var contractRoutes = require('./contract.routes');
var apartmentRoutes = require('./apartment.routes');
var uploadRoutes = require('./upload.routes');

router.use('/users', userRoutes);
router.use('/sellers', sellerRoutes);
router.use('/customers', customerRoutes);
router.use('/contracts', contractRoutes);
router.use('/apartments', apartmentRoutes);
router.use('/upload',uploadRoutes);

module.exports = router;