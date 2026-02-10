const bcrypt = require('bcrypt');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const crypto = require('crypto');
const { sendCredentialsEmail } = require('../utils/sendEmail');

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      subscriptionPlan
    } = req.body;

    // 1️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2️⃣ Generate temp password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3️⃣ Generate subscription key (16 chars)
    const subscriptionKey = crypto.randomBytes(8).toString('hex');

    // 4️⃣ Calculate subscription dates
    const startDate = new Date();
    const months =
      subscriptionPlan === '3m' ? 3 :
      subscriptionPlan === '5m' ? 5 : 12;

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    // 5️⃣ Create subscription
    const subscription = await Subscription.create({
      subscriptionKey,
      planType: 'premium',
      status: 'active',
      startDate,
      endDate,
      activatedAt: startDate
    });

    // 6️⃣ Create user
    await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'User',
      subscriptionId: subscription._id,
      firstLogin: true,
      passwordChanged: false,
      isActive: true
    });

    // 7️⃣ Send credentials email to user
    const emailSent = await sendCredentialsEmail(email, firstName, tempPassword);
    if (!emailSent) {
      console.warn('Failed to send email to user, but user was created');
    }

    res.status(201).json({
      message: 'User created successfully. Credentials sent to email.',
      tempPassword,
      subscriptionKey
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
