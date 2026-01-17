const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const DeviceModel = require('./models/DeviceModel');


const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
mongoose.connect('mongodb://localhost:27017/cloud_app_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 🔹 LOGIN ROUTE (NOW USING DATABASE)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ⚠️ Plain text comparison for now
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 ADD DEVICE MODEL
app.post('/api/device-models', async (req, res) => {
  try {
    const deviceModel = new DeviceModel(req.body);
    await deviceModel.save();

    res.status(201).json({
      message: 'Device model added successfully',
      data: deviceModel
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Failed to add device model',
      error: error.message
    });
  }
});

// 🔹 GET DEVICE MODELS
app.get('/api/device-models', async (req, res) => {
  try {
    const models = await DeviceModel.find();
    res.status(200).json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch device models'
    });
  }
});



// 🔹 TEST ROUTE
app.post('/api/test', (req, res) => {
  console.log('demo');
  res.send('ok');
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
