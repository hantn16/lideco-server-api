const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    age: Number,
    gender: {
        type: Number,
        required: true
    },
    idNo: {
        type: String,
        minlength: 9,
        required: true
    },
    dateOfIssue: {
        type: Date
    },
    placeOfIssue: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: String,
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

module.exports = mongoose.model('Employee', EmployeeSchema);