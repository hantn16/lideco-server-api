const mongoose = require('mongoose');
const ApartmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: String,
  carpetArea: {
    type: Number
  },
  buildupArea: {
    type: Number
  },
  expectedPrice: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: Number,
    default: -1
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

module.exports = mongoose.model('Apartment', ApartmentSchema);
