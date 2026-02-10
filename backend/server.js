const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const DeviceModel = require('./models/DeviceModel');
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();


// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

app.use("/api", subscriptionRoutes);
app.use("/api/dashboard", require("./routes/dashboard.route"));


// ================= MONGODB =================
mongoose.connect('mongodb://127.0.0.1:27017/cloud_app_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));


// =================================================
// ================= ADMIN CHECK ====================
// =================================================
const checkAdmin = async (req, res, next) => {

  try {

    const email = req.headers.email;

    if (!email) {
      return res.status(401).json({
        message: "Access denied"
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "superadmin") {
      return res.status(403).json({
        message: "Admin only access"
      });
    }

    next();

  } catch (err) {

    res.status(500).json({
      message: "Auth error"
    });

  }

};


// =================================================
// ================= SETUP ADMIN ====================
// =================================================
app.get('/setup-admin', async (req, res) => {

  try {

    const email = "admin@gmail.com";
    const password = "123456";

    const exist = await User.findOne({ email });

    if (exist) {
      return res.send("Super Admin already exists.");
    }

    const hash = await bcrypt.hash(password, 10);

    const admin = new User({
      email,
      password: hash,
      role: "superadmin",
      isActive: true
    });

    await admin.save();

    res.send(`Super Admin created → ${email} / ${password}`);

  } catch (err) {

    res.status(500).send("Error: " + err.message);

  }

});


// =================================================
// ================= LOGIN ==========================
// =================================================
app.post('/api/login', async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({
      email,
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      message: "Login successful"
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


// =================================================
// ================= CREATE USER ====================
// ================= (ADMIN ONLY) ===================
// =================================================
app.post('/api/users', checkAdmin, async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      plan,
      licenseKey,
      password
    } = req.body;


    if (!email || !password || !plan || !licenseKey) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }


    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    const hash = await bcrypt.hash(password, 10);


    const user = new User({

      firstName,
      lastName,
      email,
      phone,

      plan,
      licenseKey,

      role: "user",

      password: hash,
      isActive: true
    });


    await user.save();


    res.status(201).json({
      message: "User created successfully"
    });


  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// =================================================
// ================= GET USERS ======================
// ================= (ADMIN ONLY) ===================
// =================================================
app.get('/api/users', checkAdmin, async (req, res) => {

  try {

    // ✅ ONLY NORMAL USERS (NO ADMIN)
    const users = await User.find({
      isActive: true,
      role: "user"
    }).select('-password');

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: "Fetch failed"
    });

  }

});


// =================================================
// ================= DELETE USER ====================
// ================= (ADMIN ONLY) ===================
// =================================================
app.delete('/api/users/:id', checkAdmin, async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: "Delete failed"
    });

  }

});


// =================================================
// ================= ADD DEVICE =====================
// ================= (ADMIN ONLY) ===================
// =================================================
app.post('/api/devices', checkAdmin, async (req, res) => {

  try {

    const device = new DeviceModel(req.body);

    await device.save();

    res.status(201).json({
      message: "Device added successfully"
    });

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

});


// =================================================
// ================= GET DEVICES ====================
// =================================================
app.get('/api/devices', async (req, res) => {

  try {

    const devices = await DeviceModel.find();

    res.json(devices);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// =================================================
// ================= DELETE DEVICE ==================
// ================= (ADMIN ONLY) ===================
// =================================================
app.delete('/api/devices/:id', checkAdmin, async (req, res) => {

  try {

    await DeviceModel.findByIdAndDelete(req.params.id);

    res.json({
      message: "Device deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: "Delete failed"
    });

  }

});


// =================================================
// ================= TEST ===========================
// =================================================
app.post('/api/test', (req, res) => {
  res.send('Backend working ✅');
});


// =================================================
// ================= SERVER =========================
// =================================================
app.listen(3000, () => {
  console.log('🚀 Backend running → http://localhost:3000');
});