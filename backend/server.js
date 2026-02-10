require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const DeviceModel = require('./models/DeviceModel');
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const testRoutes = require('./routes/test.routes');



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", subscriptionRoutes);
app.use("/api/dashboard", require("./routes/dashboard.route"));
app.use('/api', testRoutes);



// 🔹 MongoDB connection
mongoose.connect('mongodb://localhost:27017/cloud_app_db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
console.log('JWT_SECRET:', process.env.JWT_SECRET);

  res.json({
    token,
    role: user.role,
    firstLogin: !user.passwordChanged
  });
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

// 🔹 GET USERS
app.get('/api/users', async (req, res) => {
  try {
    console.log('RrrrrrrrrrrrAW BODY:', req.body);
    const users = await User.find({ isActive: true }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// 🔹 CREATE USER
const bcrypt = require('bcrypt');

app.post('/api/users', async (req, res) => {
  try {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaa BODY:', req.body);
    const { firstName, lastName, email, phone, role, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
      password: hashedPassword,
      isActive: true
    });

    await user.save();
    res.status(201).json({
      message: 'User created successfully'
    });

  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: 'Failed to create user',
      error: error.message
    });
  }
});

const superAdminRoutes = require('./routes/superAdmin.routes');
app.use('/api', superAdminRoutes);



// 🔹 TEST ROUTE
app.post('/api/test', (req, res) => {
  console.log('demo');
  res.send('ok');
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
