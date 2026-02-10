const User = require("../models/User");
const DeviceModel = require("../models/DeviceModel");

const getDashboardSummary = async () => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const totalDeviceModels = await DeviceModel.countDocuments();

    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalDeviceModels,
    };
};

module.exports = { getDashboardSummary };