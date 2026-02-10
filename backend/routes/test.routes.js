const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const isSuperAdmin = require('../middlewares/isSuperAdmin');

router.get(
  '/super-test',
  authMiddleware,
  isSuperAdmin,
  (req, res) => {
    res.json({
      message: 'Super Admin access confirmed',
      user: req.user
    });
  }
);

module.exports = router;
