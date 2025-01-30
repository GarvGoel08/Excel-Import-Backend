const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  sheetName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  verified: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExcelData', excelDataSchema);
