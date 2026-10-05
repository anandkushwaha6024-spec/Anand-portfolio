const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Statistics & Analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from completed/paid or placed orders
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Sales analytics monthly breakdown (simulated/computed from real orders or seed dates)
    const monthlySalesMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize current year months
    const currentYear = new Date().getFullYear();
    months.forEach((m) => {
      monthlySalesMap[m] = { month: m, revenue: 0, orders: 0 };
    });

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const mName = months[d.getMonth()];
      if (monthlySalesMap[mName]) {
        monthlySalesMap[mName].revenue += o.totalAmount;
        monthlySalesMap[mName].orders += 1;
      }
    });

    // Recent 5 orders for dashboard table
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Category product distribution count
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      salesAnalytics: Object.values(monthlySalesMap),
      recentOrders,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
