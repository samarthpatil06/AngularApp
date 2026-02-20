// ========================================
// 1. CONFIGURATION & ENVIRONMENT
// ========================================
require('dotenv').config(); // MUST be at the very top
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const subscriptionRoutes = require("./routes/subscriptionRoutes"); // Subscription routes


// Models
const User = require('./models/User');
const SuperUser = require('./models/SuperUser');  // ← ADD THIS
const DeviceModel = require('./models/DeviceModel');

// Services
const emailService = require('./services/emailService');
const app = express();

// Set dynamic values from process.env
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

// ========================================
// 2. MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());
app.use("/api/dashboard", require("./routes/dashboard.route"));
// app.use("/api", subscriptionRoutes); // Subscription routes

// ========================================
// 3. DATABASE CONNECTION (Senior Level)
// ========================================

// Critical Check: If DB_URI is missing, the app shouldn't even try to start.
if (!DB_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined in the environment.');
  console.error('Please check your .env file or Docker environment variables.');
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB at:', DB_URI.split('@').pop()); // Logs location without showing password
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
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
/**
 * SUPERUSER LOGIN
 * POST /api/superuser/login
 */
app.post('/api/superuser/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await SuperUser.findOne({ email, isActive: true });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('❌ SuperUser login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * SUPERUSER REGISTER
 * POST /api/superuser/create
 */
app.post('/api/superuser/create', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const superUser = new SuperUser({
      email,
      password: hashedPassword,
      role: role || 'admin',
      isActive: true
    });

    await superUser.save();

    return res.status(201).json({
      message: 'SuperUser created successfully',
      email: superUser.email,
      role: superUser.role
    });

  } catch (error) {
    console.error('❌ SuperUser creation error:', error);
    return res.status(500).json({ message: 'Error creating SuperUser' });
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
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive regex
      query = {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      };
    }

    const users = await User.find(query, { password: 0 });
    console.log(`✅ Fetched users with search "${search || 'ALL'}":`, users.length);
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
// Updated User Creation Route with Email
app.post('/api/users', async (req, res) => {
  try {
    console.log('🔵 Raw request body:', JSON.stringify(req.body, null, 2));

    const { firstName, lastName, email, phone, role, plan, password } = req.body;

    // Validation
    if (!firstName || !email || !password) {
      return res.status(400).json({
        message: `Missing required fields`
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // 🔥 Generate verification token
    const verificationToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    // Create new user with verification token
    const user = new User({
      firstName: firstName,
      lastName: lastName || '',
      email: email,
      phone: phone || '',
      password: password,
      role: role || 'User',
      plan: req.body.plan || 'basic',
      isActive: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: tokenExpiration
    });

    await user.save();
    console.log('✅ User saved to database with verification token');

    // Send activation email
    const userName = `${firstName} ${lastName}`.trim();
    const emailResult = await emailService.sendUserCreationEmail(email, userName, verificationToken);

    if (emailResult.success) {
      res.status(201).json({
        message: 'User created successfully. Please check your email to activate your account.',
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        emailSent: true
      });
    } else {
      res.status(201).json({
        message: 'User created but failed to send activation email.',
        data: {
          id: user._id,
          email: user.email
        },
        emailSent: false,
        emailError: emailResult.error
      });
    }

  } catch (error) {
    console.error('❌ Error adding user:', error);
    res.status(400).json({
      message: 'Failed to add user',
      error: error.message
    });
  }
});

// ==========================================
// ACTIVATE USER ACCOUNT
// ==========================================
app.post('/api/users/activate', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token and email are required'
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      email: email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired activation link'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Account is already activated',
        alreadyActivated: true
      });
    }

    // Activate user
    user.isEmailVerified = true;
    user.isActive = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    console.log('✅ User account activated:', user.email);

    res.status(200).json({
      success: true,
      message: 'Account activated successfully! You can now login.',
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('❌ Error activating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate account',
      error: error.message
    });
  }
});

// ==========================================
// RESEND USER VERIFICATION EMAIL
// ==========================================
app.post('/api/users/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already activated'
      });
    }

    // Generate new token
    const verificationToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = tokenExpiration;
    await user.save();

    // Resend email
    const userName = `${user.firstName} ${user.lastName}`.trim();
    const emailResult = await emailService.resendUserVerificationEmail(
      user.email,
      userName,
      verificationToken
    );

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Verification email resent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email'
      });
    }

  } catch (error) {
    console.error('❌ Error resending verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message
    });
  }
});

// ==========================================
// FORGOT PASSWORD
// ==========================================
app.post('/api/users/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    // Keep response generic to avoid account enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.'
      });
    }

    const resetToken = emailService.generateVerificationToken();
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const userName = `${user.firstName} ${user.lastName}`.trim();
    const emailResult = await emailService.sendPasswordResetEmail(
      user.email,
      userName,
      resetToken
    );

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message
    });
  }
});

// ==========================================
// RESET PASSWORD
// ==========================================
app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link'
      });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.'
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
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
    const { firstName, lastName, email, phone, role, plan, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        plan,
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
// Updated Device Creation Route with Email
// ==========================================
// DEVICE CREATION WITH TOKEN
// ==========================================
app.post('/api/device-models', async (req, res) => {
  try {
    const { userEmail, userName, ...deviceData } = req.body;

    console.log('📱 Device Data:', deviceData);
    console.log('👤 User Info:', { userEmail, userName });

    // Validate device data
    if (!deviceData.modelCode || !deviceData.modelName) {
      return res.status(400).json({
        message: 'Model code and name are required'
      });
    }

    // 🔥 Generate activation token
    const activationToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    // Create device model with activation token
    const deviceModel = new DeviceModel({
      ...deviceData,
      isActive: false,
      isActivated: false,
      activationToken: activationToken,
      activationExpires: tokenExpiration,
      addedByEmail: userEmail
    });

    await deviceModel.save();
    console.log('✅ Device model saved with activation token');

    // Send activation email if user info provided
    if (userEmail && userName) {
      const emailResult = await emailService.sendDeviceActivationEmail(
        userEmail,
        userName,
        deviceData,
        activationToken
      );

      if (emailResult.success) {
        res.status(201).json({
          message: 'Device added successfully. Activation email sent.',
          data: {
            id: deviceModel._id,
            modelCode: deviceModel.modelCode,
            modelName: deviceModel.modelName
          },
          emailSent: true
        });
      } else {
        res.status(201).json({
          message: 'Device added but failed to send activation email.',
          data: {
            id: deviceModel._id,
            modelCode: deviceModel.modelCode
          },
          emailSent: false
        });
      }
    } else {
      res.status(201).json({
        message: 'Device model added successfully',
        data: deviceModel,
        emailSent: false
      });
    }

  } catch (error) {
    console.error('❌ Error adding device:', error);
    res.status(400).json({
      message: 'Failed to add device model',
      error: error.message
    });
  }
});

// ==========================================
// ACTIVATE DEVICE
// ==========================================
app.post('/api/devices/activate', async (req, res) => {
  try {
    const { token, deviceId } = req.body;

    if (!token || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Token and device ID are required'
      });
    }

    // Find device with valid token
    const device = await DeviceModel.findOne({
      modelCode: deviceId,
      activationToken: token,
      activationExpires: { $gt: Date.now() }
    });

    if (!device) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired activation link'
      });
    }

    // Check if already activated
    if (device.isActivated) {
      return res.status(200).json({
        success: true,
        message: 'Device is already activated',
        alreadyActivated: true
      });
    }

    // Activate device
    device.isActivated = true;
    device.isActive = true;
    device.activatedAt = new Date();
    device.activationToken = null;
    device.activationExpires = null;

    await device.save();

    console.log('✅ Device activated:', device.modelCode);

    res.status(200).json({
      success: true,
      message: 'Device activated successfully!',
      data: {
        modelCode: device.modelCode,
        modelName: device.modelName,
        activatedAt: device.activatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error activating device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate device',
      error: error.message
    });
  }
});


// ==========================================
// RESEND DEVICE ACTIVATION EMAIL
// ==========================================
app.post('/api/devices/resend-activation', async (req, res) => {
  try {
    const { deviceId, userEmail } = req.body;

    if (!deviceId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Device ID and email are required'
      });
    }

    const device = await DeviceModel.findOne({ modelCode: deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    if (device.isActivated) {
      return res.status(400).json({
        success: false,
        message: 'Device is already activated'
      });
    }

    // Get user details
    const user = await User.findOne({ email: userEmail });
    const userName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : 'User';

    // Generate new token
    const activationToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    device.activationToken = activationToken;
    device.activationExpires = tokenExpiration;
    await device.save();

    // Resend email
    const deviceData = {
      modelCode: device.modelCode,
      modelName: device.modelName,
      numberOfChannels: device.numberOfChannels
    };

    const emailResult = await emailService.resendDeviceActivationEmail(
      userEmail,
      userName,
      deviceData,
      activationToken
    );

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Activation email resent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to resend activation email'
      });
    }

  } catch (error) {
    console.error('❌ Error resending activation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend activation email',
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
// app.listen(PORT, () => {
//   console.log(`🚀 Backend is running on port ${PORT}`);
// });
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running');
});
