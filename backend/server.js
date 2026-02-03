// ========================================
// IMPORTS & DEPENDENCIES
// ========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Models
const User = require('./models/User');
// const SuperUser = require('./models/Super_user');
const DeviceModel = require('./models/DeviceModel');

// ========================================
// APP CONFIGURATION
// ========================================
const app = express();
app.use(cors());
app.use(express.json());

// ========================================
// DATABASE CONNECTION
// ========================================
// mongoose.connect('mongodb://localhost:27017/cloud_app_db')
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cloud_app_db")
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ========================================
// AUTHENTICATION ROUTES
// ========================================

/**
 * LOGIN ROUTE
 * POST /api/login
 * Body: { email, password }
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Plain text comparison (use bcrypt in production)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    

    return res.json({
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * REGISTER ROUTE
 * POST /api/register
 * Body: { email, password, role }
 */
app.post('/api/register', async (req, res) => {
  const { firstName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
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
    console.error('❌ Register error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// ========================================
// USER MANAGEMENT ROUTES
// ========================================

/**
 * GET ALL USERS
 * GET /api/users
 * Returns: Array of users (password excluded)
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    console.log('✅ Fetched users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
});

/**
 * ADD NEW USER
 * POST /api/users
 * Body: { firstName, lastName, email, phone, password, role, isActive }
 */
app.post('/api/users', async (req, res) => {
  try {
    console.log('🔵 Raw request body:', JSON.stringify(req.body, null, 2));

    const { firstName, lastName, email, phone, role, password } = req.body;

    console.log('📋 Extracted fields:');
    console.log('  firstName:', firstName);
    console.log('  lastName:', lastName);
    console.log('  email:', email);
    console.log('  phone:', phone);
    console.log('  role:', role);
    console.log('  password:', password);

    // Validation
    if (!firstName || !email || !password) {
      return res.status(400).json({
        message: `Missing required fields. Received: { firstName: ${firstName}, email: ${email}, password: ${password} }`
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName: firstName,
      lastName: lastName || '',
      email: email,
      phone: phone || '',
      password: password,
      role: role || 'User',
      isActive: true
    });

    await user.save();

    console.log('✅ User saved to database:', user);

    res.status(201).json({
      message: 'User added successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Error adding user:', error);
    res.status(400).json({
      message: 'Failed to add user',
      error: error.message
    });
  }
});

/**
 * UPDATE USER
 * PUT /api/users/:id
 * Body: { firstName, lastName, email, phone, role, isActive }
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        isActive
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User updated:', user);

    res.status(200).json({
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(400).json({
      message: 'Failed to update user',
      error: error.message
    });
  }
});

/**
 * DELETE USER
 * DELETE /api/users/:id
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User deleted:', user);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(400).json({
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// ========================================
// DEVICE MODEL ROUTES
// ========================================

/**
 * ADD DEVICE MODEL
 * POST /api/device-models
 * Body: { name, description, specifications }
 */
app.post('/api/device-models', async (req, res) => {
  try {
    const deviceModel = new DeviceModel(req.body);
    await deviceModel.save();

    res.status(201).json({
      message: 'Device model added successfully',
      data: deviceModel
    });
  } catch (error) {
    console.error('❌ Error adding device model:', error);
    res.status(400).json({
      message: 'Failed to add device model',
      error: error.message
    });
  }
});

/**
 * GET ALL DEVICE MODELS
 * GET /api/device-models
 */
app.get('/api/device-models', async (req, res) => {
  try {
    const models = await DeviceModel.find({});
    console.log('✅ Fetched device models:', models);
    res.status(200).json(models);
  } catch (error) {
    console.error('❌ Error fetching device models:', error);
    res.status(500).json({
      message: 'Failed to fetch device models'
    });
  }
});

// ========================================
// TEST & UTILITY ROUTES
// ========================================

/**
 * DATABASE TEST ROUTE
 * GET /api/db-test
 */
app.get('/api/db-test', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send("Database not responding");
  }
});

/**
 * HEALTH CHECK ROUTE
 * GET /api/test
 */
app.get('/api/test', (req, res) => {
  console.log('✅ Test route called');
  res.send('OK, Backend is running');
});

// ========================================
// SERVER START
// ========================================
app.listen(3000, () => {
  console.log('🚀 Backend is running on port 3000');
});
