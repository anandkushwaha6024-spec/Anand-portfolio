const IdentificationHistory = require('../models/IdentificationHistory');

// @desc    Get identification history (with filtering and search)
// @route   GET /api/identifications
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const { result, startDate, endDate, search, limit = 50, page = 1 } = req.query;
    let query = {};

    // Non-admins can only see history logs they operated or matches of their user profile
    if (req.user.role !== 'ADMIN') {
      query.$or = [
        { identifiedBy: req.user._id },
        { userId: req.user._id }
      ];
    }

    if (result) {
      query.result = result;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { 'matchedUser.name': { $regex: search, $options: 'i' } },
        { 'matchedUser.email': { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await IdentificationHistory.countDocuments(query);
    const history = await IdentificationHistory.find(query)
      .populate('userId', 'name email profileImage role')
      .populate('identifiedBy', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      success: true,
      count: history.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single identification record by ID
// @route   GET /api/identifications/:id
// @access  Private
const getHistoryItem = async (req, res, next) => {
  try {
    const record = await IdentificationHistory.findById(req.params.id)
      .populate('userId', 'name email profileImage role isFaceEnrolled')
      .populate('identifiedBy', 'name email role');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Identification record not found.'
      });
    }

    // Access control: Admin or user involved
    if (
      req.user.role !== 'ADMIN' &&
      record.identifiedBy._id.toString() !== req.user._id.toString() &&
      (record.userId && record.userId._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this history record.'
      });
    }

    res.status(200).json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete identification history record
// @route   DELETE /api/identifications/:id
// @access  Private (Admin or Operator)
const deleteHistory = async (req, res, next) => {
  try {
    const record = await IdentificationHistory.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Identification record not found.'
      });
    }

    if (req.user.role !== 'ADMIN' && record.identifiedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this record.'
      });
    }

    await IdentificationHistory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Identification history record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  getHistoryItem,
  deleteHistory
};
