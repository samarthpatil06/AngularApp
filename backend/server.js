const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const DeviceModel = require('./models/DeviceModel');


const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection

mongoose.connect('mongodb://localhost:27017/cloud_app_db') //For Docker use this
  // mongoose.connect("mongodb://172.31.8.124:27017/cloud_app_db") //For Docker use this
  // mongoose.connect("mongodb://127.0.0.1:27017/cloud_app_db") //For Local use this
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });


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

    //Bcrypt password comparison
    // const bcrypt = require('bcrypt');

    // if (!await bcrypt.compare(password, user.password)) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

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
    const models = await DeviceModel.find({});
    res.status(200).json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch device models'
    });
  }
});


app.get('/api/db-test', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database not responding");
  }
});


// 🔹 TEST ROUTE
app.get('/api/test', (req, res) => {
  console.log('demo');
  res.send('ok, Done project setup');
});


const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// More secure version - excludes passwords
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
