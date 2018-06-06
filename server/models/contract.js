const mongoose = require('mongoose');
const ContractSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    signDay: {
        type: Date,
        default: new Date()
    },
    apartmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Apartment'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Seller'
    },
    contractPrice: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Contract', ContractSchema);
