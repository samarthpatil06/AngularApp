const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const isSuperAdmin = require('../middlewares/isSuperAdmin');
const superAdminController = require('../controllers/superAdmin.controller');

router.post(
  '/super/create-user',
  authMiddleware,
  isSuperAdmin,
  superAdminController.createUser
);

module.exports = router;
