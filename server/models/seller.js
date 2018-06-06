const mongoose = require('mongoose');
const SellerSchema = new mongoose.Schema({
    commonName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    taxCode: {
        type: String,
        minlength: 10,
        unique: true
    },
    address: {
        type: String
    },
    _createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
}, {
        timestamps: { createdAt: '_createdAt', updatedAt: '_modifiedAt' }
    });

module.exports = mongoose.model('Seller', SellerSchema);