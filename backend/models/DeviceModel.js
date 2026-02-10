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
    required: true,
    enum: ['°C', 'V/mV', 'mA/A', 'mbar', 'Lux', 'UL', 'ppm', 'bar', 'pH', 'uSiemens/mSiemens', 'cm/m']
  }
});

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
    required: true,
    min: 1,
    max: 8
  },
  channels: [channelSchema],
  macId: {
    type: String,
    default: ''
  },
  locationId: {
    type: String,
    default: ''
  },
  // 🔥 NEW: Device activation fields
  isActive: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String,
    default: null
  },
  activationExpires: {
    type: Date,
    default: null
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  activatedAt: {
    type: Date,
    default: null
  },
  // Track which user added the device
  addedByEmail: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeviceModel', deviceModelSchema);