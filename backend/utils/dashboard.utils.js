const User = require("../models/User");
const DeviceModel = require("../models/DeviceModel");

const getDashboardSummary = async () => {

  // ✅ Count ONLY normal users (exclude admin)
  const totalUsers = await User.countDocuments({
    role: "user"
  });

  const activeUsers = await User.countDocuments({
    role: "user",
    isActive: true
  });

  const inactiveUsers = await User.countDocuments({
    role: "user",
    isActive: false
  });

  const totalDeviceModels = await DeviceModel.countDocuments();

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalDeviceModels,
  };
};

module.exports = { getDashboardSummary };