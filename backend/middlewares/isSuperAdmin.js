const isSuperAdmin = (req, res, next) => {
  console.log('Decoded JWT user:', req.user);

  if (!req.user || req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      message: 'Access denied: Super Admin only',
    });
  }
  next();
};

module.exports = isSuperAdmin;
