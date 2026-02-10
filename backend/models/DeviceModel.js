const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({

  channelNo: {
    type: Number,
    required: true
  },

  rangeLow: {
    type: Number,
    required: true
  },

  rangeHigh: {
    type: Number,
    required: true
  },

  unit: {
    type: String,
    enum: [
      '°C',
      'V/mV',
      'mA/A',
      'mbar',
      'Lux',
      'UL',
      'ppm',
      'bar',
      'pH',
      'uSiemens/mSiemens',
      'cm/m'
    ],
    required: true
  }

}, { _id: false });


const deviceModelSchema = new mongoose.Schema({

  modelCode: {
    type: String,
    required: true,
    unique: true
  },

  modelName: {
    type: String,
    required: true
  },

  numberOfChannels: {
    type: Number,
    required: true
  },

  channels: {
    type: [channelSchema],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('DeviceModel', deviceModelSchema);