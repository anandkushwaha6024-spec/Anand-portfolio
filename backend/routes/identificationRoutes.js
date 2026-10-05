const express = require('express');
const router = express.Router();
const { getHistory, getHistoryItem, deleteHistory } = require('../controllers/identificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHistory);
router.get('/:id', protect, getHistoryItem);
router.delete('/:id', protect, deleteHistory);

module.exports = router;
