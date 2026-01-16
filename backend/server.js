const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // 👈 ADDED

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

// 🔹 TEST ROUTE
app.post('/api/test', (req, res) => {
  console.log('demo');
  res.send('ok');
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
